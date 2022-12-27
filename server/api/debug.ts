// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const result = await prisma.set.findMany({
        where: {
            NOT: {
                loserGameCount: -1,
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
            // games: {
            //     select: {
            //         winnerChar: true,
            //         loserChar: true,
            //         id: true,
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
            //     },
            //     orderBy: {
            //         gameNumber: "asc",
            //     },
            // },
            uf: true,
            winnerGameCount: true,
            loserGameCount: true,
            id: true,
            fullRoundText: true,
            phase: true,
        },
        orderBy: {
            uf: "desc",
        },
    });

    return result;
});
