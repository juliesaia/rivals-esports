import JSONH from "jsonh";
import { compress } from "compress-json";
import { prisma } from "../prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (query.min) {
        // autocomplete
        const result = await prisma.player.findMany({
            select: {
                name: true,
            },
        });

        return result.map((player) => player.name);
    }

    const result = await prisma.player.findMany({
        select: {
            name: true,
            favoriteCharacter: true,
            id: true,
            rankings: {
                select: {
                    rank: true,
                },
                take: 1,
                orderBy: {
                    season: "desc",
                },
            },
            _count: {
                select: {
                    sets: {
                        where: {
                            loserGameCount: {
                                gt: -1,
                            },
                        },
                    },
                    wins: {
                        where: {
                            loserGameCount: {
                                gt: -1,
                            },
                        },
                    },
                },
            },
            tournaments: {
                take: 1,
                orderBy: {
                    id: "desc",
                },
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            sets: {
                _count: "desc",
            },
        },
    });

    console.log(JSONH.stringify(result).length);
    console.log(JSON.stringify(compress(JSONH.pack(result))).length);
    console.log(JSON.stringify(result).length);
    return result;
});
