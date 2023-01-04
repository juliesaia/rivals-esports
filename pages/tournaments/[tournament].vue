<template>
    <main class="$ flex flex-col items-center">
        <nuxt-img
            :src="resizeSGG(tournament.profileImage, 120, 120)"
            height="120"
            width="120"
            class="$ my-8"
        />
        <NuxtLink
            class="$ text-2xl hover:underline"
            :to="`https://start.gg/${tournament.slug}`"
        >
            {{ tournament.name }}</NuxtLink
        >
        <div class="$ my-4"><Location v-bind="{ tournament }" /></div>
        <div
            v-if="
                dayjs
                    .unix(tournament.startAt)
                    .tz(tournament.timezone)
                    .isSame(dayjs.unix(tournament.endAt), 'day')
            "
        >
            {{
                dayjs
                    .unix(tournament.startAt)
                    .tz(tournament.timezone)
                    .format("MMMM D, YYYY")
            }}
        </div>
        <div v-else>
            {{
                `${dayjs
                    .unix(tournament.startAt)
                    .tz(tournament.timezone)
                    .format("MMMM D")} - ${dayjs
                    .unix(tournament.endAt)
                    .tz(tournament.timezone)
                    .format("MMMM D, YYYY")}`
            }}
        </div>
        <div class="$ text-2xl mt-4">Standings</div>
        <Table :data="tournament.standings" :headers="headers" type="players" />

        <!-- <nuxt-img v-if="data.bannerImage" :src="data.bannerImage" /> -->
    </main>
    <div class="$ h-80" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import Table from "../components/Table.vue";
import Location from "../components/mini/Location.vue";
import { resizeSGG } from "~~/server/utils";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

const route = useRoute();

const { data: tournament } = $(
    await useFetch("/api/tournament", {
        query: { name: route.params.tournament },
    })
);

console.log(tournament);

const headers = [
    { name: "Player", width: "w-60" },
    { name: "Placement", width: "w-30" },
    { name: "Seed", width: "w-20" },
    { name: "SPR", width: "w-20" },
    { name: "Losses", width: "w-60", unsortable: true },
];
</script>
