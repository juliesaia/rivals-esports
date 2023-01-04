// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const result = await prisma.player.findMany({
        where: {
            AND: [
                {
                    wins: {
                        some: {
                            loser: {
                                name: "darai",
                            },
                        },
                    },
                },
                {
                    losses: {
                        none: {
                            winner: {
                                name: "darai",
                            },
                        },
                    },
                },
            ],
        },
        select: {
            name: true,
            wins: {
                where: {
                    loser: {
                        name: "darai",
                    },
                },
                select: {
                    tournament: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            // _count: {
            //     select: {
            //         wins: {
            //             where: {
            //                 loser: {
            //                     name: "darai",
            //                 },
            //             },
            //         },
            //     },
            // },
        },
    });

    return result;
});
