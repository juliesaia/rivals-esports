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
        <OnlineTournaments />
    </main>
</template>
<script setup lang="ts">
import { ABtn } from "anu-vue";
import OnlineTournaments from "./components/OnlineTournaments.vue";
</script>
