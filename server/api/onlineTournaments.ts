import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    return await prisma.onlineTournament.findMany();
});
