import { PrismaClient } from "@prisma/client";
import { rounds_from_victory, character_dict } from "../utils";
const prisma = new PrismaClient();

async function get_startgg(
    query: string,
    variables: object,
    paths: string[][]
) {
    const output: any[] = [];

    for (const _ of paths) {
        output.push([]);
    }

    let page = 1;

    while (true) {
        console.log(`Page ${page}...`);
        const { data } = await $fetch<any>("https://api.start.gg/gql/alpha", {
            body: { query, variables: { ...variables, page } },
            headers: {
                Authorization: "Bearer " + process.env.SMASHGGAPI,
            },
            method: "POST",
        });

        let temp = data;

        try {
            for (let i = 0; i < paths.length; i++) {
                temp = data;
                const path = paths[i];
                for (const slug of path) {
                    temp = temp[slug];
                }
                output[i] = [...output[i], ...temp.nodes];
            }

            if (page >= temp.pageInfo.totalPages) {
                break;
            }

            page++;
            console.log("Page done!");
        } catch (error) {
            console.error(data);
            // eslint-disable-next-line no-throw-literal
            throw "Broke";
        }
    }

    return output;
}

export default defineEventHandler(async (_event) => {
    console.time();
    await prisma.social.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.set.deleteMany({});
    await prisma.standing.deleteMany({});
    await prisma.ranking.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.tournament.deleteMany({});

    const s7_majors = {
        // "tournament/gote-4thekids-7/event/rivals-of-aether-singles",
        // "tournament/na-rcs-season-7-june-online-major/event/rivals-of-aether-singles",
        // "tournament/double-down-2022/event/rivals-of-aether-singles",
        // "tournament/indie-showcase-ssc-2022/event/rivals-singles",
        "tournament/riptide-2022/event/rivals-of-aether-singles":
            "Riptide 2022",
        "tournament/the-big-house-10/event/rivals-of-aether-singles":
            "The Big House 10",
    };

    for (const url in s7_majors) {
        console.log(`Getting data from ${url}`);
        console.log("Getting entrants and sets");
        const [entrants, sets] = await get_startgg(
            /* GraphQL */
            `
                query TournamentQuery($page: Int) {
                    event(
                        slug: "${url}"
                    ) {
                        entrants(query: { page: $page, perPage: 40 }) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                seeds {
                                    seedNum
                                }
                                standing {
                                    placement
                                    player {
                                        gamerTag
                                        user {
                                            discriminator
                                            genderPronoun
                                            authorizations {
                                                externalUsername
                                                type
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        sets(page: $page, perPage: 40, sortType: STANDARD) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                id
                                slots {
                                    entrant {
                                        id
                                        participants {
                                            user {
                                                discriminator
                                            }
                                        }
                                    }
                                }
                                winnerId
                                completedAt
                                displayScore
                                games {
                                    orderNum
                                    winnerId
                                    selections {
                                        selectionValue
                                        entrant {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            {},
            [
                ["event", "entrants"],
                ["event", "sets"],
            ]
        );

        console.log("Got entrants and sets!");

        console.log("Doing prisma...");

        await prisma.tournament.create({
            data: {
                slug: url,
                season: 7,
                name: s7_majors[url],
            },
        });

        let queries: any[] = [];

        const seed_dict = {};

        for (const entrant of entrants) {
            const player = entrant.standing.player;
            const user = player.user;
            const seed = entrant.seeds[0].seedNum;

            seed_dict[user.discriminator] = seed;

            const placement = entrant.standing.placement;
            queries.push(
                prisma.player.upsert({
                    where: {
                        smashggid: user.discriminator,
                    },
                    update: {
                        tournaments: {
                            connect: {
                                slug: url,
                            },
                        },
                        standings: {
                            create: {
                                placement,
                                seed,
                                tournament: {
                                    connect: {
                                        slug: url,
                                    },
                                },
                                // spr:
                                //     rounds_from_victory(seed) -
                                //     rounds_from_victory(placement),
                            },
                        },
                    },
                    create: {
                        name: player.gamerTag,
                        smashggid: user.discriminator,
                        pronouns: user.genderPronoun,
                        socials: {
                            create: user.authorizations,
                        },
                        tournaments: {
                            connect: {
                                slug: url,
                            },
                        },
                        standings: {
                            create: {
                                placement: entrant.standing.placement,
                                seed: entrant.seeds[0].seedNum,
                                tournament: {
                                    connect: {
                                        slug: url,
                                    },
                                },
                                // spr:
                                //     rounds_from_victory(seed) -
                                //     rounds_from_victory(placement),
                            },
                        },
                    },
                })
            );
        }

        await prisma.$transaction(queries);

        queries = [];

        for (const set of sets) {
            const winner_id = set.winnerId;
            const completedAt = set.completedAt;
            const player1 = set.slots[0].entrant;
            const player2 = set.slots[1].entrant;

            const [winner, loser] =
                player1.id === winner_id
                    ? [player1, player2]
                    : [player2, player1];

            let winnerGameCount = 0;
            let loserGameCount = -1;

            if (set.displayScore !== "DQ") {
                const gamecount1 = parseInt(
                    set.displayScore.at(set.displayScore.indexOf(" - ") - 1)
                );
                const gamecount2 = parseInt(set.displayScore.at(-1));

                winnerGameCount = Math.max(gamecount1, gamecount2);
                loserGameCount = Math.min(gamecount1, gamecount2);
            }
            // i hate smashgg, set.games is null sometimes for no reason
            // for (const game of set.games) {
            //     if (game.winnerId === winner.id) {
            //         winnerGameCount += 1;
            //     } else {
            //         loserGameCount += 1;
            //     }
            // }

            queries.push(
                prisma.set.create({
                    data: {
                        winner: {
                            connect: {
                                smashggid:
                                    winner.participants[0].user.discriminator,
                            },
                        },
                        loser: {
                            connect: {
                                smashggid:
                                    loser.participants[0].user.discriminator,
                            },
                        },
                        players: {
                            connect: [
                                {
                                    smashggid:
                                        winner.participants[0].user
                                            .discriminator,
                                },
                                {
                                    smashggid:
                                        loser.participants[0].user
                                            .discriminator,
                                },
                            ],
                        },
                        tournament: {
                            connect: {
                                slug: url,
                            },
                        },
                        completedAt,
                        winnerGameCount,
                        loserGameCount,
                        smashggid: set.id,
                        uf:
                            rounds_from_victory(
                                seed_dict[
                                    winner.participants[0].user.discriminator
                                ]
                            ) -
                            rounds_from_victory(
                                seed_dict[
                                    loser.participants[0].user.discriminator
                                ]
                            ),
                    },
                })
            );

            if (set.games) {
                for (const game of set.games) {
                    const selection1 = game.selections[0];
                    const selection2 = game.selections[1];
                    const [winnerChar, loserChar] =
                        selection1.entrant.id === game.winnerId
                            ? [
                                  selection1.selectionValue,
                                  selection2.selectionValue,
                              ]
                            : [
                                  selection2.selectionValue,
                                  selection1.selectionValue,
                              ];

                    const [winnerDiscriminator, loserDiscriminator] =
                        game.winnerId === set.winnerId
                            ? [
                                  winner.participants[0].user.discriminator,
                                  loser.participants[0].user.discriminator,
                              ]
                            : [
                                  loser.participants[0].user.discriminator,
                                  winner.participants[0].user.discriminator,
                              ];

                    queries.push(
                        prisma.game.create({
                            data: {
                                winnerChar: character_dict[winnerChar],
                                loserChar: character_dict[loserChar],
                                gameNumber: game.orderNum,
                                set: {
                                    connect: {
                                        smashggid: set.id,
                                    },
                                },
                                winner: {
                                    connect: {
                                        smashggid: winnerDiscriminator,
                                    },
                                },
                                loser: {
                                    connect: {
                                        smashggid: loserDiscriminator,
                                    },
                                },
                                players: {
                                    connect: [
                                        {
                                            smashggid: winnerDiscriminator,
                                        },
                                        {
                                            smashggid: loserDiscriminator,
                                        },
                                    ],
                                },
                            },
                        })
                    );
                }
            }
        }

        await prisma.$transaction(queries);

        console.log("Prisma done!");
    }

    console.log("Getting standings");

    const [standings] = await get_startgg(
        /* GraphQL */
        `
            query TournamentQuery($page: Int) {
                league(slug: "tournament/rcs7-north-america") {
                    standings(query: { perPage: 100, page: $page }) {
                        pageInfo {
                            totalPages
                        }
                        nodes {
                            player {
                                gamerTag
                                user {
                                    discriminator
                                    genderPronoun
                                    authorizations {
                                        externalUsername
                                        type
                                    }
                                }
                            }
                            placement
                        }
                    }
                }
            }
        `,
        {},
        [["league", "standings"]]
    );

    const queries: any[] = [];

    for (const standing of standings) {
        const player = standing.player;
        const user = player.user;

        queries.push(
            prisma.ranking.create({
                data: {
                    season: 7,
                    rank: standing.placement,
                    player: {
                        connectOrCreate: {
                            where: {
                                smashggid: user.discriminator,
                            },
                            create: {
                                name: player.gamerTag,
                                smashggid: user.discriminator,
                                pronouns: user.genderPronoun,
                                socials: {
                                    create: user.authorizations,
                                },
                            },
                        },
                    },
                },
            })
        );
    }

    await prisma.$transaction(queries);

    console.log("Everything done!");
    console.timeEnd();
});
