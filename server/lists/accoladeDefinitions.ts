export const accoladeDefinitions = {
    // Achievements
    flawlessRun: {
        shortName: "flawlessRun",
        title: "Flawless Run",
        description: "Win a tournament without losing a single game.",
        rarity: "master",
    },
    perfectRun: {
        shortName: "perfectRun",
        title: "Perfect Run",
        description: "Win a tournament without losing a single set.",
        rarity: "diamond",
    },
    reverse30: {
        shortName: "reverse30",
        title: "Reverse 3-0",
        description: "Win a set after losing the first two games.",
        rarity: "silver",
    },
    masterOfMany: {
        shortName: "masterOfMany",
        title: "Master of Many",
        description: "Win a set while playing 5 different characters.",
        rarity: "master",
    },
    allROCS: {
        shortName: "allROCS",
        title: "Social Distancing Enthusiast",
        description: "Compete in every ROCS tournamnent.",
        rarity: "platinum",
    },
    everyRCSSeason: {
        shortName: "everyRCSSeason",
        title: "Lifetime Competitor",
        description: "Compete in every RCS season.",
        rarity: "master",
    },
    rcsPrologue: {
        shortName: "rcsPrologue",
        title: "Before it was Cool",
        description: "Play in the RCS: Prologue tournament.",
        rarity: "silver",
    },
    offlineAttendance: {
        shortName: "offlineAttendance",
        description: "Attend at least _x_ offline tournament(s).",
        titlesAndRarities: [
            {
                title: "Born for the Crowd",
                rarity: "master",
            },
            {
                title: "Offline Warrior",
                rarity: "diamond",
            },
            {
                title: "LAN Enthusiast",
                rarity: "platinum",
            },
            {
                title: "Familiar Face",
                rarity: "gold",
            },
            {
                title: "Offline Competitor",
                rarity: "silver",
            },
            {
                title: "First Steps",
                rarity: "bronze",
            },
        ],
        barriers: [30, 20, 10, 5, 3, 1],
    },
    statesTravelled: {
        shortName: "statesTravelled",
        description: "Attend tournaments in at least _x_ different states.",
        titlesAndRarities: [
            {
                // eslint-disable-next-line quotes
                title: '"Globe"trotter',
                rarity: "master",
            },
            {
                title: "Frequent Flyer",
                rarity: "diamond",
            },
            {
                title: "Roadtrip Enjoyer",
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
        shortName: "attendanceInSeason",
        description: "Attend _x_ RCS events in a single season.",
        titlesAndRarities: [
            {
                title: "Perfect Attendance",
                rarity: "master",
            },
            {
                title: "Work-a-holic",
                rarity: "platinum",
            },
            {
                title: "Serial Competitor",
                rarity: "gold",
            },
            {
                title: "Rivals Enthusiast",
                rarity: "silver",
            },
            {
                title: "Seasonal Competitor",
                rarity: "bronze",
            },
        ],
        barriers: [7, 5, 3, 1],
    },
    top50win: {
        shortName: "top50win",
        description:
            "Beat a player where they would go on to be ranked top _x_",
        titlesAndRarities: [
            {
                title: "Top 5 Win",
                rarity: "master",
            },
            {
                title: "Top 10 Win",
                rarity: "diamond",
            },
            {
                title: "Top 20 Win",
                rarity: "platinum",
            },
            {
                title: "Top 30 Win",
                rarity: "gold",
            },
            {
                title: "Top 40 Win",
                rarity: "silver",
            },
            {
                title: "Top 50 Win",
                rarity: "bronze",
            },
        ],
        barriers: [5, 10, 20, 30, 40, 50],
    },

    // Trophies
    seasonChampion: {
        shortName: "seasonChampion",
        title: "RCS Season Champion",
        description: "Win the finals of an RCS season.",
        rarity: "trophy-jeweled",
    },
    majorChampion: {
        shortName: "majorChampion",
        title: "RCS Major Champion",
        description: "Win an official RCS major.",
        rarity: "trophy-gold",
    },
    majorRunnerUp: {
        shortName: "majorRunnerUp",
        title: "RCS Major Runner-Up",
        description: "Place 2nd in an official RCS major.",
        rarity: "trophy-silver",
    },
    major3rdPlace: {
        shortName: "major3rdPlace",
        title: "RCS Major 3rd Place Finisher",
        description: "Place 3rd in an official RCS major.",
        rarity: "trophy-bronze",
    },
    majorTop8: {
        shortName: "majorTop8",
        title: "RCS Major Top 8 Finisher",
        description: "Place in the top 8 of an official RCS major.",
        rarity: "medal-8",
    },
    majorTop32: {
        shortName: "majorTop32",
        title: "RCS Major Top 32 Finisher",
        description: "Place in the top 32 of an official RCS major.",
        rarity: "medal-32",
    },
};

export const trophyRankings = {
    1: accoladeDefinitions.majorChampion,
    2: accoladeDefinitions.majorRunnerUp,
    3: accoladeDefinitions.major3rdPlace,
    8: accoladeDefinitions.majorTop8,
    32: accoladeDefinitions.majorTop32,
};
