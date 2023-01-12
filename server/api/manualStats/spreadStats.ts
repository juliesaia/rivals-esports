import { prisma } from "../../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (Array.isArray(query.min)) {
        query.min = query.min[0];
    }

    if (!parseInt(query.min)) {
        return "Input error";
    }

    let players = await prisma.player.findMany({
        select: {
            name: true,
            id: true,
        },
        where: {},
    });

    for (let i = 0; i < players.length; i++) {
        console.log(`${i + 1}/${players.length}`);
        const allSPR = await prisma.standing.findMany({
            where: {
                playerid: players[i].id,
            },
            select: {
                spr: true,
            },
        });

        if (allSPR.length < parseInt(query.min)) {
            players[i].avgSPR = null;
            continue;
        }

        players[i].avgSPR =
            allSPR.length > 0
                ? allSPR.map((x) => x.spr).reduce((a, b) => a + b) /
                  allSPR.length
                : 0;
    }

    players = players
        .filter((x) => x.avgSPR)
        .sort((a, b) => b.avgSPR - a.avgSPR);

    const highest = Object.assign({}, players[0]);
    const lowest = Object.assign({}, players[players.length - 1]);

    players = players
        .map((x) => {
            x.avgSPR = Math.abs(x.avgSPR);
            return x;
        })
        .sort((a, b) => b.avgSPR - a.avgSPR);

    const mostExtreme = players[0];
    const leastExtreme = players[players.length - 1];

    return `Highest ${highest.name} - ${highest.avgSPR} Lowest ${lowest.name} - ${lowest.avgSPR} Most Extreme ${mostExtreme.name} - ${mostExtreme.avgSPR} Least Extreme ${leastExtreme.name} - ${leastExtreme.avgSPR}`;
});
