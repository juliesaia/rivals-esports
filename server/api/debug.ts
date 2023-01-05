// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const result = await prisma.set.aggregate({
        _avg: {
            uf: true,
        },
        where: {
            tournament: {
                online: false,
                name: {
                    not: {
                        contains: "heat wave",
                    },
                },
            },
            order: {
                gte: 200,
            },
        },
    });
    // const result = await prisma.set.findMany({
    //     select: {
    //         uf: true,
    //         winnerGameCount: true,
    //         loserGameCount: true,
    //         winner: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //         loser: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //         tournament: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //     },
    //     where: {
    //         tournament: {
    //             online: false,
    //         },
    //         NOT: {
    //             loserGameCount: -1,
    //         },
    //     },
    //     orderBy: {
    //         uf: "desc",
    //     },
    // });
    // const result = await prisma.player.findMany({
    //     where: {
    //         AND: [
    //             {
    //                 wins: {
    //                     some: {
    //                         loser: {
    //                             name: "darai",
    //                         },
    //                     },
    //                 },
    //             },
    //             {
    //                 losses: {
    //                     none: {
    //                         winner: {
    //                             name: "darai",
    //                         },
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    //     select: {
    //         name: true,
    //         wins: {
    //             where: {
    //                 loser: {
    //                     name: "darai",
    //                 },
    //             },
    //             select: {
    //                 tournament: {
    //                     select: {
    //                         name: true,
    //                     },
    //                 },
    //             },
    //         },
    //         // _count: {
    //         //     select: {
    //         //         wins: {
    //         //             where: {
    //         //                 loser: {
    //         //                     name: "darai",
    //         //                 },
    //         //             },
    //         //         },
    //         //     },
    //         // },
    //     },
    // });

    return result;
});
