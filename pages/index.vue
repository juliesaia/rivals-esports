<template>
    <main class="$ flex flex-col items-center mt-16 text-center">
        <h1 class="$ text-6xl my-2 mx-2">Rivals Esports</h1>
        <div class="$ text-2xl my-6 mx-2">
            Stats Database for Rivals of Aether
        </div>
        <div class="$ flex my-4 mb-12">
            <NuxtLink to="/players">
                <ABtn class="$ mx-4">Players</ABtn>
            </NuxtLink>
            <NuxtLink to="/tournaments">
                <ABtn class="$ mx-4">Tournaments</ABtn>
            </NuxtLink>
        </div>
        <h1 class="$ text-4xl my-2">Upcoming Online Tournaments</h1>
        <div class="$ mb-4">(All times in your local timezone)</div>
        <h3 class="$ text-2xl my-4">Today</h3>
        <!-- doesnt work with spa routing... smh -->
        <!-- class="$ grid mb-8"
            :style="{
                'grid-template-columns': `repeat(${today.length}, minmax(0, 1fr));`,
            }" -->
        <div class="$ grid" :style="fixStyle(today)">
            <div
                v-for="tournament in today"
                :key="tournament.id"
                class="$ mx-4 mb-4"
            >
                <OnlineTournamentCard v-bind="{ tournament }" />
            </div>
        </div>
        <h3 class="$ text-2xl my-4">This Week</h3>
        <div class="$ grid" :style="fixStyle(thisWeek)">
            <div
                v-for="tournament in thisWeek"
                :key="tournament.id"
                class="$ mx-4 mb-4"
            >
                <OnlineTournamentCard v-bind="{ tournament }" />
            </div>
        </div>
        <h3 class="$ text-2xl my-4">Announced</h3>
        <div class="$ grid" :style="fixStyle(announced)">
            <div
                v-for="tournament in announced"
                :key="tournament.id"
                class="$ mx-4"
            >
                <OnlineTournamentCard v-bind="{ tournament }" />
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
import { OnlineTournament } from "@prisma/client";
import dayjs from "dayjs";
import { fixTimestamp } from "../server/utils";
import OnlineTournamentCard from "./components/OnlineTournamentCard.vue";

const { isGreaterThan } = $(useViewport());

const { data: onlineTournaments } = $(await useFetch("/api/onlineTournaments"));

const today = onlineTournaments.filter((tournament) =>
    fixTimestamp(tournament).isSame(dayjs(), "day")
);

const thisWeek = onlineTournaments.filter(
    (tournament) =>
        // !fixTimestamp(tournament).isSame(dayjs(), "day")
        fixTimestamp(tournament).diff(dayjs(), "day") <= 7 &&
        fixTimestamp(tournament).diff(dayjs(), "day") > 1
);

const announced = onlineTournaments.filter(
    (tournament) =>
        !today.includes(tournament) && !thisWeek.includes(tournament)
);

function fixStyle(tournaments: OnlineTournament[]) {
    if (isGreaterThan("lg")) {
        return {
            "grid-template-columns": `repeat(${Math.min(
                tournaments.length,
                4
            )}, minmax(0, 1fr))`,
        };
    }
    if (isGreaterThan("md")) {
        return {
            "grid-template-columns": `repeat(${Math.min(
                tournaments.length,
                3
            )}, minmax(0, 1fr))`,
        };
    }
    if (isGreaterThan("sm")) {
        return {
            "grid-template-columns": `repeat(${Math.min(
                tournaments.length,
                2
            )}, minmax(0, 1fr))`,
        };
    }
}
</script>
