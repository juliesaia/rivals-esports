<template>
    <main class="flex flex-col items-center">
        <div class="text-2xl mt-8 mb-4 flex">
            <h2>
                {{ data.player.name }}
            </h2>
            <div v-for="social in data.player.socials" :key="social.id">
                <a
                    v-if="social.type === 'TWITTER'"
                    v-tooltip="`@${social.externalUsername}`"
                    class="mx-2 i-bx-bxl-twitter"
                    :href="`https://twitter.com/${social.externalUsername}`"
                    target="__blank"
                />
                <div
                    v-if="social.type === 'DISCORD'"
                    v-tooltip="social.externalUsername"
                    class="mx-2 i-bx-bxl-discord"
                />
                <a
                    v-if="social.type === 'TWITCH'"
                    v-tooltip="`twitch.tv/${social.externalUsername}`"
                    class="mx-2 i-bx-bxl-twitch"
                    :href="`https://twitch.tv/${social.externalUsername}`"
                    target="__blank"
                />
            </div>
        </div>
        <h3>Wins: {{ data.player._count.wins }}</h3>
        <h3>Losses: {{ data.player._count.losses }}</h3>
        <h3 class="mb-4">
            Winrate:
            {{
                (
                    data.player._count.wins /
                    (data.player._count.wins + data.player._count.losses)
                ).toFixed(2) * 100
            }}%
        </h3>
        <div
            v-for="character in data.player.characters.filter(
                (el) => el[0] !== 'null'
            )"
            :key="character.name"
            class="flex items-center"
        >
            <img :src="`/characters/${character[0]}.png`" />
            <h3>: {{ character[1] }}</h3>
        </div>
        <Tournament :data="data.player.tournaments" />

        <div class="w-160 text-center">
            <h1 class="mt-8 mb-4">Head to Head</h1>
            <!-- <v-autocomplete /> -->

            <Autocomplete @submit="submitHeadToHead" :data="data.allPlayers" />

            <h2 v-if="data.h2h.sets.length" class="mb-2">
                Lifetime: {{ data.h2h._count.wins }} -
                {{ data.h2h._count.losses }}
            </h2>
            <div
                ref="setRef"
                class="overflow-hidden transition-all duration-500"
                :style="{
                    'max-height': '0px',
                }"
            >
                <Set :data="data.h2h.sets" />
            </div>
        </div>
    </main>
    <div class="h-80" />
    <!-- <vue-json-pretty :data="data" /> -->
</template>

<script setup>
// import VueJsonPretty from "vue-json-pretty";
import Tournament from "../components/Tournament.vue";
import Set from "../components/Set.vue";
import Autocomplete from "../components/Autocomplete.vue";
import { sleep } from "~~/server/utils";

const route = useRoute();

const setRef = $ref(null);

const data = $ref({ player: null, h2h: { sets: [] } });

const { data: playerData } = $(
    await useFetch(`/api/player?name=${route.params.player}`)
);

data.player = playerData;

const { data: allPlayers } = $(await useFetch("/api/players"));

data.allPlayers = allPlayers;

async function submitHeadToHead(playername) {
    const { data: h2hData } = $(
        await useFetch(
            `/api/player?name=${route.params.player}&h2h=${playername}`
        )
    );

    if (data.h2h.sets.length) {
        close(setRef);
        await sleep(500);
    }

    data.h2h = h2hData;
    await nextTick();
    open(setRef);
}

function open(el) {
    el.style.maxHeight = el.scrollHeight + "px";
}
function close(el) {
    el.style.maxHeight = "0px";
}
</script>
