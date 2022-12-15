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

    console.time();

    // const tournaments = await prisma.player.findFirstOrThrow({
    //     where: {
    //         name: {
    //             equals: query.name.toString(),
    //         },
    //     },
    //     select: {
    //         tournaments: {
    //             select: {
    //                 id: true,
    //             },
    //         },
    //     },
    // });

    // const tournament_ids: number[] = [];

    // for (const tournament of tournaments.tournaments) {
    //     tournament_ids.push(tournament.id);
    // }

    const result = await prisma.player.findFirst({
        where: {
            name: {
                equals: query.name.toString(),
            },
        },
        include: {
            rankings: true,
            socials: true,
            tournaments: {
                include: {
                    standings: {
                        where: {
                            player: {
                                name: {
                                    equals: query.name.toString(),
                                },
                            },
                        },
                        select: {
                            seed: true,
                            spr: true,
                        },
                    },
                    sets: {
                        select: {
                            winner: true,
                            loser: true,
                            uf: true,
                        },
                        orderBy: {
                            completedAt: "desc",
                        },
                        where: {
                            OR: [
                                {
                                    winner: {
                                        is: {
                                            name: query.name.toString(),
                                        },
                                    },
                                },
                                {
                                    loser: {
                                        is: {
                                            name: query.name.toString(),
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },

            // wins: {
            //     include: {
            //         loser: true,
            //     },
            // },
            // losses: true,
        },
    });

    // let queries: any[] = [];

    // for (const tournament of result?.tournaments ?? []) {
    //     for (const set of tournament.sets) {
    //         const won = set.winner.name === query.name.toString();

    //         queries.push(
    //             prisma.standing.findFirst({
    //                 where: {
    //                     player: {
    //                         smashggid: won
    //                             ? set.loser.smashggid
    //                             : set.winner.smashggid,
    //                     },
    //                     tournament: {
    //                         slug: tournament.slug,
    //                     },
    //                 },
    //                 select: {
    //                     seed: true,
    //                 },
    //             })
    //         );
    //         // console.log(
    //         //     `UF: ${
    //         //         won
    //         //             ? tournament.standings[0].seed - other_seed.seed
    //         //             : other_seed.seed - tournament.standings[0].seed
    //         //     }`
    //         // );
    //     }
    // }

    // await prisma.$transaction(queries);

    console.timeEnd();

    return result;
});
