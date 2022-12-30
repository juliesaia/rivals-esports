import { PrismaClient } from "@prisma/client";
import { rounds_from_victory } from "./utils";

// TODO: when prisma adds relation support for computed values change uf to computed and remove from db
export const prisma = new PrismaClient().$extends({
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
        tournament: {
            shortSlug: {
                needs: { slug: true },
                compute(tournament) {
                    return tournament.slug.split("tournament/")[1];
                },
            },
        },
        // set: {
        // uf: we dont have the technology
        // },
    },
});
