// uno.config.js
import { presetAnu, presetIconExtraProperties } from "anu-vue";
import { presetThemeDefault } from "@anu-vue/preset-theme-default";
import {
    defineConfig,
    presetIcons,
    presetUno,
    transformerCompileClass,
} from "unocss";
// import { prisma } from "./server/prisma";

// const players = await prisma.player.findMany({
//     select: {
//         country: true,
//     },
//     where: {
//         country: {
//             not: null,
//         },
//     },
// });

// const safelist = Array.from(
//     new Set(players.map((player) => player.country.toLowerCase()))
// ).map((el) => `i-flag-${el}-4x3`);

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            scale: 1.2,
            extraProperties: presetIconExtraProperties,
        }),

        // anu-vue preset
        presetAnu(),

        // default theme preset
        presetThemeDefault(),
    ],
    transformers: [
        transformerCompileClass({
            trigger: "$",
            classPrefix: "",
        }),
    ],
    include: [/.*\/anu-vue\.js(.*)?$/, "./**/*.vue", "./**/*.md"],
    safelist: [
        "i-flag-us-4x3",
        "i-flag-ca-4x3",
        "i-flag-cr-4x3",
        "i-flag-cl-4x3",
        "i-flag-mx-4x3",
        "i-flag-pr-4x3",
        "i-flag-pl-4x3",
        "i-flag-nz-4x3",
        "i-flag-fr-4x3",
        "i-flag-gb-4x3",
        "i-flag-au-4x3",
        "i-flag-de-4x3",
        "i-flag-jp-4x3",
        "i-flag-br-4x3",
        "i-flag-co-4x3",
        "i-flag-ru-4x3",
        "i-flag-nl-4x3",
        "i-flag-es-4x3",
        "i-flag-at-4x3",
        "i-flag-bj-4x3",
        "i-flag-sa-4x3",
        "i-flag-se-4x3",
        "i-flag-il-4x3",
        "i-flag-ar-4x3",
        "i-flag-be-4x3",
        "i-flag-ie-4x3",
        "i-flag-lc-4x3",
        "i-flag-id-4x3",
        "i-flag-ch-4x3",
        "i-flag-kw-4x3",
        "i-flag-do-4x3",
        "i-flag-it-4x3",
        "i-flag-ve-4x3",
        "i-flag-pe-4x3",
        "i-flag-bd-4x3",
        "i-flag-cn-4x3",
        "i-flag-tt-4x3",
        "i-flag-no-4x3",
        "i-flag-pt-4x3",
        "i-flag-bt-4x3",
        "i-flag-za-4x3",
        "i-flag-eg-4x3",
        "i-flag-af-4x3",
        "i-flag-uy-4x3",
        "i-flag-ai-4x3",
        "i-flag-bh-4x3",
        "i-flag-um-4x3",
        "i-flag-aq-4x3",
        "i-flag-jm-4x3",
        "i-flag-ma-4x3",
        "i-flag-lu-4x3",
        "i-flag-ae-4x3",
        "i-flag-ph-4x3",
        "i-flag-gr-4x3",
        "i-flag-fi-4x3",
        "i-flag-dz-4x3",
        "i-flag-ug-4x3",
        "i-flag-hr-4x3",
        "i-flag-sg-4x3",
    ],
});
