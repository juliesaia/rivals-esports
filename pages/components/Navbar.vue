<template>
    <div class="$ w-full bg-purple-400 flex px-16 border-b-4 border-purple-900">
        <NuxtLink class="$ py-4" to="/">Rivals Esports</NuxtLink>
        <div class="$ flex-grow" />
        <NuxtLink
            class="$ py-4 px-2 transition-all hover:text-white border-transparent border-b-4 hover:border-white mb--1"
            to="/players"
        >
            Players
        </NuxtLink>
        <NuxtLink
            class="$ py-4 px-2 transition-all hover:text-white border-transparent border-b-4 hover:border-white mb--1"
            to="/tournaments"
        >
            Tournaments
        </NuxtLink>
        <div class="$ py-4 px-2">Wiki</div>
    </div>
</template>
