import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get_startgg(query: string, variables: object, path: string[]) {
    let page = 1;
    let output = [];
    while (true) {
        const { data } = await $fetch<any>("https://api.start.gg/gql/alpha", {
            body: { query, variables: { ...variables, page } },
            headers: {
                Authorization: "Bearer " + process.env.SMASHGGAPI,
            },
            method: "POST",
        });

        let temp = data;

        for (const slug of path) {
            temp = temp[slug];
        }

        output = [...output, ...temp.nodes];

        if (page >= temp.pageInfo.totalPages) {
            break;
        }

        page++;
    }

    return output;
}

export default defineEventHandler(async (_event) => {
    await prisma.social.deleteMany({});
    await prisma.set.deleteMany({});
    await prisma.standing.deleteMany({});
    await prisma.ranking.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.tournament.deleteMany({});

    const s7_majors = [
        // "tournament/gote-4thekids-7/event/rivals-of-aether-singles",
        // "tournament/na-rcs-season-7-june-online-major/event/rivals-of-aether-singles",
        // "tournament/double-down-2022/event/rivals-of-aether-singles",
        // "tournament/indie-showcase-ssc-2022/event/rivals-singles",
        "tournament/riptide-2022/event/rivals-of-aether-singles",
        "tournament/the-big-house-10/event/rivals-of-aether-singles",
    ];

    for (const url of s7_majors) {
        const entrants = await get_startgg(
            /* GraphQL */
            `
                query TournamentQuery($page: Int) {
                    event(
                        slug: "${url}"
                    ) {
                        entrants(query: { page: $page, perPage: 100 }) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                seeds {
                                    seedNum
                                }
                                standing {
                                    placement
                                    player {
                                        gamerTag
                                        user {
                                            discriminator
                                            genderPronoun
                                            authorizations {
                                                externalUsername
                                                type
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            {},
            ["event", "entrants"]
        );

        await prisma.tournament.create({
            data: {
                slug: url,
                season: 7,
            },
        });

        for (const entrant of entrants) {
            const player = entrant.standing.player;
            const user = player.user;

            await prisma.player.upsert({
                where: {
                    smashggid: user.discriminator,
                },
                update: {
                    tournaments: {
                        connect: {
                            slug: url,
                        },
                    },
                    standings: {
                        create: {
                            placement: entrant.standing.placement,
                            seed: entrant.seeds[0].seedNum,
                            tournament: {
                                connect: {
                                    slug: url,
                                },
                            },
                        },
                    },
                },
                create: {
                    name: player.gamerTag,
                    smashggid: user.discriminator,
                    pronouns: user.genderPronoun,
                    socials: {
                        create: user.authorizations,
                    },
                    tournaments: {
                        connect: {
                            slug: url,
                        },
                    },
                    standings: {
                        create: {
                            placement: entrant.standing.placement,
                            seed: entrant.seeds[0].seedNum,
                            tournament: {
                                connect: {
                                    slug: url,
                                },
                            },
                        },
                    },
                },
            });
        }

        const sets = await get_startgg(
            /* GraphQL */
            `
                query TournamentQuery($page: Int) {
                    event(
                        slug: "${url}"
                    ) {
                        sets(page: $page, perPage: 75, sortType: STANDARD) {
                            pageInfo {
                                totalPages
                            }
                            nodes {
                                slots {
                                    entrant {
                                        id
                                        participants {
                                            user {
                                                discriminator
                                            }
                                        }
                                    }
                                }
                                winnerId
                            }
                        }
                    }
                }
            `,
            {},
            ["event", "sets"]
        );

        for (const set of sets) {
            const winner_id = set.winnerId;
            const player1 = set.slots[0].entrant;
            const player2 = set.slots[1].entrant;

            const [winner, loser] =
                player1.id === winner_id
                    ? [
                          player1.participants[0].user.discriminator,
                          player2.participants[0].user.discriminator,
                      ]
                    : [
                          player2.participants[0].user.discriminator,
                          player1.participants[0].user.discriminator,
                      ];

            await prisma.set.create({
                data: {
                    winner: {
                        connect: {
                            smashggid: winner,
                        },
                    },
                    loser: {
                        connect: {
                            smashggid: loser,
                        },
                    },
                    tournament: {
                        connect: {
                            slug: url,
                        },
                    },
                },
            });
        }
    }

    const standings = await get_startgg(
        /* GraphQL */
        `
            query TournamentQuery($page: Int) {
                league(slug: "tournament/rcs7-north-america") {
                    standings(query: { perPage: 100, page: $page }) {
                        pageInfo {
                            totalPages
                        }
                        nodes {
                            player {
                                gamerTag
                                user {
                                    discriminator
                                    genderPronoun
                                    authorizations {
                                        externalUsername
                                        type
                                    }
                                }
                            }
                            placement
                        }
                    }
                }
            }
        `,
        {},
        ["league", "standings"]
    );

    for (const standing of standings) {
        const player = standing.player;
        const user = player.user;

        await prisma.ranking.create({
            data: {
                season: 7,
                rank: standing.placement,
                player: {
                    connectOrCreate: {
                        where: {
                            smashggid: user.discriminator,
                        },
                        create: {
                            name: player.gamerTag,
                            smashggid: user.discriminator,
                            pronouns: user.genderPronoun,
                            socials: {
                                create: user.authorizations,
                            },
                        },
                    },
                },
            },
        });
    }
});
