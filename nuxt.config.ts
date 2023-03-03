// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
    nitro: {
        compressPublicAssets: true,
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
});
