<template>
    <main class="$ flex flex-col items-center text-center">
        <nuxt-img
            :src="resizeSGG(tournament.profileImage, 120, 120)"
            height="120"
            width="120"
            class="$ my-8"
            :alt="`${tournament.name} Icon`"
        />
        <NuxtLink
            :external="true"
            class="$ text-2xl hover:underline"
            target="_blank"
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
        <div class="$ my-4">
            <div
                v-for="league in tournament.leagues"
                :key="league.shortName"
                class="$ my-1"
            >
                {{ league.shortName }} S{{ league.season }}
            </div>
        </div>
        <div class="$ text-2xl mt-4">Standings</div>
        <Table
            v-bind="{ data: tournament.standings, headers, defaultSort }"
            type="players"
        />

        <!-- <nuxt-img v-if="data.bannerImage" :src="data.bannerImage" /> -->
    </main>
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

const { isGreaterOrEquals } = $(useViewport());
const route = useRoute();

const { data: tournament, error } = $(
    await useFetch("/api/tournament", {
        query: { name: route.params.tournament },
        headers: { "Cache-Control": "s-max-age=604800", Pragma: "" },
    })
);

if (error) {
    throw createError({ statusCode: 404, message: "Tournament not found." });
}

const headers = $computed(() =>
    isGreaterOrEquals("md")
        ? [
              { name: "Player", width: "w-60" },
              { name: "Placement", width: "w-30" },
              { name: "Seed", width: "w-20" },
              { name: "SPR", width: "w-20" },
              { name: "Losses", width: "w-60", unsortable: true },
          ]
        : [
              { name: "Player", width: "w-50" },
              { name: "Placement", width: "w-30" },
          ]
);

const defaultSort = {
    type: "Placement",
    order: "asc",
};
</script>
