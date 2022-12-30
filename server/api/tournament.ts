import { prisma } from "../prisma";

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
                        player: {
                            select: {
                                name: true,
                                favoriteCharacter: true,
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
            return tournament;
        }
    }
    throw new Error("Tournament not found.");
});
