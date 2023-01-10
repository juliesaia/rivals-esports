import { prisma } from "../prisma";

const nameChanges = [
    {
        id: "5fdb5d4a",
        name: "CakeAssault",
    },
];

export default defineEventHandler(async () => {
    const queries = [];

    // Apply all name changes
    for (const change of nameChanges) {
        queries.push(
            prisma.player.update({
                where: {
                    smashggid: change.id,
                },
                data: {
                    name: change.name,
                },
            })
        );
    }

    await prisma.$transaction(queries);

    return { message: "Applied manual changes" };
});
