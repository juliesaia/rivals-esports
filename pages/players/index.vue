<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-3xl mt-8">Players</div>
        <Table v-bind="{ data, headers }" type="players" />
    </main>
</template>

<script setup>
import Table from "../components/Table.vue";

const { data } = $(await useFetch("/api/players"));

console.log(data);

const headers = [
    { name: "Player", width: "w-80" },
    { name: "Winrate", width: "w-30" },
    { name: "Last Tournament", width: "w-60" },
    { name: "Sets", width: "w-30" },
];
</script>
