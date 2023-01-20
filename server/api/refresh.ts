import { rounds_from_victory, sleep } from "../utils";
import {
    character_dict,
    allTournaments,
    unknownPlayers,
    debugConsoleLogs,
    accountMerges,
    allLeagues,
} from "../constants";
import { prisma } from "../prisma";

async function get_startgg_basic(query: string) {
    let fetchRequest;
    try {
        fetchRequest = await $fetch("https://api.start.gg/gql/alpha", {
            body: { query },
            headers: {
                Authorization: "Bearer " + process.env.SMASHGGAPI,
            },
            method: "POST",
        });
    } catch (e) {
        console.log(e);
        console.log("Sleeping 1 min...");
        await sleep(60 * 1000);
        return get_startgg_basic(query);
    }

    if (fetchRequest.errors) {
        console.log(fetchRequest.errors);
    }

    return fetchRequest.data;
}

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

        let fetchRequest;

        try {
            fetchRequest = await $fetch("https://api.start.gg/gql/alpha", {
                body: { query, variables: { ...variables, page } },
                headers: {
                    Authorization: "Bearer " + process.env.SMASHGGAPI,
                },
                method: "POST",
            });
        } catch (e) {
            console.log(e);
            console.log("Sleeping 1 min...");
            await sleep(60 * 1000);
            continue;
        }

        // @ts-ignore
        const data = fetchRequest.data;
        // @ts-ignore
        const errors = fetchRequest.errors;

        if (errors) {
            if (errors[0].message.includes("limit")) {
                console.log("Rate limit exceeded, waiting 1min");
                await sleep(60 * 1000);
                console.log("Done waiting!");
                continue;
            }

            if (errors[0].message.includes("complexity")) {
                console.log("Complexity too high, lowering perPage");

                const perPageNumbers = [...query.match(/perPage: \d+/g)].map(
                    (x) => x.substring(8).trim()
                );

                for (const perPage of perPageNumbers) {
                    query = query.replaceAll(
                        perPage,
                        (parseInt(perPage) - 5).toString()
                    );
                }

                continue;
            }
        }

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
            console.error(errors);
            // eslint-disable-next-line no-throw-literal
            throw "Broke";
        }
    }

    return output;
}

