// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { prisma } from "./server/prisma";
import { shortSlug } from "./server/utils";

export default async () => {
    const tournaments = await prisma.tournament.findMany({
        select: {
            slug: true,
        },
        orderBy: {
            startAt: "desc",
        },
    });

    const tournament_routes = tournaments.map(
        (tournament) => `/tournaments/${shortSlug(tournament)}`
    );

    const players = await prisma.player.findMany({
        select: {
            name: true,
        },
        orderBy: {
            sets: {
                _count: "desc",
            },
        },
        take: 1000,
    });

    const player_routes = players.map((player) => `/players/${player.name}`);

    return defineNuxtConfig({
        nitro: {
            compressPublicAssets: true,
            prerender:
                process.env.NODE_ENV === "development"
                    ? {}
                    : {
                          routes: [...player_routes, ...tournament_routes],
                          crawlLinks: false,
                      },
            esbuild: {
                options: {
                    target: "esnext",
                },
            },
        },
        routeRules:
            process.env.NODE_ENV === "development"
                ? {}
                : {
                      "/api/**": {
                          headers: { "cache-control": "s-maxage=2592000" },
                      },
                      "/": { prerender: true },
                      "/players": { prerender: true },
                      "/tournaments": { prerender: true },
                      "/players/**": { swr: 2592000 },
                      "/tournaments/**": { swr: 2592000 },
                  },
        vite: {
            vue: {
                reactivityTransform: true,
            },
        },
        css: ["~~/styles.css"],
        modules: [
            "@anu-vue/nuxt",
            "@unocss/nuxt",
            "@nuxt/image-edge",
            "@nathanchase/nuxt-dayjs-module",
            "nuxt-viewport",
        ],
        viewport: {
            breakpoints: {
                xs: 320,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
                "2xl": 1536,
            },

            defaultBreakpoints: {
                desktop: "lg",
                mobile: "xs",
                tablet: "md",
            },

            fallbackBreakpoint: "lg",
        },
        app: {
            head: {
                title: "Rivals Esports",
                htmlAttrs: {
                    lang: "en",
                },
                meta: [
                    {
                        name: "description",
                        content: "Stats Database for Rivals of Aether",
                    },
                ],
            },
        },
        experimental: {
            componentIslands: true,
        },
        ignore: ["pages/dev/**"],
        plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
    });
};
