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
                Math.round(
                    (
                        data.player._count.wins /
                        (data.player._count.wins + data.player._count.losses)
                    ).toFixed(2) * 100
                )
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

        <SetList type="h2h" title="Head to Head" />

        <SetList type="armadaNumber" title="Degrees of Winning" />
    </main>
    <div class="h-80" />
</template>

<script setup>
// import VueJsonPretty from "vue-json-pretty";
import Tournament from "../components/Tournament.vue";
import SetList from "../components/SetList.vue";

const route = useRoute();

const data = $ref({
    player: null,
    h2h: { sets: [] },
    armadaNumber: { sets: [] },
});

const { data: playerData } = $(
    await useFetch(`/api/player?name=${route.params.player}`)
);

data.player = playerData;

const { data: allPlayers } = $(await useFetch("/api/players"));

provide("allPlayers", allPlayers);
</script>
