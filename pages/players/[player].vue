<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-2xl mt-8 flex">
            <div
                v-if="data.player.favoriteCharacter"
                :class="data.player.favoriteCharacter"
            />
            <h2 class="$ ml-2">
                {{ data.player.name }}
            </h2>
            <div
                v-for="social in data.player.socials.sort((a, b) =>
                    (a.type ?? Infinity) > (b.type ?? Infinity) ? 1 : -1
                )"
                :key="social.id"
            >
                <a
                    v-if="social.type === 'TWITTER'"
                    v-tooltip="`@${social.externalUsername}`"
                    class="$ mx-2 i-bx-bxl-twitter"
                    :href="`https://twitter.com/${social.externalUsername}`"
                    target="__blank"
                />
                <div
                    v-if="social.type === 'DISCORD'"
                    v-tooltip="social.externalUsername"
                    class="$ mx-2 i-bx-bxl-discord"
                />
                <a
                    v-if="social.type === 'TWITCH'"
                    v-tooltip="`twitch.tv/${social.externalUsername}`"
                    class="$ mx-2 i-bx-bxl-twitch"
                    :href="`https://twitch.tv/${social.externalUsername}`"
                    target="__blank"
                />
            </div>
        </div>
        <h3 class="$ my-2">{{ data.player.pronouns }}</h3>
        <h3>Set Wins: {{ data.player._count.wins }}</h3>
        <h3>Set Losses: {{ data.player._count.losses }}</h3>
        <h3 class="$ mb-4">
            Winrate:
            {{ winrate(data.player._count.wins, data.player._count.sets) }}
        </h3>
        <div
            v-for="character in data.player.characters.filter(
                (el) => el[0] !== 'null'
            )"
            :key="character.name"
            class="$ flex items-center"
        >
            <div :class="character[0]" />
            <h3>: {{ character[1] }}</h3>
        </div>
        <Tournament :data="data.player.tournaments" />

        <SetList type="h2h" title="Head to Head" />

        <SetList type="armadaNumber" title="Degrees of Winning" />
    </main>
    <div class="$ h-80" />
</template>

<script setup>
import Tournament from "../components/Tournament.vue";
import SetList from "../components/SetList.vue";
import { /* decompress_one, */ winrate } from "~~/server/utils";

const route = useRoute();

const data = $ref({
    player: null,
    h2h: { sets: [] },
    armadaNumber: { sets: [] },
});

const { data: compressed_data } = $(
    await useFetch("/api/player", { query: { name: route.params.player } })
);

// data.player = decompress_one(compressed_data);
data.player = compressed_data;

const { data: allPlayers } = $(
    await useFetch("/api/players", { query: { min: true } })
);

provide("allPlayers", allPlayers);
</script>
