<!-- { "name": "Penguin", "favoriteCharacter": "Absa", "id": 1554, "rankings": [ { "rank": 4 } ],
     "tournaments": [ { "name": "RCS December Online Major" } ], "_count": { "sets": 53, "wins": 38 } }
{ -->

<template>
    <main class="flex flex-col items-center">
        <div class="border border-gray-900 rounded-xl mt-8">
            <div
                class="flex items-center text-center border-b border-gray-900 px-4 pb-4 pt-6"
            >
                <div class="flex items-center justify-center pr-8 w-60">
                    <div class="pl-2">Player</div>
                </div>
                <div class="pr-8 w-20">Rank</div>
                <div class="pr-8 w-30">Winrate</div>
                <div class="pr-8 w-60">Last Tournament</div>
            </div>
            <div v-for="player in sorted" :key="player.id" class="mt-8">
                <div class="flex items-center text-center px-4">
                    <div class="flex items-center pr-8 w-60 pl-12">
                        <img
                            v-if="player.favoriteCharacter"
                            :src="`/characters/${player.favoriteCharacter}.png`"
                        />
                        <div class="pl-2">
                            {{ player.name }}
                        </div>
                    </div>
                    <div class="pr-8 w-20">
                        {{ player.rankings[0]?.rank }}
                    </div>
                    <div class="pr-8 w-30">
                        {{ winrate(player._count.wins, player._count.sets) }}
                    </div>
                    <div class="pr-8 w-60">
                        {{ player.tournaments[0]?.name }}
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { winrate } from "~~/server/utils";

const { data } = $(await useFetch("/api/players"));

const sortOrder = $ref("rank");

const sorted = $computed(() => {
    if (sortOrder === "rank") {
        return data.sort((a, b) => a.rankings[0]?.rank - b.rankings[0]?.rank);
    }
});
</script>
