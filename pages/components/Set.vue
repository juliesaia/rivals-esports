<template>
    <div v-for="set in sets" :key="set.id" class="$ mb-4 border-y px-4">
        <div
            v-if="set?.tournament"
            class="$ flex justify-center items-center mb-4"
        >
            <nuxt-img
                :src="resizeSGG(set.tournament.profileImage, 40, 40)"
                height="40"
                width="40"
                class="$ mr-2"
            />
            <h3>
                {{ set.tournament.name }}
            </h3>
        </div>
        <div class="$ flex flex-wrap items-center">
            <div class="$ py-4">
                <div class="$ flex font-bold">
                    <div
                        class="$ mr-2"
                        :class="{
                            'text-green-500': set.winnerGameCount > 0,
                        }"
                    >
                        {{ set.winnerGameCount }}
                    </div>
                    <NuxtLink
                        class="$ hover:underline"
                        :to="`/players/${set.winner.name}`"
                    >
                        {{ set.winner.name }}
                    </NuxtLink>
                </div>
                <div
                    class="$ flex"
                    :class="{
                        'text-gray-400': set.loserGameCount === -1,
                    }"
                >
                    <div
                        class="$ mr-2"
                        :class="{
                            'text-red-500': set.loserGameCount > -1,
                        }"
                    >
                        {{ set.loserGameCount }}
                    </div>
                    <NuxtLink
                        class="$ hover:underline"
                        :to="`/players/${set.loser.name}`"
                    >
                        {{ set.loser.name }}
                    </NuxtLink>
                </div>
            </div>
            <div class="$ flex mx-4 py-4">
                <div
                    v-for="game in set.games"
                    :key="game.id"
                    class="$ flex flex-col justify-evenly"
                >
                    <div
                        v-if="getChar(game, set, 'winner')"
                        :class="{
                            'opacity-50': set.winner.name === game.loser.name,
                            [getChar(game, set, 'winner')]: true,
                        }"
                    />
                    <div
                        v-else-if="set.winner.name === game.winner.name"
                        class="$ i-bx-bxs-circle text-green-500 block"
                    />
                    <div
                        v-else-if="set.winner.name === game.loser.name"
                        class="$ i-bx-bxs-circle text-red-500 block"
                    />
                    <div
                        v-if="getChar(game, set, 'loser')"
                        :class="{
                            'opacity-50': set.loser.name === game.loser.name,
                            [getChar(game, set, 'loser')]: true,
                        }"
                    />
                    <div
                        v-else-if="set.loser.name === game.winner.name"
                        class="$ i-bx-bxs-circle text-green-500 block"
                    />
                    <div
                        v-else-if="set.loser.name === game.loser.name"
                        class="$ i-bx-bxs-circle text-red-500 block"
                    />
                </div>
            </div>
            <div class="$ flex-grow" />
            <div class="$ flex flex-col text-center mr-4 py-4">
                <div>
                    {{ set.phase }}
                </div>
                <div>
                    {{ set.fullRoundText }}
                </div>
            </div>
            <div class="$ text-end whitespace-nowrap py-4">
                UF: {{ set.uf }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { resizeSGG } from "~~/server/utils";

const { data: sets } = defineProps<{
    data: Array<any>;
}>();

function getChar(game, set, player) {
    if (player === "winner") {
        return game.winner.name === set.winner.name
            ? game.winnerChar
            : game.loserChar;
    } else {
        return game.winner.name === set.loser.name
            ? game.winnerChar
            : game.loserChar;
    }
}
</script>
