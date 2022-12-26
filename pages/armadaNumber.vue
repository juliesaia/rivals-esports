<template>
    <div class="w-120 text-center">
            <h1 class="mt-8 mb-4">Player 1</h1>
            <!-- <v-autocomplete /> -->
            <form
                class="flex flex-col items-center"
            >
                <div class="w-40 mb-4">
                    <AInput v-model="player1" type="text" />
                </div>
            </form>
            <h1 class="mt-8 mb-4">Player 2</h1>
            <!-- <v-autocomplete /> -->
            <form
                class="flex flex-col items-center"
                @submit.prevent="getArmadaNumber"
            >
                <div class="w-40 mb-4">
                    <AInput v-model="player2" type="text" />
                </div>
                <ABtn class="mb-4" type="submit">Submit</ABtn>
            </form>

            <h2 v-if="data.player1" class="mb-2">
                Players: {{ data.player1 }} vs
                {{ data.player2 }}
            </h2>

            <h2 v-if="data.armadaNumber" class="mb-2">
                {{ data.armadaNumber }}
            </h2>
        </div>
</template>

<script setup lang="ts">

const route = useRoute();

const player1 = $ref("");
const player2 = $ref("");

const data = $ref({ player1: '', player2: '', armadaNumber: ''});

async function getArmadaNumber() {

    data.player1 = player1.toString();
    data.player2 = player2.toString();

    const { data: shortestPath } = $(
        await useFetch(
            `/api/player?name=${player1.toString()}&armadaNumber=${player2.toString()}`
            )
        );

    data.armadaNumber = (shortestPath ? shortestPath.toString() : '');

}

</script>
