// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    const result = await prisma.player.count({
        where: {
            wins: {
                some: {},
            },
        },
    });

    return result;

    // const result = await prisma.player.findMany({
    //     select: {
    //         name: true,
    //         _count: {
    //             select: {
    //                 wins: true,
    //                 losses: true,
    //                 sets: true,
    //             },
    //         },
    //     },
    //     orderBy: {
    //         sets: {
    //             _count: "desc",
    //         },
    //     },
    // });

    // return result.filter(
    //     (player) =>
    //         player._count.wins + player._count.losses !== player._count.sets
    // );

    // const result = await prisma.player.findMany({
    //     select: {
    //         standings: {
    //             select: {
    //                 spr: true,
    //                 tournament: {
    //                     select: {
    //                         name: true,
    //                     },
    //                 },
    //             },
    //             where: {
    //                 tournament: {
    //                     online: false,
    //                 },
    //             },
    //         },
    //         name: true,
    //     },
    // });

    // const result = await prisma.player.findMany({
    //     select: {
    //         name: true,
    //         standings: {
    //             select: {
    //                 spr: true,
    //                 tournament: {
    //                     select: {
    //                         name: true,
    //                     },
    //                 },
    //             },
    //             where: {
    //                 tournament: {
    //                     online: false,
    //                 },
    //             },
    //         },
    //     },
    // });

    // const output = [];

    // for (const player of result) {
    //     if (player.standings.every((el) => el.spr < 0)) {
    //         output.push(player);
    //     }
    // }

    // output.sort((a, b) => (a.standings.length < b.standings.length ? 1 : -1));

    // return output;

    // const result = await prisma.player.findMany({
    //     where: {
    //         wins: {
    //             some: {
    //                 AND: [
    //                     {
    //                         loser: {
    //                             name: "CheesyPotato",
    //                         },
    //                     },
    //                     {
    //                         tournament: {
    //                             season: 7,
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //     },
    //     select: {
    //         name: true,
    //         _count: {
    //             select: {
    //                 wins: {
    //                     where: {
    //                         AND: [
    //                             {
    //                                 loser: {
    //                                     name: "CheesyPotato",
    //                                 },
    //                             },
    //                             {
    //                                 tournament: {
    //                                     season: 7,
    //                                 },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // });

    // const result = await prisma.set.findMany({
    //     where: {
    //         winner: {
    //             name: "CheesyPotato",
    //         },
    //         tournament: {
    //             season: 7,
    //         },
    //     },
    //     select: {
    //         uf: true,
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
    //     orderBy: {
    //         uf: "desc",
    //     },
    // });

    // const result = await prisma.player.findMany({
    //     where: {
    //         id: {
    //             in: [60108, 54983],
    //         },
    //     },
    //     select: {
    //         id: true,
    //         name: true,
    //         smashggid: true,
    //     },
    // });

    // const result = await prisma.player.findFirst({
    //     where: {
    //         name: "Penguin",
    //     },
    //     select: {
    //         name: true,
    //         tournaments: {
    //             where: {
    //                 name: "NA RCS Finals",
    //             },
    //             select: {
    //                 name: true,
    //                 standings: {
    //                     where: {
    //                         player: {
    //                             name: "Penguin",
    //                         },
    //                     },
    //                     orderBy: {
    //                         seed: "desc",
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // });

    // const result = await prisma.standing.findMany({
    //     where: {
    //         player: {
    //             name: "Squanto",
    //         },
    //         tournament: {
    //             season: 5,
    //         },
    //     },
    //     select: {
    //         placement: true,
    //         tournament: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //     },
    // });

    // const result = await prisma.standing.findMany({
    //     where: {
    //         tournament: {
    //             season: 6,
    //         },
    //         player: {
    //             name: "elpe",
    //         },
    //     },
    //     select: {
    //         spr: true,
    //         tournament: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //     },
    // });

    // console.log(result);

    // let sum = 0;
    // for (const standing of result) {
    //     if (!isNaN(standing.spr)) {
    //         sum += standing.spr;
    //     }
    // }

    // return sum / result.length;

    // prisma doesnt support aggregating computed values :(

    // const result = await prisma.set.findMany({
    //     where: {
    //         loser: {
    //             name: "CheesyPotato",
    //         },
    //         uf: {
    //             gt: 0,
    //         },
    //         AND: [
    //             {
    //                 tournament: {
    //                     startAt: {
    //                         gt: 1577836800,
    //                     },
    //                 },
    //             },
    //             {
    //                 tournament: {
    //                     endAt: {
    //                         lt: 1609459200,
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    //     select: {
    //         winner: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //         tournament: {
    //             select: {
    //                 name: true,
    //             },
    //         },
    //         uf: true,
    //     },
    // });

    // const s7_majors = [
    //     "tournament/gote-4thekids-7/event/rivals-of-aether-singles",
    //     "tournament/na-rcs-season-7-june-online-major/event/rivals-of-aether-singles",
    //     "tournament/double-down-2022/event/rivals-of-aether-singles",
    //     "tournament/indie-showcase-ssc-2022/event/rivals-singles",
    //     "tournament/riptide-2022/event/rivals-of-aether-singles",
    //     "tournament/the-big-house-10/event/rivals-of-aether-singles",
    //     "tournament/heat-wave-5/event/rivals-of-aether-singles",
    //     "tournament/na-rcs-season-7-december-online-major/event/rivals-of-aether-singles",
    // ];
    // const result = await prisma.player.findMany({
    //     select: {
    //         name: true,
    //         tournaments: {
    //             select: {
    //                 eventSlug: true,
    //             },
    //         },
    //         sets: {
    //             select: {
    //                 tournament: {
    //                     select: {
    //                         eventSlug: true,
    //                         name: true,
    //                     },
    //                 },
    //             },
    //             where: {
    //                 tournament: {
    //                     eventSlug: {
    //                         in: s7_majors,
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     orderBy: {
    //         sets: {
    //             _count: "desc",
    //         },
    //     },
    // });

    // console.log(result);

    // let count = 0;
    // for (const player of result) {
    //     const seen = new Set();
    //     // if (count >= 4) {
    //     // console.log(player.name);
    //     for (const set of player.sets) {
    //         if (
    //             s7_majors.includes(set.tournament.eventSlug) &&
    //             !seen.has(set.tournament.name)
    //         ) {
    //             seen.add(set.tournament.name);
    //         }
    //     }

    //     if (seen.size === 3) {
    //         console.log(player.name);
    //         // console.log(seen);
    //         count += 1;
    //     }

    //     // }
    // }
    // console.log(count);

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
