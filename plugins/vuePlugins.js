import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(FloatingVue);
    vueApp.use(VueVirtualScroller);
});
