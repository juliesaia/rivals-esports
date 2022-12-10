<template>
    <button @click="refresh">Refresh</button>
    <div>{{ debug }}</div>
</template>

<script setup>
let debug = $ref({});

async function refresh() {
    const { data } = $(await useFetch(`/api/refresh`));

    debug = data;
}
</script>
