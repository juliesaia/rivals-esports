import { PrismaClient } from "@prisma/client";
import { rounds_from_victory } from "../utils";

// TODO: when prisma adds relation support for computed values change uf to computed and remove from db
const prisma = new PrismaClient().$extends({
    result: {
        standing: {
            spr: {
                needs: { seed: true, placement: true },
                compute(standing) {
                    return (
                        rounds_from_victory(standing.seed) -
                        rounds_from_victory(standing.placement)
                    );
                },
            },
        },
        // set: {
        // uf: we dont have the technology
        // },
    },
});

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        return undefined;
    }

    if (query.h2h) {
        const result = await prisma.player.findFirst({
            where: {
                name: query.name.toString(),
            },
            select: {
                sets: {
                    select: {
                        winner: {
                            select: {
                                name: true,
                            },
                        },
                        loser: {
                            select: {
                                name: true,
                            },
                        },
                        tournament: {
                            select: {
                                name: true,
                            },
                        },
                        games: {
                            select: {
                                winnerChar: true,
                                loserChar: true,
                                id: true,
                                winner: {
                                    select: {
                                        name: true,
                                    },
                                },
                                loser: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                            orderBy: {
                                gameNumber: "asc",
                            },
                        },
                        uf: true,
                        winnerGameCount: true,
                        loserGameCount: true,
                        id: true,
                    },
                    where: {
                        players: {
                            some: {
                                name: query.h2h.toString(),
                            },
                        },
                    },
                    orderBy: {
                        completedAt: "desc",
                    },
                },
                _count: {
                    select: {
                        wins: {
                            where: {
                                loser: {
                                    is: {
                                        name: query.h2h.toString(),
                                    },
                                },
                            },
                        },
                        losses: {
                            where: {
                                winner: {
                                    is: {
                                        name: query.h2h.toString(),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return result;
    }

    console.time();

    const result = await prisma.player.findFirst({
        where: {
            name: {
                equals: query.name.toString(),
            },
        },
        select: {
            name: true,
            smashggid: true,
            pronouns: true,
            rankings: {
                select: {
                    rank: true,
                    season: true,
                },
            },
            socials: {
                select: {
                    type: true,
                    externalUsername: true,
                    id: true,
                },
            },
            _count: {
                select: {
                    wins: true,
                    losses: true,
                },
            },
            tournaments: {
                select: {
                    id: true,
                    season: true,
                    slug: true,
                    name: true,
                    standings: {
                        where: {
                            player: {
                                name: query.name.toString(),
                            },
                        },
                        select: {
                            seed: true,
                            spr: true,
                        },
                    },
                    sets: {
                        select: {
                            winner: {
                                select: {
                                    name: true,
                                },
                            },
                            loser: {
                                select: {
                                    name: true,
                                },
                            },
                            games: {
                                select: {
                                    winnerChar: true,
                                    loserChar: true,
                                    id: true,
                                    winner: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    loser: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    gameNumber: "asc",
                                },
                            },
                            uf: true,
                            winnerGameCount: true,
                            loserGameCount: true,
                            id: true,
                        },
                        orderBy: {
                            completedAt: "desc",
                        },
                        where: {
                            players: {
                                some: {
                                    name: query.name.toString(),
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!result) {
        return "error";
    }

    const characters = {};

    for (const tournament of result.tournaments) {
        for (const set of tournament.sets) {
            for (const game of set.games) {
                const character =
                    game.winner.name === query.name
                        ? game.winnerChar
                        : game.loserChar;

                if (!(character in characters)) {
                    characters[character] = 1;
                } else {
                    characters[character] += 1;
                }
            }
        }
    }

    const characters_list = Object.entries(characters);

    // @ts-ignore
    characters_list.sort(([, a], [, b]) => b - a);

    // eslint-disable-next-line dot-notation
    result["characters"] = characters_list;

    console.timeEnd();

    return result;
});
