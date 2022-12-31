<template>
    <li class="$ m-3 mb-0 shadow-lg rounded-lg border border-gray-900">
        <div class="$ flex">
            <div class="$ flex-grow">
                <!-- This slot will handle the title/header of the accordion-->
                <slot name="accordion-header" />
            </div>
            <div
                class="$ i-bx-chevron-down my-auto text-4xl cursor-pointer"
                @click="toggle"
            />
        </div>
        <transition
            name="accordion"
            @enter="start"
            @leave="end"
            @before-enter="end"
        >
            <div
                v-show="visible"
                class="$ overflow-hidden transition-all duration-500"
            >
                <ul>
                    <!-- This slot will handle all the content that is passed to the accordion -->
                    <slot name="accordion-content" />
                </ul>
            </div>
        </transition>
    </li>
</template>

<script setup>
import { inject } from "vue";

let { count, active } = $(inject("accordion"));

const index = count++;

const visible = $computed(() => {
    return index === active;
});

function toggle() {
    active = visible ? null : index;
}
function start(el) {
    el.style.maxHeight = el.scrollHeight + "px";
}
function end(el) {
    el.style.maxHeight = "0px";
}
</script>
