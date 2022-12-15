import VueJsonPretty from "vue-json-pretty";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            VueJsonPretty,
        },
    };
});
