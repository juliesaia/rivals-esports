import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        return undefined;
    }

    const standing = await prisma.player.findFirst({
        where: {
            name: {
                equals: query.name.toString(),
            },
        },
        include: {
            rankings: true,
            socials: true,
            wins: {
                include: {
                    loser: true,
                },
            },
            losses: true,
        },
    });
    return standing;
});
