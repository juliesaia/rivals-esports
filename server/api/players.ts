import { PrismaClient } from "@prisma/client";
import { rounds_from_victory } from "../utils";

// TODO: when prisma adds relation support for computed values change uf to computed and remove from db
const prisma = new PrismaClient().$extends({
    result: {
        standing: {
            spr: {
                needs: { seed: true, placement: true },
                compute(standing) {
                    return (
                        rounds_from_victory(standing.seed ?? 0) -
                        rounds_from_victory(standing.placement ?? 0)
                    );
                },
            },
        },
        // set: {
        // uf: we dont have the technology
        // },
    },
});

export default defineEventHandler(async (_event) => {
    const result = await prisma.player.findMany({
        select: {
            name: true,
        },
    });

    return result;
});
