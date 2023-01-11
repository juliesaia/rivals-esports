<template>
    <button @click="allNumbersTo">[Find longest number to ___]</button>
    <button @click="allNumbersFrom">[Find longest number from ___]</button>
    <button @click="spreadStats">
        [Spread stats with ___ minimum placements]
    </button>
    <button @click="getAccolades">[Get accolades of ___]</button>
    <AInput v-model="textField" type="text" />
    <div>{{ debug }}</div>
</template>

<script setup>
let debug = $ref("");

let textField = $ref("Penguin");

async function allNumbersTo() {
    const { data } = $(
        await useFetch(
            `api/manualStats/allCakeNumbers?source=${textField}&direction=to`
        )
    );

    debug = data;
}

async function allNumbersFrom() {
    const { data } = $(
        await useFetch(
            `api/manualStats/allCakeNumbers?source=${textField}&direction=from`
        )
    );
    debug = data;
}

async function spreadStats() {
    const { data } = $(
        await useFetch(`api/manualStats/spreadStats?min=${textField}`)
    );
    debug = data;
}

async function getAccolades() {
    const { data } = $(await useFetch(`api/accolades?player=${textField}`));
    debug = data;
}
</script>
