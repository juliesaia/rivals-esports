/* eslint-disable no-unreachable-loop */
import { top50 } from "../lists/top50";
import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    // let count = 0;
    for (const [index, season] of top50.entries()) {
        for (const player of season) {
            // count++;
            // if (count === 10) {
            //     return top50;
            // }

            if (player.name === "You") {
                continue;
            }

            const player_prisma = await prisma.player.findFirst({
                select: {
                    name: true,
                    tournaments: {
                        select: {
                            name: true,
                            slug: true,
                            profileImage: true,
                            online: true,
                            standings: {
                                select: {
                                    placement: true,
                                    seed: true,
                                },
                                where: {
                                    player: {
                                        // name: player.name,
                                        smashggid: player.smashggID,
                                    },
                                },
                            },
                        },
                        where: {
                            leagues: {
                                some: {
                                    shortName: "RCS",
                                    season: index + 1,
                                },
                            },
                            sets: {
                                some: {
                                    players: {
                                        some: {
                                            smashggid: player.smashggID,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            entrants: {
                                _count: "desc",
                            },
                        },
                    },
                },
                where: {
                    // name: player.name,
                    smashggid: player.smashggID,
                },
                orderBy: {
                    sets: {
                        _count: "desc",
                    },
                },
            });

            if (player_prisma == null) {
                console.log(`${player.name} is null`);
                player.tournaments = [];
                continue;
            }

            player.name = player_prisma.name;

            player_prisma.tournaments.sort(
                (a, b) => a.standings[0].placement - b.standings[0].placement
            );

            player_prisma.tournaments.sort(
                // @ts-ignore
                (a, b) => a.online - b.online // js is evil
            );

            console.log(`${player.name}'s top 3 tournaments:`);

            console.log(
                player_prisma.tournaments.slice(0, 3).map((el) => el.name)
            );

            // @ts-ignore
            player.tournaments = player_prisma.tournaments.slice(0, 3);
        }
    }
    return top50;
});
