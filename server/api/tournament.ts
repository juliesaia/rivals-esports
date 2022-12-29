import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    console.log(query);

    const tournament_name = query.name.toString();

    const tournament = await prisma.tournament.findFirstOrThrow({
        select: {
            name: true,
            season: true,
            slug: true,
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
            name: tournament_name,
        },
    });

    return tournament;
});
