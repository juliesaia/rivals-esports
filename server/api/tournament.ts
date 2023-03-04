import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    const tournament_name = query.name.toString().toLowerCase();

    // tournament_names.push(tournament_names[0].replaceAll("-", " "));

    // for (const tournament_name of tournament_names) {

    const tournament = await prisma.tournament.findFirst({
        select: {
            name: true,
            // season: true,
            slug: true,
            // shortSlug: true,
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
                    // spr: true,
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
                                                    equals: `tournament/${tournament_name}`, // shortSlug
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
                        equals: `tournament/${tournament_name}`, // shortSlug
                        mode: "insensitive",
                    },
                },
            ],
        },
    });

    if (tournament) {
        for (const standing of tournament.standings) {
            Object.assign(standing, standing.player);
            delete standing.player;
        }

        if (!tournament.timezone) {
            tournament.timezone = "America/New_York";
        }

        return tournament;
    }
    // }
    throw new Error("Tournament not found.");
});
