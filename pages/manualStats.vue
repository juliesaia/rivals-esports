<template>
    <button @click="allCakeNumbers">Find all cake numbers</button>
    <div>{{ debug }}</div>
</template>

<script setup>
let debug = $ref({});

async function allCakeNumbers() {
    const { data } = $(
        await useFetch("api/manualStats/allCakeNumbers?source=CheesyPotato")
    );

    debug = data;
}
</script>
