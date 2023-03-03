import { prisma } from "../prisma";
import {
    accoladeDefinitions as accolades,
    trophyRankings,
} from "../lists/accoladeDefinitions";
import { rcsFinales, seasons_dict } from "../dictionaries";
import { top50 } from "../lists/top50";
import { debugConsoleLogs } from "../constants";

export default defineEventHandler(async (_event) => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }
    await prisma.accolade.deleteMany({});
    if (debugConsoleLogs) {
        console.time();
    }

    const seasonFinales = Object.values(rcsFinales);
    const seasonCount = seasons_dict.RCS.length;
    const rocsSlugs = [
        "tournament/rocs-1-online-major",
        "tournament/rocs-2-online-major",
        "tournament/rocs-3-online-major",
        "tournament/rocs-4-online-major",
        "tournament/rocs-5-online-major",
        "tournament/rocs-6-online-major",
        "tournament/na-rocs-finals",
    ];

    const rcsLeagueIDs = await prisma.league.findMany({
        where: {
            shortName: "RCS",
        },
        select: {
            season: true,
            id: true,
        },
    });

    const players = await prisma.player.findMany({
        select: {
            id: true,
            name: true,
            sets: {
                select: {
                    id: true,
                    games: {
                        select: {
                            gameNumber: true,
                            winnerid: true,
                            winnerChar: true,
                            loserChar: true,
                        },
                    },
                    tournamentid: true,
                    tournament: {
                        select: {
                            rankingPeriod: true,
                        },
                    },
                    winnerid: true,
                    loserid: true,
                    loserGameCount: true,
                    loser: {
                        select: {
                            smashggid: true,
                        },
                    },
                },
            },
            standings: {
                select: {
                    placement: true,
                    tournament: {
                        select: {
                            state: true,
                            online: true,
                            name: true,
                            slug: true,
                            startAt: true,
                            id: true,
                            leagues: {
                                select: {
                                    season: true,
                                    shortName: true,
                                    id: true,
                                    _count: {
                                        select: {
                                            tournaments: {},
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const queries = [];

    for (const player of players) {
        const playerID = player.id;

        if (debugConsoleLogs) {
            console.log(`Creating accolades of ${player.name} - ${player.id}`);
        }

        let offlineAttended = 0;
        const statesCompetedIn = [];
        let rocsCount = 0;
        const countedSeasons = [];
        let rcsPrologueFlag = false;

        const seasonAttendanceCounts = {};
        for (let i = 1; i <= seasonCount; i++) {
            seasonAttendanceCounts[i] = 0;
        }

        const totalsPerSeason = {};

        for (const standing of player.standings) {
            const rcsInfo = standing.tournament.leagues.find(
                (x) => x.shortName === "RCS"
            );
            if (!standing.tournament.online) {
                offlineAttended++;
                statesCompetedIn.push(standing.tournament.state);
            }
            if (rocsSlugs.includes(standing.tournament.slug)) {
                rocsCount++;
            }
            if (rcsInfo) {
                countedSeasons.push(rcsInfo.season);
                seasonAttendanceCounts[rcsInfo.season]++;
                totalsPerSeason[rcsInfo.season] = rcsInfo._count.tournaments;
            }
            if (standing.tournament.slug === "tournament/rcs-prologue") {
                rcsPrologueFlag = true;
            }
            // Flawless/Perfect run
            if (standing.placement === 1) {
                let flawlessFlag = true;
                let perfectFlag = true;

                for (const set of player.sets.filter(
                    (x) => x.tournamentid === standing.tournament.id
                )) {
                    if (set.loserid === playerID) {
                        flawlessFlag = false;
                        perfectFlag = false;
                        break;
                    }
                    if (set.loserGameCount !== 0) {
                        flawlessFlag = false;
                    }
                }

                if (flawlessFlag) {
                    queries.push(
                        getQuery(accolades.flawlessRun, playerID, {
                            tournamentid: standing.tournament.id,
                        })
                    );
                } else if (perfectFlag) {
                    queries.push(
                        getQuery(accolades.perfectRun, playerID, {
                            tournamentid: standing.tournament.id,
                        })
                    );
                }
            }

            // Trophy checks
            if (standing.placement <= 32 && rcsInfo) {
                if (standing.placement === 1) {
                    if (seasonFinales.includes(standing.tournament.slug)) {
                        queries.push(
                            getQuery(accolades.seasonChampion, playerID, {
                                tournamentid: standing.tournament.id,
                                leagueid: standing.tournament.leagues[0].id,
                            })
                        );
                    } else {
                        queries.push(
                            getQuery(accolades.majorChampion, playerID, {
                                tournamentid: standing.tournament.id,
                            })
                        );
                    }
                } else {
                    const trophyIndex = Object.keys(trophyRankings).find(
                        (x) => parseInt(x) >= standing.placement
                    );

                    const trophy = trophyRankings[trophyIndex];

                    queries.push(
                        getQuery(trophy, playerID, {
                            tournamentid: standing.tournament.id,
                        })
                    );
                }
            }
        }

        for (const set of player.sets) {
            // Reverse 3-0
            if (set.winnerid === playerID && set.games.length > 1) {
                const games = set.games.sort(
                    (a, b) => a.gameNumber - b.gameNumber
                );
                if (
                    games[0].winnerid !== playerID &&
                    games[1].winnerid !== playerID
                ) {
                    queries.push(
                        getQuery(accolades.reverse30, playerID, {
                            tournamentid: set.tournamentid,
                            opponentid: set.loserid,
                            setid: set.id,
                        })
                    );
                }
            }

            // Master of many
            if (set.winnerid === playerID && set.games.length === 5) {
                const playedCharacters = [];
                for (const game of set.games) {
                    if (game.winnerid === playerID) {
                        playedCharacters.push(game.winnerChar);
                    } else {
                        playedCharacters.push(game.loserChar);
                    }
                }

                if (new Set(playedCharacters).size === 5) {
                    queries.push(
                        getQuery(accolades.masterOfMany, playerID, {
                            tournamentid: set.tournamentid,
                            opponentid: set.loserid,
                        })
                    );
                }
            }

            // Top 50 win checks
            const relevantSeason = set.tournament.rankingPeriod;

            if (relevantSeason && set.winnerid === playerID) {
                const loserTop50 = top50[`season${relevantSeason}`]?.find(
                    (x) => x.smashggID === set.loser.smashggid
                );

                if (loserTop50) {
                    const loserRanking = loserTop50.ranking;

                    queries.push(
                        getQuery(accolades.top50win, playerID, {
                            tournamentid: set.tournamentid,
                            opponentid: set.loserid,
                            setid: set.id,
                            number: loserRanking,
                        })
                    );
                }
            }
        }

        // Offline attendance
        if (offlineAttended >= 1) {
            queries.push(
                getQuery(accolades.offlineAttendance, playerID, {
                    number: offlineAttended,
                })
            );
        }

        // States travelled
        const stateCount = new Set(statesCompetedIn).size;

        if (stateCount >= 3) {
            queries.push(
                getQuery(accolades.statesTravelled, playerID, {
                    number: stateCount,
                })
            );
        }

        // All ROCS tournaments
        if (rocsCount === rocsSlugs.length) {
            queries.push(getQuery(accolades.allROCS, playerID));
        }

        // Every RCS season
        if (new Set(countedSeasons).size - 1 === seasonCount) {
            queries.push(getQuery(accolades.everyRCSSeason, playerID));
        }

        // Compete in prologue
        if (rcsPrologueFlag) {
            queries.push(getQuery(accolades.rcsPrologue, playerID));
        }

        // In-season attendance
        for (const season of Object.keys(seasonAttendanceCounts)) {
            if (seasonAttendanceCounts[season] > 0) {
                queries.push(
                    getQuery(accolades.attendanceInSeason, playerID, {
                        number: seasonAttendanceCounts[season],
                        max: totalsPerSeason[season],
                        leagueid: rcsLeagueIDs.find(
                            (x) => x.season === parseInt(season)
                        ).id,
                    })
                );
            }
        }
    }

    await prisma.$transaction(queries);

    if (debugConsoleLogs) {
        console.timeEnd();
    }

    return "Refreshed all achievements";
});

function getQuery(accolade: any, playerid: number, options?: any) {
    // Trophies
    if (accolade.rarity?.includes("-")) {
        return prisma.accolade.create({
            data: {
                type: "trophy",
                shortName: accolade.shortName,
                title: accolade.title,
                description: accolade.description,
                rarity: accolade.rarity,
                player: {
                    connect: {
                        id: playerid,
                    },
                },
                tournament: {
                    connect: {
                        id: options.tournamentid,
                    },
                },
                league: options?.leagueid
                    ? {
                          connect: {
                              id: options.leagueid,
                          },
                      }
                    : undefined,
            },
        });
    }

    let calcTitle, calcRarity, calcDescription;

    if (accolade.barriers) {
        const barriers: Array<number> = accolade.barriers;

        if (barriers) {
            let index;
            if (barriers[0] > barriers[barriers.length - 1]) {
                index = barriers.findIndex((x) => options.number >= x);
            } else {
                index = barriers.findIndex((x) => x >= options.number);
                options.number = undefined;
            }
            let barrier = barriers[index].toString();

            if (options.max) {
                index++;
            }
            if (options.number === options.max) {
                index = 0;
                barrier = "all";
            }

            const titleAndRarity = accolade.titlesAndRarities[index];

            calcTitle = titleAndRarity.title;
            calcRarity = titleAndRarity.rarity;
            calcDescription = accolade.description.replace("_x_", barrier);
        }
    }

    return prisma.accolade.create({
        data: {
            type: "achievement",
            shortName: accolade.shortName,
            title: calcTitle || accolade.title,
            description: calcDescription || accolade.description,
            rarity: calcRarity || accolade.rarity,
            player: {
                connect: {
                    id: playerid,
                },
            },
            tournament: options?.tournamentid
                ? {
                      connect: {
                          id: options.tournamentid,
                      },
                  }
                : undefined,
            opponent: options?.opponentid
                ? {
                      connect: {
                          id: options.opponentid,
                      },
                  }
                : undefined,
            league: options?.leagueid
                ? {
                      connect: {
                          id: options.leagueid,
                      },
                  }
                : undefined,
            set: options?.setid
                ? {
                      connect: {
                          id: options.setid,
                      },
                  }
                : undefined,
            count: options?.number,
        },
    });
}
