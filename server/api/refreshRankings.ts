import { prisma } from "../prisma";
import { top50 } from "../lists/top50";
import { debugConsoleLogs } from "../constants";
import { ELOHandler } from "../eloSystem/ELOHandler";

export default defineEventHandler(async (_event) => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }
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
    queries = [];

    console.log("Loaded all of top 50");

    // Load overall ELO
    const sets = await prisma.set.findMany({
        orderBy: {
            completedAt: "asc",
        },
        where: {
            NOT: {
                loserGameCount: -1,
            },
        },
        select: {
            winner: {
                select: {
                    smashggid: true,
                    name: true,
                    id: true,
                },
            },
            loser: {
                select: {
                    smashggid: true,
                    name: true,
                    id: true,
                },
            },
            winnerGameCount: true,
            loserGameCount: true,
            tournament: {
                select: {
                    leagues: {
                        select: {
                            season: true,
                            shortName: true,
                        },
                    },
                    rankingPeriod: true,
                },
            },
        },
    });

    const overallELO: ELOHandler = new ELOHandler();

    for (const set of sets) {
        overallELO.runMatch(set.winner.id, set.loser.id, 1);
    }

    const sortedPlayers = overallELO.getSortedPlayers();

    for (let i = 0; i < sortedPlayers.length; i++) {
        queries.push(
            prisma.ranking.create({
                data: {
                    type: "elo",
                    ranking: i + 1,
                    points: Math.round(sortedPlayers[i].points),
                    player: {
                        connect: {
                            id: sortedPlayers[i].id,
                        },
                    },
                    extraInfo: "overall",
                },
            })
        );
    }

    await prisma.$transaction(queries);
    queries = [];

    console.log("Loaded overall elo");

    // Load league-based ELO
    const allLeagues = await prisma.league.findMany({
        select: {
            season: true,
            id: true,
            shortName: true,
        },
    });

    for (const season of allLeagues) {
        const seasonSets = sets.filter((x) =>
            x.tournament.leagues?.find(
                (y) =>
                    y.season === season.season &&
                    y.shortName === season.shortName
            )
        );

        const seasonELO = new ELOHandler();

        for (const set of seasonSets) {
            seasonELO.runMatch(set.winner.id, set.loser.id, 1);
        }

        const sortedPlayers = seasonELO.getSortedPlayers();

        for (let i = 0; i < sortedPlayers.length; i++) {
            queries.push(
                prisma.ranking.create({
                    data: {
                        type: "elo",
                        ranking: i + 1,
                        points: Math.round(sortedPlayers[i].points),
                        player: {
                            connect: {
                                id: sortedPlayers[i].id,
                            },
                        },
                        league: {
                            connect: {
                                id: season.id,
                            },
                        },
                        extraInfo: "league-based",
                    },
                })
            );
        }

        await prisma.$transaction(queries);
        queries = [];

        console.log(
            `Loaded ELO for league ${season.shortName} - ${season.season}`
        );
    }

    // Load ranking period ELO
    const rankingPeriods = [
        ...new Set(sets.map((x) => x.tournament.rankingPeriod)),
    ].filter((x) => x !== null);

    for (const rankingPeriod of rankingPeriods) {
        const seasonSets = sets.filter(
            (x) => x.tournament.rankingPeriod === rankingPeriod
        );

        const seasonELO = new ELOHandler();

        for (const set of seasonSets) {
            seasonELO.runMatch(set.winner.id, set.loser.id, 1);
        }

        const sortedPlayers = seasonELO.getSortedPlayers();

        for (let i = 0; i < sortedPlayers.length; i++) {
            queries.push(
                prisma.ranking.create({
                    data: {
                        type: "elo",
                        ranking: i + 1,
                        points: Math.round(sortedPlayers[i].points),
                        player: {
                            connect: {
                                id: sortedPlayers[i].id,
                            },
                        },
                        rankingPeriod,
                        extraInfo: "rankingPeriod",
                    },
                })
            );
        }

        await prisma.$transaction(queries);
        queries = [];

        console.log(`Loaded ELO for ranking period ${rankingPeriod}`);
    }

    console.log("Refreshed all rankings");

    return "Refreshed all rankings";
});
