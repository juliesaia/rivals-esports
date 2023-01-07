// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const s7_majors = [
        "tournament/gote-4thekids-7/event/rivals-of-aether-singles",
        "tournament/na-rcs-season-7-june-online-major/event/rivals-of-aether-singles",
        "tournament/double-down-2022/event/rivals-of-aether-singles",
        "tournament/indie-showcase-ssc-2022/event/rivals-singles",
        "tournament/riptide-2022/event/rivals-of-aether-singles",
        "tournament/the-big-house-10/event/rivals-of-aether-singles",
        "tournament/heat-wave-5/event/rivals-of-aether-singles",
        "tournament/na-rcs-season-7-december-online-major/event/rivals-of-aether-singles",
    ];
    const result = await prisma.player.findMany({
        select: {
            name: true,
            tournaments: {
                select: {
                    eventSlug: true,
                },
            },
            sets: {
                select: {
                    tournament: {
                        select: {
                            eventSlug: true,
                            name: true,
                        },
                    },
                },
                where: {
                    tournament: {
                        eventSlug: {
                            in: s7_majors,
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
    });

    console.log(result);

    let count = 0;
    for (const player of result) {
        const seen = new Set();
        // if (count >= 4) {
        // console.log(player.name);
        for (const set of player.sets) {
            if (
                s7_majors.includes(set.tournament.eventSlug) &&
                !seen.has(set.tournament.name)
            ) {
                seen.add(set.tournament.name);
            }
        }

        if (seen.size === 3) {
            console.log(player.name);
            // console.log(seen);
            count += 1;
        }

        // }
    }
    console.log(count);

    // const result = await prisma.set.aggregate({
    //     _avg: {
    //         uf: true,
    //     },
    //     where: {
    //         tournament: {
    //             online: false,
    //             name: {
    //                 not: {
    //                     contains: "heat wave",
    //                 },
    //             },
    //         },
    //         order: {
    //             gte: 200,
    //         },
    //     },
    // });
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
