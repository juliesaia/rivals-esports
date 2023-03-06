<template>
    <main class="$ flex flex-col items-center mt-16 text-center">
        <h1 class="$ text-6xl my-2 mx-2">Rivals Esports</h1>
        <div class="$ text-2xl my-6 mx-2">
            Stats Database for Rivals of Aether
        </div>
        <div class="$ flex my-4 mb-12">
            <NuxtLink :external="true" to="/players">
                <ABtn class="$ mx-4">Players</ABtn>
            </NuxtLink>
            <NuxtLink :external="true" to="/tournaments">
                <ABtn class="$ mx-4">Tournaments</ABtn>
            </NuxtLink>
        </div>
        <h1 class="$ text-4xl my-2">Upcoming Online Tournaments</h1>
        <div class="$ mb-4">(All times in your local timezone)</div>
        <h3 v-if="today.length" class="$ text-2xl my-4">Today</h3>
        <div class="$ flex flex-wrap justify-center">
            <div
                v-for="tournament in today"
                :key="tournament.id"
                class="$ mx-4 mb-4"
            >
                <OnlineTournamentCard v-bind="{ tournament }" />
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
    </main>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { ABtn } from "anu-vue";
import { fixTimestamp } from "../server/utils";
import OnlineTournamentCard from "./components/OnlineTournamentCard.vue";

const { data: onlineTournaments } = $(await useFetch("/api/onlineTournaments"));

const today = onlineTournaments
    .filter(
        (tournament) =>
            fixTimestamp(tournament).isSame(dayjs(), "day") &&
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
