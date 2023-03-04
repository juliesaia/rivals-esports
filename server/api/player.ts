// import fs from "fs";
import { prisma } from "../prisma";
import { DirectedGraph } from "../graphTheory/graphs/DirectedGraph";
import { Edge, Node } from "../graphTheory/elements/AllElements";
import { debugConsoleLogs } from "../constants";

export default defineEventHandler(async (event) => {
    console.timeEnd();
    console.time();
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    if (debugConsoleLogs) {
        console.log(query.name);
    }

    if (query.h2h) {
        if (query.name === query.h2h) {
            throw new Error("Can't h2h two of the same player.");
        }

        const result = await prisma.player.findFirstOrThrow({
            where: {
                name: {
                    equals: query.name.toString(),
                    mode: "insensitive",
                },
            },
            select: {
                sets: {
                    select: {
                        winner: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                        loser: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                        tournament: {
                            select: {
                                name: true,
                                slug: true,
                                // shortSlug: true,
                                profileImage: true,
                                leagues: {
                                    select: {
                                        name: true,
                                        shortName: true,
                                        iconImage: true,
                                        season: true,
                                    },
                                },
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
                        fullRoundText: true,
                        phase: true,
                    },
                    where: {
                        players: {
                            some: {
                                name: {
                                    equals: query.h2h.toString(),
                                    mode: "insensitive",
                                },
                            },
                        },
                        loserGameCount: {
                            not: -1,
                        },
                    },
                    orderBy: {
                        tournament: {
                            startAt: "desc",
                        },
                    },
                },
                _count: {
                    select: {
                        wins: {
                            where: {
                                loser: {
                                    is: {
                                        name: {
                                            equals: query.h2h.toString(),
                                            mode: "insensitive",
                                        },
                                    },
                                },
                                loserGameCount: {
                                    not: -1,
                                },
                            },
                        },
                        losses: {
                            where: {
                                winner: {
                                    is: {
                                        name: {
                                            equals: query.h2h.toString(),
                                            mode: "insensitive",
                                        },
                                    },
                                },
                                loserGameCount: {
                                    not: -1,
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                sets: {
                    _count: "desc",
                },
            },
            take: 1,
        });

        return result;
    }

    if (query.armadaNumber) {
        if (debugConsoleLogs) {
            console.log(
                `Getting ${query.armadaNumber.toString()} number of ${query.name.toString()}`
            );
        }
        if (query.name.toString() === query.armadaNumber.toString()) {
            return { sets: [], _count: { wins: 0, losses: 0 }, path: null };
        }
        const allSets = await prisma.set.findMany({
            where: {
                NOT: {
                    loserGameCount: -1,
                },
            },
            select: {
                winner: {
                    select: {
                        id: true,
                    },
                },
                loser: {
                    select: {
                        id: true,
                    },
                },
                id: true,
            },
        });

        const player1 = await prisma.player.findFirstOrThrow({
            where: {
                name: {
                    equals: query.name.toString(),
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
            },
            orderBy: {
                sets: {
                    _count: "desc",
                },
            },
            take: 1,
        });

        const player2 = await prisma.player.findFirstOrThrow({
            where: {
                name: {
                    equals: query.armadaNumber.toString(),
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
            },
            orderBy: {
                sets: {
                    _count: "desc",
                },
            },
            take: 1,
        });

        const p1id = player1?.id;
        const p2id = player2?.id;

        if (!(p1id && p2id)) {
            // throw new Error("not found");
            return { sets: [], _count: { wins: 0, losses: 0 }, path: null };
        }

        const edges: Edge[] = [];

        for (let i = 0; i < allSets.length; i++) {
            const node1 = new Node(allSets[i].winner, allSets[i].winner.id);
            const node2 = new Node(allSets[i].loser, allSets[i].loser.id);
            edges.push(new Edge(node1, node2, allSets[i]));
        }

        const graph = new DirectedGraph(edges);

        const shortestPath = graph.getShortestDistance(p1id, p2id);

        if (!shortestPath) {
            // throw new Error("not found");
            return { sets: [], _count: { wins: 0, losses: 0 }, path: null };
        }

        const edgeids = shortestPath.edges.map((el) => el.metadata.id);

        const queries = edgeids.map((edgeid: number) =>
            prisma.set.findFirstOrThrow({
                where: {
                    id: edgeid,
                },
                select: {
                    winner: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    loser: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    tournament: {
                        select: {
                            name: true,
                            profileImage: true,
                            leagues: {
                                select: {
                                    name: true,
                                    shortName: true,
                                    iconImage: true,
                                    season: true,
                                },
                            },
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
                    fullRoundText: true,
                    phase: true,
                },
            })
        );

        const sets = await prisma.$transaction(queries);

        const path = sets.map((el) => el.loser.name);

        path.unshift(sets[0].winner.name);

        const pathstring = path.join(" > ");

        return { sets, path: pathstring };
    }

    const result = await prisma.player.findFirstOrThrow({
        where: {
            name: {
                equals: query.name.toString(),
                mode: "insensitive",
            },
            id: query.id ? parseInt(query.id as string) : undefined,
        },
        select: {
            name: true,
            smashggid: true,
            pronouns: true,
            favoriteCharacter: true,
            socials: {
                select: {
                    type: true,
                    externalUsername: true,
                    id: true,
                },
            },
            // _count: {
            //     select: {
            //         wins: true,
            //         losses: true,
            //         sets: true,
            //     },
            // },
            tournaments: {
                select: {
                    id: true,
                    // season: true,
                    slug: true,
                    // shortSlug: true,
                    name: true,
                    profileImage: true,
                    online: true,
                    leagues: {
                        select: {
                            name: true,
                            shortName: true,
                            iconImage: true,
                            season: true,
                        },
                    },
                    standings: {
                        where: {
                            player: {
                                name: {
                                    equals: query.name.toString(),
                                    mode: "insensitive",
                                },
                                id: query.id
                                    ? parseInt(query.id as string)
                                    : undefined,
                            },
                        },
                        select: {
                            seed: true,
                            // spr: true,
                            placement: true,
                        },
                    },
                    sets: {
                        select: {
                            winner: {
                                select: {
                                    name: true,
                                    id: true,
                                },
                            },
                            loser: {
                                select: {
                                    name: true,
                                    id: true,
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
                            fullRoundText: true,
                            phase: true,
                        },
                        orderBy: {
                            order: "desc",
                        },
                        where: {
                            players: {
                                some: {
                                    name: {
                                        equals: query.name.toString(),
                                        mode: "insensitive",
                                    },
                                    id: query.id
                                        ? parseInt(query.id as string)
                                        : undefined,
                                },
                            },
                        },
                    },
                },
                where: {
                    sets: {
                        some: {
                            players: {
                                some: {
                                    name: {
                                        equals: query.name.toString(),
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    startAt: "desc",
                },
            },
            accolades: {
                include: {
                    set: {
                        select: {
                            tournament: {
                                select: {
                                    leagues: {
                                        select: {
                                            season: true,
                                            shortName: true,
                                        },
                                    },
                                    online: true,
                                },
                            },
                        },
                    },
                    tournament: {
                        select: {
                            leagues: {
                                select: {
                                    season: true,
                                    shortName: true,
                                },
                            },
                            online: true,
                        },
                    },
                    league: {
                        select: {
                            season: true,
                            shortName: true,
                            tournaments: {
                                select: {
                                    online: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            sets: {
                _count: "desc",
            },
        },
        take: 1,
    });

    for (const accolade of result.accolades) {
        if (accolade.set != null) {
            accolade.online = [accolade.set.tournament.online];
            accolade.leagues = accolade.set.tournament.leagues;
            accolade.set = null;
        } else if (accolade.tournament != null) {
            accolade.online = [accolade.tournament.online];
            accolade.leagues = accolade.tournament.leagues;
            accolade.tournament = null;
        } else if (accolade.league != null) {
            accolade.online = [
                accolade.league.tournaments.every((el) => el.online),
            ];
            accolade.leagues = [accolade.league];
            accolade.league = null;
        }
    }
    console.timeEnd();
    // console.time();
    // console.log(JSON.stringify(result).length);
    // console.log(JSON.stringify(compress_one(result)).length);

    // console.timeEnd();

    // FUTURE JULIE DO NOT USE COMPRESSION THIS IS WHY SSR EXISTS!!!

    if (!result) {
        throw createError({ statusCode: 404, message: "Player not found." });
    }

    return result;
});
