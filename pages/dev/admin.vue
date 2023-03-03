<template>
    <button @click="refresh">[Refresh database]</button>
    <button @click="refreshAccolades">[Refresh accolades]</button>
    <button @click="refreshRankings">[Refresh rankings]</button>
    <button @click="manualMerge">[Apply manual changes]</button>
    <button @click="setCache">[Set "cache"]</button>
    <div>{{ debug }}</div>
</template>

<script setup>
let debug = $ref({});

async function refresh() {
    const { data } = $(await useFetch("/api/refresh"));

    debug = data;
}

async function refreshAccolades() {
    const { data } = $(await useFetch("/api/refreshAccolades"));

    debug = data;
}

async function manualMerge() {
    const { data } = $(await useFetch("/api/manualChanges"));

    debug = data;
}

async function refreshRankings() {
    const { data } = $(await useFetch("/api/refreshRankings"));

    debug = data;
}

async function setCache() {
    const { data } = $(await useFetch("/api/cache"));

    debug = data;
}
</script>
