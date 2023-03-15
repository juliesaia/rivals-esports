<template>
    <nav
        class="$ w-full bg-purple-400 flex px-4 md:px-16 border-b-4 border-purple-900 sticky top-0 z-9999 whitespace-nowrap"
    >
        <NuxtLink :external="true" class="$ py-4" to="/">
            Rivals Esports
        </NuxtLink>
        <div class="$ flex-grow" />
        <div class="flex gap-4">
            <NuxtLink
                :external="true"
                class="$ py-4 transition-colors hover:text-white border-transparent border-b-4 hover:border-white mb--1"
                activeClass="text-white border-white"
                to="/players"
            >
                Players
            </NuxtLink>
            <NuxtLink
                :external="true"
                class="$ py-4 transition-colors hover:text-white border-transparent border-b-4 hover:border-white mb--1"
                activeClass="text-white border-white"
                to="/tournaments"
            >
                Tournaments
            </NuxtLink>

            <NuxtLink
                :external="true"
                class="$ py-4 transition-colors hover:text-white border-transparent border-b-4 hover:border-white mb--1"
                activeClass="text-white border-white"
                to="/top50"
            >
                Top 50
            </NuxtLink>

            <NuxtLink
                :external="true"
                class="hidden md:block py-4 transition-colors hover:text-white border-transparent border-b-4 hover:border-white mb--1"
                activeClass="text-white border-white"
                to="/replayorganizer"
            >
                Replay Organizer
            </NuxtLink>
        </div>
        <!-- <div
            class="md:hidden i-bx-menu text-3xl my-auto"
            @click="menuOpen = true"
        /> -->

        <!-- <div class="$   py-4 px-2">Wiki</div> -->
    </nav>
</template>
<script setup>
// import { ADrawer } from "anu-vue";
// const menuOpen = ref(false);
</script>
