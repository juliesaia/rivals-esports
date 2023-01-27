import { prisma } from "../prisma";
import { top50 } from "../lists/top50";
import { debugConsoleLogs } from "../constants";
import { ELOHandler } from "../eloSystem/ELOHandler";

export default defineEventHandler(async (_event) => {
    await prisma.ranking.deleteMany({});
    let queries = [];

    // Load all of top 50
    for (const season of Object.keys(top50)) {
        if (debugConsoleLogs) {
            console.log(`Loading ${season} top 50`);
        }
        for (const entry of top50[season]) {
            queries.push(
                prisma.ranking.create({
                    data: {
                        type: "top50",
                        ranking: entry.ranking,
                        rankingPeriod: parseInt(season.substring(6)),
                        player: entry.smashggID
                            ? {
                                  connect: {
                                      smashggid: entry.smashggID,
                                  },
                              }
                            : undefined,
                        extraInfo: entry.blurb,
                        character: entry.char,
                    },
                })
            );
        }
    }

    await prisma.$transaction(queries);

    console.log("Loaded all of top 50");

    // Load overall ELO
    const sets = await prisma.set.findMany({
        orderBy: {
            completedAt: "asc",
        },
        where: {
            loserGameCount: {
                not: -1,
            },
        },
        select: {
            winner: {
                select: {
                    smashggid: true,
                    name: true,
                },
            },
            loser: {
                select: {
                    smashggid: true,
                    name: true,
                },
            },
            winnerGameCount: true,
            loserGameCount: true,
        },
    });

    const overallELO: ELOHandler = new ELOHandler();

    for (const set of sets) {
        overallELO.runMatch(
            set.winner.smashggid,
            set.loser.smashggid,
            set.winner.smashggid
        );
    }

    const sortedPlayers = overallELO.players.sort(
        (a, b) => b.points - a.points
    );

    queries = [];

    for (let i = 0; i < sortedPlayers.length; i++) {
        queries.push(
            prisma.ranking.create({
                data: {
                    type: "elo",
                    ranking: i + 1,
                    points: sortedPlayers[i].points,
                    player: {
                        connect: {
                            smashggid: sortedPlayers[i].id,
                        },
                    },
                },
            })
        );
    }

    await prisma.$transaction(queries);

    console.log("Loaded overall elo");

    return "Refreshed all rankings";
});
