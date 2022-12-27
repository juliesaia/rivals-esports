<template>
    <div v-for="set in sets" :key="set.id" class="mb-4 border-y p-4">
        <div
            v-if="set?.tournament"
            class="flex justify-center items-center mb-4"
        >
            <img
                :src="`/tournaments/${set.tournament.name}.png`"
                height="40"
                width="40"
                class="mr-2"
            />
            <h3>
                {{ set.tournament.name }}
            </h3>
        </div>
        <div class="flex items-center">
            <div>
                <div class="flex font-bold">
                    <div
                        class="mr-2"
                        :class="{
                            'text-green-500': set.winnerGameCount > 0,
                        }"
                    >
                        {{ set.winnerGameCount }}
                    </div>
                    <div>{{ set.winner.name }}</div>
                </div>
                <div
                    class="flex"
                    :class="{
                        'text-gray-400': set.loserGameCount === -1,
                    }"
                >
                    <div
                        class="mr-2"
                        :class="{
                            'text-red-500': set.loserGameCount > -1,
                        }"
                    >
                        {{ set.loserGameCount }}
                    </div>
                    <div>{{ set.loser.name }}</div>
                </div>
            </div>
            <div class="flex mx-4">
                <div
                    v-for="game in set.games"
                    :key="game.id"
                    class="flex flex-col justify-evenly"
                >
                    <img
                        v-if="getChar(game, set, 'winner')"
                        :src="`/characters/${getChar(game, set, 'winner')}.png`"
                        :class="{
                            'opacity-50': set.winner.name === game.loser.name,
                        }"
                    />
                    <div
                        v-else-if="set.winner.name === game.winner.name"
                        class="i-bx-bxs-circle text-green-500 block"
                    />
                    <div
                        v-else-if="set.winner.name === game.loser.name"
                        class="i-bx-bxs-circle text-red-500 block"
                    />
                    <img
                        v-if="getChar(game, set, 'loser')"
                        :src="`/characters/${getChar(game, set, 'loser')}.png`"
                        :class="{
                            'opacity-50': set.loser.name === game.loser.name,
                        }"
                    />
                    <div
                        v-else-if="set.loser.name === game.winner.name"
                        class="i-bx-bxs-circle text-green-500 block"
                    />
                    <div
                        v-else-if="set.loser.name === game.loser.name"
                        class="i-bx-bxs-circle text-red-500 block"
                    />
                </div>
            </div>
            <div class="flex-grow" />
            <div class="flex flex-col text-center mr-4">
                <div>
                    {{ set.phase }}
                </div>
                <div>
                    {{ set.fullRoundText }}
                </div>
            </div>
            <div class="text-end whitespace-nowrap">UF: {{ set.uf }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
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
