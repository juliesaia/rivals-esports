import fs from "fs";
import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }
    const cache = {
        players: [],
        players_min: [],
        tournaments: [],
        player: {},
        tournament: {},
    };

    const players_result = await prisma.player.findMany({
        select: {
            name: true,
            favoriteCharacter: true,
            id: true,
            _count: {
                select: {
                    sets: true,
                    wins: true,
                },
            },
            tournaments: {
                take: 1,
                orderBy: {
                    id: "asc",
                },
                select: {
                    name: true,
                    shortSlug: true,
                },
            },
        },
        orderBy: {
            sets: {
                _count: "desc",
            },
        },
    });

    cache.players = players_result;

    const players_min_result = await prisma.player.findMany({
        select: {
            name: true,
        },
        orderBy: {
            sets: {
                _count: "desc", // sort by "relevance"
            },
        },
    });

    cache.players_min = players_min_result.map((player) => player.name);

    const tournaments_result = await prisma.tournament.findMany({
        select: {
            name: true,
            // season: true,
            shortSlug: true,
            online: true,
            profileImage: true,
            startAt: true,
            city: true,
            state: true,
            timezone: true,
            leagues: {
                select: {
                    shortName: true,
                    season: true,
                },
            },
            _count: {
                select: {
                    entrants: true,
                },
            },
        },
        orderBy: {
            startAt: "desc",
        },
    });

    for (const tournament of tournaments_result) {
        if (!tournament.timezone) {
            tournament.timezone = "America/New_York";
        }
    }

    cache.tournaments = tournaments_result;
    console.log(tournaments_result);
    let misses = 0;

    for (let i = 0; i < cache.players.length; i++) {
        const player_name = cache.players[i].name.toLowerCase();
        const player_id = cache.players[i].id;

        console.log(`Caching ${player_name}`);

        if (!(player_name in cache.player)) {
            cache.player[player_name] = [];
        }

        if (player_name.includes("\\")) {
            continue;
        }

        const result = await prisma.player.findFirst({
            where: {
                name: {
                    equals: player_name,
                    mode: "insensitive",
                },
                id: player_id,
            },
            select: {
                name: true,
                id: true,
                smashggid: true,
                pronouns: true,
                favoriteCharacter: true,
                socials: {
                    select: {
                        type: true,
                        externalUsername: true,
                        id: true,
                    },
                },
                // _count: {
                //     select: {
                //         wins: true,
                //         losses: true,
                //         sets: true,
                //     },
                // },
                tournaments: {
                    select: {
                        id: true,
                        // season: true,
                        slug: true,
                        shortSlug: true,
                        name: true,
                        profileImage: true,
                        online: true,
                        leagues: {
                            select: {
                                name: true,
                                shortName: true,
                                iconImage: true,
                                season: true,
                            },
                        },
                        standings: {
                            where: {
                                player: {
                                    name: {
                                        equals: player_name,
                                        mode: "insensitive",
                                    },
                                    id: player_id,
                                },
                            },
                            select: {
                                seed: true,
                                spr: true,
                                placement: true,
                            },
                        },
                        sets: {
                            select: {
                                winner: {
                                    select: {
                                        name: true,
                                    },
                                },
                                loser: {
                                    select: {
                                        name: true,
                                    },
                                },
                                games: {
                                    select: {
                                        winnerChar: true,
                                        loserChar: true,
                                        id: true,
                                        winner: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        loser: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        gameNumber: "asc",
                                    },
                                },
                                uf: true,
                                winnerGameCount: true,
                                loserGameCount: true,
                                id: true,
                                fullRoundText: true,
                                phase: true,
                            },
                            orderBy: {
                                order: "desc",
                            },
                            where: {
                                players: {
                                    some: {
                                        name: {
                                            equals: player_name,
                                            mode: "insensitive",
                                        },
                                        id: player_id,
                                    },
                                },
                            },
                        },
                    },
                    where: {
                        sets: {
                            some: {
                                players: {
                                    some: {
                                        name: {
                                            equals: player_name,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        startAt: "desc",
                    },
                },
                accolades: {
                    include: {
                        set: {
                            select: {
                                tournament: {
                                    select: {
                                        leagues: {
                                            select: {
                                                season: true,
                                                shortName: true,
                                            },
                                        },
                                        online: true,
                                    },
                                },
                            },
                        },
                        tournament: {
                            select: {
                                leagues: {
                                    select: {
                                        season: true,
                                        shortName: true,
                                    },
                                },
                                online: true,
                            },
                        },
                        league: {
                            select: {
                                season: true,
                                shortName: true,
                                tournaments: {
                                    select: {
                                        online: true,
                                    },
                                },
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
            take: 1,
        });

        if (!result) {
            misses++;
            continue;
        }

        // @ts-ignore
        for (const accolade of result.accolades) {
            if (accolade.set != null) {
                accolade.online = [accolade.set.tournament.online];
                accolade.leagues = accolade.set.tournament.leagues;
                accolade.set = null;
            } else if (accolade.tournament != null) {
                accolade.online = [accolade.tournament.online];
                accolade.leagues = accolade.tournament.leagues;
                accolade.tournament = null;
            } else if (accolade.league != null) {
                accolade.online = [
                    accolade.league.tournaments.every((el) => el.online),
                ];
                accolade.leagues = [accolade.league];
                accolade.league = null;
            }
        }
        cache.player[player_name].push(result);
    }

    console.log(`misses: ${misses}`);

    for (const tournament of tournaments_result) {
        const tournament_name = tournament.name.toLowerCase();
        const tournament_slug = tournament.shortSlug.toLowerCase();
        const tournament_result = await prisma.tournament.findFirst({
            select: {
                name: true,
                // season: true,
                slug: true,
                shortSlug: true,
                state: true,
                city: true,
                profileImage: true,
                bannerImage: true,
                startAt: true,
                endAt: true,
                timezone: true,
                online: true,
                leagues: {
                    select: {
                        shortName: true,
                        season: true,
                    },
                },
                standings: {
                    select: {
                        placement: true,
                        seed: true,
                        spr: true,
                        player: {
                            select: {
                                name: true,
                                id: true,
                                favoriteCharacter: true,
                                losses: {
                                    take: 2,
                                    select: {
                                        id: true,
                                        winner: {
                                            select: {
                                                name: true,
                                                id: true,
                                                favoriteCharacter: true,
                                            },
                                        },
                                    },
                                    where: {
                                        OR: [
                                            {
                                                tournament: {
                                                    name: {
                                                        equals: tournament_name,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            },
                                            {
                                                tournament: {
                                                    slug: {
                                                        equals: tournament_slug, // shortSlug
                                                        mode: "insensitive",
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                OR: [
                    {
                        name: {
                            equals: tournament_name,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug: {
                            equals: tournament_slug, // shortSlug
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });

        cache.tournament[tournament_name] = tournament_result;
        cache.tournament[tournament_slug] = tournament_result;
    }

    fs.writeFile("server/cache.json", JSON.stringify(cache), (err) => {
        console.log(err);
        console.log("dont forget to restart nitro!");
    });
});

export const cache_promise = (async () =>
    JSON.parse(await fs.promises.readFile("server/cache.json", "utf8")))();
