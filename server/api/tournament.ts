import { prisma } from "../prisma";
import { compress } from "../utils";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    const tournament_names = [query.name.toString()];

    tournament_names.push(tournament_names[0].replaceAll("-", " "));

    for (const tournament_name of tournament_names) {
        const tournament = await prisma.tournament.findFirst({
            select: {
                name: true,
                season: true,
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
                standings: {
                    select: {
                        placement: true,
                        seed: true,
                        spr: true,
                        player: {
                            select: {
                                name: true,
                                favoriteCharacter: true,
                                losses: {
                                    take: 2,
                                    select: {
                                        id: true,
                                        winner: {
                                            select: {
                                                name: true,
                                                favoriteCharacter: true,
                                            },
                                        },
                                    },
                                    where: {
                                        OR: [
                                            {
                                                tournament: {
                                                    name: tournament_name,
                                                },
                                            },
                                            {
                                                tournament: {
                                                    slug: `tournament/${tournament_name}`, // shortSlug
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
                        name: tournament_name,
                    },
                    {
                        slug: `tournament/${tournament_name}`, // shortSlug
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
    }
    throw new Error("Tournament not found.");
});
