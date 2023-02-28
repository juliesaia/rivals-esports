import { prisma } from "../prisma";
import { cache_promise } from "./cache";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    console.time();

    if (query.min) {
        // autocomplete
        const result = await prisma.player.findMany({
            select: {
                name: true,
            },
            orderBy: {
                sets: {
                    _count: "desc", // sort by "relevance"
                },
            },
        });

        return result.map((player) => player.name);
    }

    const cache = await cache_promise;
    const result = cache.players;

    // const result = await prisma.player.findMany({
    //     select: {
    //         name: true,
    //         favoriteCharacter: true,
    //         id: true,
    //         _count: {
    //             select: {
    //                 sets: true,
    //                 wins: true,
    //             },
    //         },
    //         tournaments: {
    //             take: 1,
    //             orderBy: {
    //                 id: "asc",
    //             },
    //             select: {
    //                 name: true,
    //                 shortSlug: true,
    //             },
    //         },
    //     },
    //     orderBy: {
    //         sets: {
    //             _count: "desc",
    //         },
    //     },
    // });

    console.timeEnd();

    return result;
});
