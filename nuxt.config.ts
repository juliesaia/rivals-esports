// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    vite: {
        vue: {
            reactivityTransform: true,
        },
    },
    css: ["vue-json-pretty/lib/styles.css"],
    modules: ["@unocss/nuxt"],
});
