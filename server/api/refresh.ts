import { PrismaClient } from "@prisma/client";
import { rounds_from_victory } from "../utils";
const prisma = new PrismaClient();

async function get_startgg(
    query: string,
    variables: object,
    paths: string[][]
) {
    const output: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    }

    return output;
}

export default defineEventHandler(async (_event) => {
    console.time();
    await prisma.social.deleteMany({});
    await prisma.set.deleteMany({});
    await prisma.standing.deleteMany({});
    await prisma.ranking.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.tournament.deleteMany({});

    const s7_majors = [
        // "tournament/gote-4thekids-7/event/rivals-of-aether-singles",
        // "tournament/na-rcs-season-7-june-online-major/event/rivals-of-aether-singles",
        // "tournament/double-down-2022/event/rivals-of-aether-singles",
        // "tournament/indie-showcase-ssc-2022/event/rivals-singles",
        // "tournament/riptide-2022/event/rivals-of-aether-singles",
        "tournament/the-big-house-10/event/rivals-of-aether-singles",
    ];

    for (const url of s7_majors) {
        console.log(`Getting data from ${url}`);
        console.log("Getting entrants and sets");
        const [entrants, sets] = await get_startgg(
            /* GraphQL */
            `
                query TournamentQuery($page: Int) {
                    event(
                        slug: "${url}"
                    ) {
                        entrants(query: { page: $page, perPage: 50 }) {
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
                        sets(page: $page, perPage: 50, sortType: STANDARD) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
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

            // async function get_seed(player) {
            //     const result = await prisma.standing.findFirstOrThrow({
            //         where: {
            //             player: {
            //                 smashggid:
            //                     player.participants[0].user.discriminator,
            //             },
            //             tournament: {
            //                 slug: url,
            //             },
            //         },
            //         select: {
            //             seed: true,
            //         },
            //     });
            //     return result.seed;
            // }

            // const [winnerSeed, loserSeed] = [
            //     await get_seed(winner),
            //     await get_seed(loser),
            // ];

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
                        tournament: {
                            connect: {
                                slug: url,
                            },
                        },
                        completedAt,
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
