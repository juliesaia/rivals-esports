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
    ],
    app: {
        head: {
            title: "Rivals Esports",
        },
    },
});