export default defineEventHandler(async (_event) => {
    console.time();
    await prisma.league.deleteMany({});
    await prisma.social.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.set.deleteMany({});
    await prisma.standing.deleteMany({});
    await prisma.ranking.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.tournament.deleteMany({});

    let queries: any[] = [];

    for (const league of allLeagues) {
        queries.push(
            prisma.league.create({
                data: league,
            })
        );
    }

    const prismaLeagues = await prisma.$transaction(queries);

    let scuffedid = 0;

    const favorite_character_dict = {};

    for (const tourney of allTournaments.reverse()) {
        const url = tourney.url;
        console.log(`Getting data from ${url}`);

        const { event } = await get_startgg_basic(
            /* GraphQL */
            `
                query TournamentQuery {
                    event(
                        slug: "${url}"
                    ) {
                        tournament {
                            name
                            images {
                                url
                                type
                            }
                            addrState
                            city
                            slug
                            startAt
                            endAt
                            timezone
                        }
                        isOnline
                    }
                }
            `
        );

        const prismaTournament = await prisma.tournament.create({
            data: {
                slug: !event.tournament.slug.includes("road-to-shine")
                    ? event.tournament.slug
                    : url,
                eventSlug: url,
                // season: tourney.season,
                name: !event.tournament.slug.includes("road-to-shine")
                    ? event.tournament.name
                    : `${event.tournament.name} ${url
                          .split("/")
                          .pop()
                          .replaceAll("-", " ")}`,
                online: event.isOnline,
                state: event.tournament.addrState,
                city: event.tournament.city,
                startAt: event.tournament.startAt,
                endAt: event.tournament.endAt,
                timezone: event.tournament.timezone,
                profileImage:
                    event.tournament.images[0].type === "profile"
                        ? event.tournament.images[0]?.url
                        : event.tournament.images[1]?.url,
                bannerImage:
                    event.tournament.images[0].type === "banner"
                        ? event.tournament.images[0]?.url
                        : event.tournament.images[1]?.url,
            },
        });

        const leaguesToConnect = prismaLeagues
            .filter((league) =>
                tourney.leagues.some(
                    (el) =>
                        el.season === league.season &&
                        el.shortName === league.shortName
                )
            )
            .map((el) => ({
                id: el.id,
            }));

        if (leaguesToConnect.length > 0) {
            await prisma.tournament.update({
                where: {
                    id: prismaTournament.id,
                },
                data: {
                    leagues: {
                        connect: leaguesToConnect,
                    },
                },
            });
        }

        console.log("Created tournament");

        console.log("Getting entrants and sets");
        const [entrants, sets] = await get_startgg(
            /* GraphQL */
            `
                query TournamentQuery($page: Int) {
                    event(
                        slug: "${url}"
                    ) {
                        entrants(query: { page: $page, perPage: 25 }) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                id
                                seeds {
                                    seedNum
                                    phase {
                                        phaseOrder
                                    }
                                }
                                participants {
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
                                standing {
                                    placement
                                }
                            }
                        }
                        sets(page: $page, perPage: 30, sortType: STANDARD) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                id
                                slots {
                                    entrant {
                                        id
                                        name
                                        participants {
                                            gamerTag
                                            user {
                                                discriminator
                                            }
                                        }
                                    }
                                }
                                winnerId
                                round
                                displayScore
                                fullRoundText
                                phaseGroup {
                                    phase {
                                        name
                                        phaseOrder
                                    }
                                }
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

        let queries: any[] = [];

        const seed_dict = {};

        for (const entrant of entrants) {
            const player = entrant.participants[0].player;
            const user = player.user
                ? player.user
                : {
                      discriminator: null,
                      genderPronoun: null,
                      authorizations: [],
                  };

            if (!user.discriminator) {
                const unknownPlayerTag = unknownPlayers.find(
                    (x) => x.tag === player.gamerTag
                );
                if (unknownPlayerTag) {
                    user.discriminator = unknownPlayerTag.startggID;
                } else {
                    user.discriminator = `fake-${entrant.id}`;
                }
            }

            for (const account of accountMerges) {
                if (account.includes(user.discriminator)) {
                    user.discriminator = account[0];
                }
            }

            if (seed_dict[user.discriminator]) {
                continue;
            }

            let seed;

            if (entrant.seeds) {
                entrant.seeds.sort(
                    (a, b) => a.phase.phaseOrder - b.phase.phaseOrder
                );
                seed = entrant.seeds[0].seedNum;
            }

            seed_dict[user.discriminator] = seed;

            if (debugConsoleLogs) {
                console.log(
                    `entrant ${player.gamerTag} - ${user.discriminator} - ${seed}`
                );
            }

            let placement;
            if (entrant.standing) {
                placement = entrant.standing.placement;
            }
            queries.push(
                prisma.player.upsert({
                    where: {
                        smashggid: user.discriminator,
                    },
                    update: {
                        name: player.gamerTag,
                        tournaments: {
                            connect: {
                                eventSlug: url,
                            },
                        },
                        standings: {
                            create: {
                                placement,
                                seed,
                                tournament: {
                                    connect: {
                                        eventSlug: url,
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
                                eventSlug: url,
                            },
                        },
                        standings: {
                            create: {
                                placement,
                                seed,
                                tournament: {
                                    connect: {
                                        eventSlug: url,
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

        console.log("Prisma'd entrants!");

        queries = [];

        for (const set of sets) {
            const winner_id = set.winnerId;
            const player1 = set.slots[0].entrant;
            const player2 = set.slots[1].entrant;

            if (!player1.participants[0].user?.discriminator) {
                const unknownPlayerTag = unknownPlayers.find((x) =>
                    player1.name
                        .toLowerCase()
                        .trim()
                        .includes(x.tag.toLowerCase())
                );

                if (unknownPlayerTag) {
                    player1.participants = [
                        { user: { discriminator: unknownPlayerTag.startggID } },
                    ];
                } else {
                    player1.participants = [
                        {
                            gamerTag: player1.participants[0].gamerTag,
                            user: {
                                discriminator: `fake-${player1.id}`,
                            },
                        },
                    ];
                }
            }
            for (const account of accountMerges) {
                if (
                    player1.participants[0].user?.discriminator &&
                    account.includes(
                        player1.participants[0].user?.discriminator
                    )
                ) {
                    player1.participants[0].user.discriminator = account[0];
                }
            }
            if (!player2.participants[0].user?.discriminator) {
                const unknownPlayerTag = unknownPlayers.find((x) =>
                    player2.name
                        .toLowerCase()
                        .trim()
                        .includes(x.tag.toLowerCase())
                );

                if (unknownPlayerTag) {
                    player2.participants = [
                        { user: { discriminator: unknownPlayerTag.startggID } },
                    ];
                } else {
                    player2.participants = [
                        {
                            gamerTag: player2.participants[0].gamerTag,
                            user: {
                                discriminator: `fake-${player2.id}`,
                            },
                        },
                    ];
                }
            }
            for (const account of accountMerges) {
                if (
                    player2.participants[0].user?.discriminator &&
                    account.includes(
                        player2.participants[0].user?.discriminator
                    )
                ) {
                    player2.participants[0].user.discriminator = account[0];
                }
            }

            if (debugConsoleLogs) {
                console.log(
                    `p1 ${player1.participants[0].gamerTag} - ${player1.participants[0].user.discriminator}`
                );
                console.log(
                    `p2 ${player2.participants[0].gamerTag} - ${player2.participants[0].user.discriminator}`
                );
            }

            let order = 1;

            if (set.phaseGroup) {
                let scale;
                if (set.phaseGroup.phase.name.toLowerCase().includes("pools")) {
                    scale = 1;
                } else if (
                    set.phaseGroup.phase.name.toLowerCase().includes("top 256")
                ) {
                    scale = 2;
                } else if (
                    set.phaseGroup.phase.name
                        .toLowerCase()
                        .includes("top 128") ||
                    set.phaseGroup.phase.name.toLowerCase().includes("top 96")
                ) {
                    scale = 3;
                } else if (
                    set.phaseGroup.phase.name
                        .toLowerCase()
                        .includes("top 64") ||
                    set.phaseGroup.phase.name.toLowerCase().includes("top 48")
                ) {
                    scale = 4;
                } else if (
                    set.phaseGroup.phase.name.toLowerCase().includes("top 32")
                ) {
                    scale = 5;
                } else if (
                    set.phaseGroup.phase.name.toLowerCase().includes("top 16")
                ) {
                    scale = 6;
                } else if (
                    set.phaseGroup.phase.name.toLowerCase().includes("top 8") ||
                    set.phaseGroup.phase.name.toLowerCase().includes("top 6")
                ) {
                    scale = 7;
                } else if (
                    set.phaseGroup.phase.name.toLowerCase().includes("top 4")
                ) {
                    scale = 8;
                } else {
                    scale = set.phaseGroup.phase.phaseOrder;
                }
                order *= scale * 100;
            }
            order += Math.abs(set.round);

            if (set.fullRoundText.toLowerCase().includes("grand final")) {
                order += 25;
            }

            if (set.fullRoundText.toLowerCase().includes("reset")) {
                order += 25;
            }

            const [winner, loser] =
                player1.id === winner_id
                    ? [player1, player2]
                    : [player2, player1];

            let winnerGameCount = 0;
            let loserGameCount = -1;

            let wlFlag = false;

            if (
                set.displayScore.at(set.displayScore.indexOf(" - ") - 1) ===
                    "W" ||
                set.displayScore.at(-1) === "W"
            ) {
                wlFlag = true;
                winnerGameCount = 0;
                loserGameCount = 0;
            }

            if (!set.displayScore.startsWith("DQ") && !wlFlag) {
                // const gamecount1 = parseInt(
                //     set.displayScore.at(set.displayScore.indexOf(" - ") - 1)
                // );
                // const gamecount2 = parseInt(set.displayScore.at(-1));

                const splitNames = set.displayScore.split(" - ");
                const gamecount1 = splitNames[0].match(/\d+/g).pop();
                const gamecount2 = splitNames[1].match(/\d+/g).pop();

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
                                eventSlug: url,
                            },
                        },
                        order,
                        winnerGameCount,
                        loserGameCount,
                        // smashggid: set.id,
                        smashggid: scuffedid,
                        fullRoundText: set.fullRoundText,
                        phase: set?.phaseGroup?.phase?.name,
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
                    let winnerChar;
                    let loserChar;
                    if (game.selections) {
                        const selection1 = game.selections[0];
                        const selection2 = game.selections[1];

                        if (selection1) {
                            if (selection1.entrant.id === game.winnerId) {
                                winnerChar = selection1.selectionValue;
                            } else {
                                loserChar = selection1.selectionValue;
                            }
                        }

                        if (selection2) {
                            if (selection2.entrant.id === game.winnerId) {
                                winnerChar = selection2.selectionValue;
                            } else {
                                loserChar = selection2.selectionValue;
                            }
                        }
                    }

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

                    if (winnerChar) {
                        if (!(winnerDiscriminator in favorite_character_dict)) {
                            favorite_character_dict[winnerDiscriminator] = {
                                [character_dict[winnerChar]]: 1,
                            };
                        } else if (
                            !(
                                character_dict[winnerChar] in
                                favorite_character_dict[winnerDiscriminator]
                            )
                        ) {
                            favorite_character_dict[winnerDiscriminator][
                                character_dict[winnerChar]
                            ] = 1;
                        } else {
                            favorite_character_dict[winnerDiscriminator][
                                character_dict[winnerChar]
                            ] += 1;
                        }
                    }

                    if (loserChar) {
                        if (!(loserDiscriminator in favorite_character_dict)) {
                            favorite_character_dict[loserDiscriminator] = {
                                [character_dict[loserChar]]: 1,
                            };
                        } else if (
                            !(
                                character_dict[loserChar] in
                                favorite_character_dict[loserDiscriminator]
                            )
                        ) {
                            favorite_character_dict[loserDiscriminator][
                                character_dict[loserChar]
                            ] = 1;
                        } else {
                            favorite_character_dict[loserDiscriminator][
                                character_dict[loserChar]
                            ] += 1;
                        }
                    }

                    queries.push(
                        prisma.game.create({
                            data: {
                                winnerChar: character_dict[winnerChar],
                                loserChar: character_dict[loserChar],
                                gameNumber: game.orderNum,
                                set: {
                                    connect: {
                                        smashggid: scuffedid,
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
            scuffedid++;
        }

        await prisma.$transaction(queries);

        console.log("Prisma done!");
    }

    console.log("Favorite characters...");

    queries = [];

    for (const [discriminator, characters] of Object.entries(
        favorite_character_dict
    )) {
        const favoriteCharacter = Object.keys(characters).reduce(function (
            a,
            b
        ) {
            return characters[a] > characters[b] ? a : b;
        });

        queries.push(
            prisma.player.update({
                where: {
                    smashggid: discriminator,
                },
                data: {
                    favoriteCharacter,
                },
            })
        );
    }

    await prisma.$transaction(queries);

    console.log("Favorite characters done!");

    console.log("Getting rankings");

    // my api explorer exploded and honestly nobody really cares about rcs points anyway
    // const [standings] = await get_startgg(
    //     /* GraphQL */
    //     `
    //         query TournamentQuery($page: Int) {
    //             league(slug: "tournament/rcs7-north-america") {
    //                 standings(query: { perPage: 100, page: $page }) {
    //                     pageInfo {
    //                         totalPages
    //                     }
    //                     nodes {
    //                         player {
    //                             gamerTag
    //                             user {
    //                                 discriminator
    //                                 genderPronoun
    //                                 authorizations {
    //                                     externalUsername
    //                                     type
    //                                 }
    //                             }
    //                         }
    //                         placement
    //                     }
    //                 }
    //             }
    //         }
    //     `,
    //     {},
    //     [["league", "standings"]]
    // );

    queries = [];

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
    return { message: "Refreshed entire database!" };
});
