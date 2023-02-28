import fs from "fs";
import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const cache = { players: [], tournaments: [], player: {} };

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

    for (let i = 0; i < 100; i++) {
        const player_name = cache.players[i].name;
        const player_id = cache.players[i].id;

        console.log(`Caching ${player_name}`);

        const result = await prisma.player.findFirstOrThrow({
            where: {
                name: player_name,
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
                                    name: player_name,
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
                                        name: player_name,
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
                                        name: player_name,
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
        cache.player[player_name] = result;
    }

    fs.writeFile("server/cache.json", JSON.stringify(cache), (err) =>
        console.log(err)
    );
});

export const cache_promise = (async () =>
    JSON.parse(await fs.promises.readFile("server/cache.json", "utf8")))();
