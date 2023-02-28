<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-3xl mt-8">Tournaments</div>
        <Table v-bind="{ data, headers, defaultSort }" type="tournaments" />
    </main>
</template>

<script setup lang="ts">
import Table from "../components/Table.vue";

const { data } = $(await useFetch("/api/tournaments"));

const headers = [
    { name: "Tournament", width: "w-60" },
    { name: "Season", width: "w-20" },
    { name: "Entrants", width: "w-30" },
    { name: "Date", width: "w-40" },
    { name: "Location", width: "w-40", unsortable: true },
];

const defaultSort = {
    type: "Date",
    order: "desc",
};
</script>
