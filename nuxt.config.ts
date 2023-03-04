// https://v3.nuxtjs.org/api/configuration/nuxt.config

// import fs from "fs";

// const cache_promise = (async () =>
//     JSON.parse(await fs.promises.readFile("server/cache.json", "utf8")))();

// const cache = await cache_promise;

// for (const player in cache.player) {
//     routes.push(`/players/${player}`);
// }

// for (const tournament of cache.tournaments) {
//     routes.push(`/tournaments/${tournament.shortSlug}`);
// }
export default defineNuxtConfig({
    nitro: {
        compressPublicAssets: true,
        prerender: {
            routes: ["/", "/tournaments", "/players"],
        },
        esbuild: {
            options: {
                target: "esnext",
            },
        },
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
});
