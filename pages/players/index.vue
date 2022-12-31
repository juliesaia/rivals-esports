<template>
    <main class="flex flex-col items-center">
        <Table v-bind="{ data, headers }" type="players" />
    </main>
</template>

<script setup>
import Table from "../components/Table.vue";
import { decompress } from "~~/server/utils";

const { data: compressed_data } = $(await useFetch("/api/players"));

const data = decompress(compressed_data);

const headers = [
    { name: "Player", width: "w-60" },
    { name: "Rank", width: "w-20" },
    { name: "Winrate", width: "w-30" },
    { name: "Last Tournament", width: "w-60" },
];
</script>
