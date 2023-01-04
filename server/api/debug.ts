// debug sandbox

import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const result = await prisma.player.findFirstOrThrow({
        where: {
            name: {
                equals: "Penguin",
            },
        },
        select: {
            name: true,
            smashggid: true,
            pronouns: true,
            favoriteCharacter: true,
            rankings: {
                select: {
                    rank: true,
                    season: true,
                },
            },
            socials: {
                select: {
                    type: true,
                    externalUsername: true,
                    id: true,
                },
            },
            _count: {
                select: {
                    wins: true,
                    losses: true,
                    sets: true,
                },
            },
            tournaments: {
                select: {
                    id: true,
                    season: true,
                    slug: true,
                    shortSlug: true,
                    name: true,
                    profileImage: true,
                    standings: {
                        where: {
                            player: {
                                name: "Penguin",
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
                                    name: "Penguin",
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    id: "desc",
                },
            },
        },
    });

    return result;
});
