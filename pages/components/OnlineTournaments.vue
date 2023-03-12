<template>
    <h3 v-if="today.length" class="$ text-2xl my-4">Today</h3>
    <div class="$ flex flex-wrap justify-center">
        <div
            v-for="tournament in today"
            :key="tournament.id"
            class="$ mx-4 mb-4"
        >
            <OnlineTournamentCard :today="true" v-bind="{ tournament }" />
        </div>
    </div>
    <h3 v-if="thisWeek.length" class="$ text-2xl my-4">This Week</h3>
    <div class="$ flex flex-wrap justify-center">
        <div
            v-for="tournament in thisWeek"
            :key="tournament.id"
            class="$ mx-4 mb-4"
        >
            <OnlineTournamentCard v-bind="{ tournament }" />
        </div>
    </div>
    <h3 v-if="announced.length" class="$ text-2xl my-4">Announced</h3>
    <div class="$ flex flex-wrap justify-center">
        <div
            v-for="tournament in announced"
            :key="tournament.id"
            class="$ mx-4"
        >
            <OnlineTournamentCard v-bind="{ tournament }" />
        </div>
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import isToday from "dayjs/plugin/isToday.js";

import { fixTimestamp } from "../../server/utils";
import OnlineTournamentCard from "./OnlineTournamentCard.vue";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);

// const { onlineTournaments } = defineProps<{
//     onlineTournaments: any;
// }>();

const { data: onlineTournaments } = $(await useFetch("/api/onlineTournaments"));

const today = onlineTournaments
    .filter(
        (tournament) =>
            (tournament.weekly
                ? dayjs().tz("America/New_York").day() ===
                  dayjs.tz(tournament.startAtISO, "America/New_York").day()
                : fixTimestamp(tournament).isToday()) &&
            fixTimestamp(tournament).isAfter(dayjs())
    )
    .sort((a, b) => (fixTimestamp(a).isAfter(fixTimestamp(b)) ? 1 : -1));

const thisWeek = onlineTournaments
    .filter(
        (tournament) =>
            // !fixTimestamp(tournament).isSame(dayjs(), "day")
            fixTimestamp(tournament).diff(dayjs(), "day") <= 7 &&
            !today.includes(tournament)
    )
    .sort((a, b) => (fixTimestamp(a).isAfter(fixTimestamp(b)) ? 1 : -1));

const announced = onlineTournaments
    .filter(
        (tournament) =>
            !today.includes(tournament) && !thisWeek.includes(tournament)
    )
    .sort((a, b) => (fixTimestamp(a).isAfter(fixTimestamp(b)) ? 1 : -1));
</script>
