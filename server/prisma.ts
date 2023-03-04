// import Prisma from "prisma";
// import { PrismaClient } from "@prisma/client";
// import { createPrismaRedisCache } from "prisma-redis-middleware";

// import { PrismaClient } from "@prisma/client";

import { Prisma } from "cached-prisma";
// import { rounds_from_victory } from "./utils";

// const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
//     onHit: (key) => {
//         console.log("hit", key);
//     },
//     onMiss: (key) => {
//         console.log("miss", key);
//     },
//     onError: (key) => {
//         console.log("error", key);
//     },
// });

// const _prisma = new PrismaClient();

// _prisma.$use(cacheMiddleware);

// TODO: when prisma adds relation support for computed values change uf to computed and remove from db
export const prisma = new Prisma().client;
// .$extends({
//     result: {
//         standing: {
//             spr: {
//                 needs: { seed: true, placement: true },
//                 compute(standing) {
//                     return (
//                         rounds_from_victory(standing.seed ?? 0) -
//                         rounds_from_victory(standing.placement ?? 0)
//                     );
//                 },
//             },
//         },
//         tournament: {
//             shortSlug: {
//                 needs: { slug: true },
//                 compute(tournament) {
//                     return tournament.slug.split("tournament/")[1];
//                 },
//             },
//         },
//         // set: {
//         // uf: we dont have the technology
//         // },
//     },
// });
