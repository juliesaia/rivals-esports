import { prisma } from "../prisma";

const nameChanges = [
    {
        id: "5fdb5d4a",
        name: "CakeAssault",
    },
];

const accountMerges = [
    // Adi
    ["8db116a5", "fake-930506", "fake-1066460"],
    // Cluf
    [
        "fake-312100",
        "fake-324722",
        "fake-343559",
        "fake-345687",
        "fake-387560",
        "fake-395214",
        "fake-400331",
        "fake-404633",
        "fake-704778",
        "fake-917469",
        "fake-1732647",
        "fake-5031664",
        "fake-5107641",
        "fake-5216383",
    ],
    // Cordelia
    [
        "fake-4377039",
        "fake-4959138",
        "fake-5090871",
        "fake-5227812",
        "fake-5417903",
        "fake-5506686",
        "fake-5594696",
        "fake-5849795",
        "fake-5849800",
        "fake-5849805",
        "fake-7484532",
        "fake-8284799",
    ],
];

export default defineEventHandler(async (event) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = getQuery(event);

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

    queries.splice(0, queries.length);

    // Merge known players
    // for (const merge of accountMerges) {
    //     const dbIDs = await prisma.player.findMany({
    //         select: {
    //             id: true,
    //         },
    //         where: {
    //             smashggid: {
    //                 in: merge,
    //             },
    //         },
    //     });
    // }

    // await prisma.$transaction(queries);

    return { message: "Applied manual changes" };
});
