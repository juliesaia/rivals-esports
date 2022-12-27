import { prisma } from "../prisma";
import { DirectedGraph } from "../graphTheory/graphs/DirectedGraph";
import { Edge, Node } from "../graphTheory/elements/AllElements";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    if (query.h2h) {
        const result = await prisma.player.findFirstOrThrow({
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
                        fullRoundText: true,
                        phase: true,
                    },
                    where: {
                        players: {
                            some: {
                                name: query.h2h.toString(),
                            },
                        },
                    },
                    orderBy: {
                        order: "desc",
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

    if (query.armadaNumber) {
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
                },
            },
            select: {
                id: true,
            },
        });

        const player2 = await prisma.player.findFirstOrThrow({
            where: {
                name: {
                    equals: query.armadaNumber.toString(),
                },
            },
            select: {
                id: true,
            },
        });

        const p1id = player1?.id;
        const p2id = player2?.id;

        if (!(p1id && p2id)) {
            throw new Error("not found");
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
            throw new Error("not found");
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

    console.time();

    const result = await prisma.player.findFirstOrThrow({
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
                            placement: true,
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
                            fullRoundText: true,
                            phase: true,
                        },
                        orderBy: {
                            order: "desc",
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
                orderBy: {
                    id: "desc",
                },
            },
        },
    });

    const characters = {};

    for (const tournament of result.tournaments) {
        for (const set of tournament.sets) {
            for (const game of set.games) {
                const character =
                    game.winner.name === result.name
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
