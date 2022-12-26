import { PrismaClient } from "@prisma/client";
import { rounds_from_victory } from "../utils";
import { DirectedGraph } from "../graphTheory/graphs/DirectedGraph";
import { Edge, Node, Path } from "../graphTheory/elements/AllElements";

// TODO: when prisma adds relation support for computed values change uf to computed and remove from db
const prisma = new PrismaClient().$extends({
	result: {
		standing: {
			spr: {
				needs: { seed: true, placement: true },
				compute(standing) {
					return (
						rounds_from_victory(standing.seed ?? 0) -
						rounds_from_victory(standing.placement ?? 0)
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

	if (query.armadaNumber) {
		const allSets = await prisma.set.findMany({
			where: {
				loserGameCount: {
					not: -1,
				},
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
			},
		});

		const player1 = await prisma.player.findFirst({
			where: {
				name: {
					equals: query.name.toString(),
				},
			},
			select: {
				id: true,
			},
		});

		const player2 = await prisma.player.findFirst({
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
			return undefined;
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
			return "No link found";
		}

		return shortestPath
			?.getNodes()
			.map((x) => x.data.name)
			.join(" > ");
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
				orderBy: {
					id: "desc",
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
