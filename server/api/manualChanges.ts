import { prisma } from "../prisma";

const nameChanges = [
    {
        id: "1703e007",
        name: "ZoraTK",
    },
    {
        id: "b06f1d29",
        name: "Halite",
    },
];

export default defineEventHandler(async () => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }
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
