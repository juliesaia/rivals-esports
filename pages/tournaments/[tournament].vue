<template>
    <main class="flex flex-col items-center">
        <nuxt-img
            :src="resizeSGG(tournament.profileImage, 120, 120)"
            height="120"
            width="120"
            class="my-8"
        />
        <NuxtLink
            class="text-2xl hover:underline"
            :to="`https://start.gg/${tournament.slug}`"
        >
            {{ tournament.name }}</NuxtLink
        >
        <div class="my-4 flex">
            <div v-if="tournament.city" class="mr-1">
                {{ tournament.city }},
            </div>
            <div>{{ tournament.state }}</div>
        </div>
        <div>
            {{
                `${dayjs.unix(tournament.startAt).format("MMMM D")} - ${dayjs
                    .unix(tournament.endAt)
                    .format("MMMM D, YYYY")}`
            }}
        </div>

        <!-- <nuxt-img v-if="data.bannerImage" :src="data.bannerImage" /> -->
    </main>
    <div class="h-80" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { resizeSGG } from "~~/server/utils";

const route = useRoute();

const { data: tournament } = $(
    await useFetch(`/api/tournament?name=${route.params.tournament}`)
);
</script>
