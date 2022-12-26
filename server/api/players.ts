import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    const result = await prisma.player.findMany({
        select: {
            name: true,
        },
    });

    return result.map((player) => player.name);
});
