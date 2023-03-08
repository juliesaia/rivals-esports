<template>
    <main class="flex flex-col items-center mt-16 text-center">
        <div
            v-for="player in top50[season]"
            :key="player.name"
            class="flex items-center gap-10 my-4 border-2 p-4 rounded-xl"
        >
            <div>{{ player.ranking }}</div>
            <div class="flex items-center w-40">
                <div :class="player.char" />
                <NuxtLink
                    :external="true"
                    class="$ pl-2 whitespace-nowrap hover:underline"
                    :to="`/players/${player.name}`"
                >
                    {{ player.name }}
                </NuxtLink>
            </div>
            <div class="w-160">{{ player.blurb }}</div>
        </div>
    </main>
</template>
<script setup lang="ts">
const { data: top50 } = $(await useFetch("/api/top50"));

const season = $ref("season6");
</script>
