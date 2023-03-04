import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    console.time();

    if (query.min) {
        return await prisma.player.findMany({
            select: {
                name: true,
            },
            orderBy: {
                sets: {
                    _count: "desc", // sort by "relevance"
                },
            },
        });
    }

    return await prisma.player.findMany({
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
});
