<template>
    <nav
        class="$ w-full bg-purple-400 flex px-4 md:px-16 border-b-4 border-purple-900 sticky top-0 z-9999 whitespace-nowrap"
    >
        <NuxtLink class="$ py-4" to="/">Rivals Esports</NuxtLink>
        <div class="$ flex-grow" />
        <NuxtLink
            class="$ py-4 px-2 transition-all hover:text-white border-transparent border-b-4 hover:border-white mb--1"
            activeClass="text-white border-white"
            to="/players"
        >
            Players
        </NuxtLink>
        <NuxtLink
            class="$ py-4 pl-2 transition-all hover:text-white border-transparent border-b-4 hover:border-white mb--1"
            activeClass="text-white border-white"
            to="/tournaments"
        >
            Tournaments
        </NuxtLink>
        <!-- <div class="$   py-4 px-2">Wiki</div> -->
    </nav>
</template>
