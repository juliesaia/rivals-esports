import { debugConsoleLogs } from "../constants";
import { seasons_dict, rcsFinales } from "../dictionaries";
import { top50 } from "../lists/top50";
import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const seasonFinales = Object.values(rcsFinales);

    const playerName = Array.isArray(query.player)
        ? query.player[0]
        : query.player;

    if (debugConsoleLogs) {
        console.log(`Getting accolades of ${playerName}`);
        console.time();
    }

    let playerID;
    try {
        playerID = (
            await prisma.player.findFirstOrThrow({
                where: {
                    name: playerName,
                },
                select: {
                    id: true,
                },
            })
        ).id;
    } catch (e) {
        if (debugConsoleLogs) {
            console.timeEnd();
        }
        return { message: "player not found" };
    }

    const player = await prisma.player.findFirst({
        where: {
            id: playerID,
        },
        select: {
            id: true,
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
                            rankingPeriod: true,
                            sets: {
                                where: {
                                    OR: [
                                        {
                                            winnerid: playerID,
                                        },
                                        {
                                            loserid: playerID,
                                        },
                                    ],
                                },
                                select: {
                                    games: {
                                        select: {
                                            gameNumber: true,
                                            winnerid: true,
                                            winnerChar: true,
                                            loserChar: true,
                                        },
                                    },
                                    winnerid: true,
                                    loserid: true,
                                    loser: {
                                        select: {
                                            smashggid: true,
                                        },
                                    },
                                },
                            },
                            leagues: {
                                select: {
                                    season: true,
                                    shortName: true,
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

    const seasonCount = seasons_dict.RCS.length;

    const toReturn = {
        achievements: [],
        trophies: [],
    };

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

            for (const set of standing.tournament.sets) {
                if (set.loserid === playerID) {
                    flawlessFlag = false;
                    perfectFlag = false;
                    break;
                }
                if (set.games.length === 3) {
                    flawlessFlag = false;
                }
            }

            if (flawlessFlag) {
                toReturn.achievements.push(
                    getAchievement("flawlessRun", standing.tournament.name)
                );
            } else if (perfectFlag) {
                toReturn.achievements.push(
                    getAchievement("perfectRun", standing.tournament.name)
                );
            }
        }

        for (const set of standing.tournament.sets) {
            // Reverse 3-0
            if (set.winnerid === playerID && set.games.length > 1) {
                const games = set.games.sort(
                    (a, b) => a.gameNumber - b.gameNumber
                );
                if (
                    games[0].winnerid !== playerID &&
                    games[1].winnerid !== playerID
                ) {
                    toReturn.achievements.push(
                        getAchievement("reverse30", standing.tournament.name)
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
                    toReturn.achievements.push(
                        getAchievement("masterOfMany", standing.tournament.name)
                    );
                }
            }

            // Top 50 win checks
            const relevantSeason = standing.tournament.rankingPeriod;

            if (relevantSeason && set.winnerid === playerID) {
                const loserTop50 = top50[`season${relevantSeason}`]?.find(
                    (x) => x.smashggID === set.loser.smashggid
                );

                if (loserTop50) {
                    const index = top50Achievements.barriers.findIndex(
                        (x) => x >= loserTop50.ranking
                    );
                    const topX = top50Achievements.barriers[index].toString();

                    toReturn.achievements.push({
                        info: {
                            title: top50Achievements.title.replace("_x_", topX),
                            description: top50Achievements.description.replace(
                                "_x_",
                                topX
                            ),
                            rarity: top50Achievements.rarities[index],
                        },
                        instances: [standing.tournament.name],
                        count: 1,
                    });
                }
            }
        }

        // Trophy checks
        if (standing.placement <= 32 && rcsInfo) {
            if (standing.placement === 1) {
                if (seasonFinales.includes(standing.tournament.slug)) {
                    toReturn.trophies.push({
                        info: trophiesList.seasonChampion,
                        instances: [`RCS Season ${rcsInfo.season}`],
                        count: 1,
                    });
                } else {
                    toReturn.trophies.push({
                        info: trophiesList.majorChampion,
                        instances: [standing.tournament.name],
                        count: 1,
                    });
                }
            } else {
                const trophy = Object.values(trophiesList).find(
                    (x) => x.placement >= standing.placement
                );

                toReturn.trophies.push({
                    info: trophy,
                    instances: [standing.tournament.name],
                    count: 1,
                });
            }
        }
    }

    // Offline attendance
    if (offlineAttended >= 1) {
        toReturn.achievements.push(
            getAchievement("offlineAttendance", "Lifetime", offlineAttended)
        );
    }

    // States travelled
    const stateCount = new Set(statesCompetedIn).size;

    if (stateCount >= 3) {
        toReturn.achievements.push(
            getAchievement("statesTravelled", "Lifetime", stateCount)
        );
    }

    // All ROCS tournaments
    if (rocsCount === rocsSlugs.length) {
        toReturn.achievements.push(getAchievement("allROCS", "Lifetime"));
    }

    // Every RCS season
    if (new Set(countedSeasons).size - 1 === seasonCount) {
        toReturn.achievements.push(
            getAchievement("everyRCSSeason", "Lifetime")
        );
    }

    // Compete in prologue
    if (rcsPrologueFlag) {
        toReturn.achievements.push(getAchievement("rcsPrologue", "Lifetime"));
    }

    // In-season attendance
    for (const season of Object.keys(seasonAttendanceCounts)) {
        if (seasonAttendanceCounts[season] > 0) {
            toReturn.achievements.push(
                getAchievement(
                    "attendanceInSeason",
                    `RCS Season ${season}`,
                    seasonAttendanceCounts[season],
                    totalsPerSeason[season]
                )
            );
        }
    }

    // Summarize achievments
    const tempAchievements = [];
    for (const ach of toReturn.achievements) {
        const index = tempAchievements.findIndex(
            (x) => x.info.title === ach.info.title
        );
        if (index === -1) {
            tempAchievements.push(ach);
        } else {
            tempAchievements[index].instances.push(ach.instances[0]);
            tempAchievements[index].count++;
        }
    }

    toReturn.achievements = tempAchievements;

    // Summarize trophies
    const tempTrophies = [];
    for (const trophy of toReturn.trophies) {
        const index = tempTrophies.findIndex(
            (x) => x.info.title === trophy.info.title
        );
        if (index === -1) {
            tempTrophies.push(trophy);
        } else {
            tempTrophies[index].instances.push(trophy.instances[0]);
            tempTrophies[index].count++;
        }
    }

    toReturn.trophies = tempTrophies;

    if (debugConsoleLogs) {
        console.timeEnd();
    }

    return toReturn;
});

function getAchievement(
    name: string,
    instanceName?: string,
    totalCount?: number,
    maxPossible?: number
) {
    if (totalCount) {
        const category = achievementsList[name];
        let barrier = category.barriers.find((x) => totalCount >= x);
        let index = category.barriers.indexOf(barrier);
        if (maxPossible) {
            totalCount = 1;
            index++;
        }
        if (totalCount === maxPossible) {
            index = 0;
            barrier = "all";
        }
        const titleAndRarity = category.titlesAndRarities[index];
        return {
            info: {
                title: titleAndRarity.title,
                description: category.description.replace("_x_", barrier),
                rarity: titleAndRarity.rarity,
            },
            instances: [instanceName],
            count: totalCount,
        };
    }

    return {
        info: achievementsList[name],
        instances: [instanceName],
        count: 1,
    };
}

const achievementsList = {
    flawlessRun: {
        title: "Flawless run",
        description: "Win a tournament without losing a single game.",
        rarity: "master",
    },
    perfectRun: {
        title: "Perfect run",
        description: "Win a tournament without losing a single set.",
        rarity: "diamond",
    },
    reverse30: {
        title: "Reverse 3-0",
        description: "Win a set after losing the first two games.",
        rarity: "silver",
    },
    masterOfMany: {
        title: "Master of many",
        description: "Win a set while playing 5 different characters.",
        rarity: "master",
    },
    allROCS: {
        title: "Social distancing enthusiast",
        description: "Compete in every ROCS tournamnent.",
        rarity: "platinum",
    },
    everyRCSSeason: {
        title: "Lifetime competitor",
        description: "Compete in every RCS season.",
        rarity: "master",
    },
    rcsPrologue: {
        title: "Before it was cool",
        description: "Play in the RCS: Prologue tournament.",
        rarity: "silver",
    },
    offlineAttendance: {
        description: "Attend at least _x_ offline tournament(s).",
        titlesAndRarities: [
            {
                title: "Born for the crowd",
                rarity: "master",
            },
            {
                title: "Offline Warrior",
                rarity: "diamond",
            },
            {
                title: "LAN enthusiast",
                rarity: "platinum",
            },
            {
                title: "Familiar face",
                rarity: "gold",
            },
            {
                title: "Offline competitor",
                rarity: "silver",
            },
            {
                title: "First steps",
                rarity: "bronze",
            },
        ],
        barriers: [30, 20, 10, 5, 3, 1],
    },
    statesTravelled: {
        description: "Attend tournaments in at least _x_ different states.",
        titlesAndRarities: [
            {
                // eslint-disable-next-line quotes
                title: '"Globe"trotter',
                rarity: "master",
            },
            {
                title: "Frequent flyer",
                rarity: "diamond",
            },
            {
                title: "Roadtrip enjoyer",
                rarity: "platinum",
            },
            {
                title: "Explorer",
                rarity: "gold",
            },
        ],
        barriers: [15, 10, 5, 3],
    },
    attendanceInSeason: {
        description: "Attend _x_ RCS events in a single season.",
        titlesAndRarities: [
            {
                title: "Perfect attendance",
                rarity: "master",
            },
            {
                title: "Work-a-holic",
                rarity: "platinum",
            },
            {
                title: "Serial competitor",
                rarity: "gold",
            },
            {
                title: "Rivals enthusiast",
                rarity: "silver",
            },
            {
                title: "Seasonal competitor",
                rarity: "bronze",
            },
        ],
        barriers: [7, 5, 3, 1],
    },
};

const trophiesList = {
    seasonChampion: {
        title: "RCS Season Champion",
        rarity: "jeweled",
        placement: 1,
    },
    majorChampion: {
        title: "RCS Major Champion",
        rarity: "gold",
        placement: 1,
    },
    majorRunnerUp: {
        title: "RCS Major Runner-Up",
        rarity: "silver",
        placement: 2,
    },
    major3rdPlace: {
        title: "RCS Major 3rd Place Finisher",
        rarity: "bronze",
        placement: 3,
    },
    majorTop8: {
        title: "RCS Major Top 8 Finisher",
        rarity: "medal8",
        placement: 8,
    },
    majorTop32: {
        title: "RCS Major Top 32 Finisher",
        rarity: "medal32",
        placement: 32,
    },
};

const rocsSlugs = [
    "tournament/rocs-1-online-major",
    "tournament/rocs-2-online-major",
    "tournament/rocs-3-online-major",
    "tournament/rocs-4-online-major",
    "tournament/rocs-5-online-major",
    "tournament/rocs-6-online-major",
    "tournament/na-rocs-finals",
];

const top50Achievements = {
    title: "Top _x_ win",
    description: "Beat a player where they would go on to be ranked top _x_",
    rarities: ["master", "diamond", "platinum", "gold", "silver", "bronze"],
    barriers: [5, 10, 20, 30, 40, 50],
};

/*
Achievements:
    **Top-5 win (master): Beat a player where they would go on to be top 5
    **Top-10 win (diamond)
    **Top-20 win (platinum)
    **Top-30 win (gold)
    **Top-40 win (silver)
    **Top-50 win (bronze)

    **Flawless Run (master): Win a tournament without dropping a game
    **Perfect Run (diamond): Win a tournament without dropping a set

    **Reverse 3-0 (silver): Win a set with a reverse 3-0

    **Social distancing enthusiast (platinum): Compete in every ROCS bracket

    **Lifetime competitor (master): Play once in every rcs season
    **Before it was cool (silver): Play in the RCS: Prologue

    **Attend at least [30, 20, 10, 5, 3, 1] offline tournaments
        Born for the crowd (master)
        Offline warrior (diamond)
        LAN enthusiast (platinum)
        Familiar face (gold)
        Offline competitor (silver)
        First steps (bronze)

    **Attend events in at least [15, 10, 5, 3] different states
        "Globe"trotter (master)
        Frequent flyer (diamond)
        Roadtrip enjoyer (platinum)
        Explorer (gold)

    **Attend [all, 7, 5, 3, 1] rcs events in a single season
        Perfect attendance (master)
        Work-a-holic (platinum)
        Serial competitor (gold)
        Rivals enthusiast (silver)
        Seasonal competitor (bronze)

    **Master of many (master): win a set playing 5 unique characters.

Trophies:
    RCS Season Champion
        -Win a genesis/rcs finals
    RCS Major Champion
        -Win an official rcs tournament
    RCS Major runner-up
        -2nd in an official rcs tournament
    RCS Major 3rd place
        -3rd in an official rcs major
    RCS Major Top 8
        -Top 8 in an official rcs tournament
    RCS Major Top 32
        -Top 32 in an official rcs tournament
*/
