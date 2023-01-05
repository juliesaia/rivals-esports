import { compress } from "../utils";
import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    // const query = getQuery(event);

    const result = await prisma.tournament.findMany({
        select: {
            name: true,
            season: true,
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
            id: "desc",
        },
    });

    for (const tournament of result) {
        if (!tournament.timezone) {
            tournament.timezone = "America/New_York";
        }
    }

    return compress(result);
});
