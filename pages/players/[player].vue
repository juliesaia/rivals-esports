<template>
    <main class="$ flex flex-col items-center w-50vw mx-auto">
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
        <h3>Set Wins: {{ wins }}</h3>
        <h3>Set Losses: {{ losses }}</h3>
        <h3 class="$ mb-4">
            Winrate:
            {{ winrate(wins, wins + losses) }}
        </h3>
        <div
            v-for="character in characters.filter((el) => el[0] !== 'null')"
            :key="character.name"
            class="$ flex items-center"
        >
            <div :class="character[0]" />
            <h3>: {{ character[1] }}</h3>
        </div>

        <Tournament :data="filtered_tournaments" />

        <div
            class="fixed top-50% right-0 border-2 border-purple-900 border-r-transparent rounded-l-xl p-8 flex flex-col"
            style="transform: translateY(-50%)"
        >
            <ACheckbox
                v-model="filters.online"
                label="Include Online"
                class="mb-4"
            />
            <ACheckbox
                v-model="filters.offseason"
                label="Include Offseason"
                class="mb-4"
            />
            <div class="flex">
                <div
                    v-for="(seasons, league) in seasons_dict"
                    :key="league"
                    class="flex flex-col items-evenly mr-4"
                >
                    <div>{{ league }}</div>
                    <ACheckbox
                        v-if="seasons.length > 1"
                        v-model="all[league]"
                        label="All"
                        @change="
                            (e) =>
                                e.target.checked
                                    ? (filters.leagues[league] =
                                          seasons_dict[league])
                                    : (filters.leagues[league] = [])
                        "
                    />
                    <ACheckbox
                        v-for="season in seasons"
                        :key="season"
                        v-model="filters.leagues[league]"
                        :value="season"
                        :label="season.toString()"
                    />
                </div>
            </div>
        </div>

        <SetList type="h2h" title="Head to Head" />

        <SetList type="armadaNumber" title="Degrees of Winning" />
    </main>
    <div class="$ h-80" />
</template>

<script setup>
import Tournament from "../components/Tournament.vue";
import SetList from "../components/SetList.vue";
import { /* decompress_one, */ winrate } from "~~/server/utils";
import { seasons_dict } from "~~/server/dictionaries";

const route = useRoute();

const data = $ref({
    player: null,
    h2h: { sets: [] },
    armadaNumber: { sets: [] },
});

const filters = $ref({
    online: true,
    offseason: true,
});

filters.leagues = structuredClone(seasons_dict); // sometimes its too reactive...

const all = $ref({});

for (const league in seasons_dict) {
    all[league] = true;
}

watchEffect(() => {
    for (const [league, seasons] of Object.entries(filters.leagues)) {
        if (seasons.length === seasons_dict[league].length) {
            all[league] = true;
        } else {
            all[league] = false;
        }
    }
});

const { data: compressed_data } = $(
    await useFetch("/api/player", { query: { name: route.params.player } })
);

// data.player = decompress_one(compressed_data);
data.player = compressed_data;

console.log(data.player);

const filtered_tournaments = $computed(() =>
    data.player.tournaments.filter(
        (el) =>
            (filters.online || el.online === false) &&
            (filters.offseason || el.leagues.length > 0) &&
            (el.leagues.length === 0 ||
                el.leagues.some((el2) =>
                    filters.leagues[el2.shortName].includes(el2.season)
                ))
    )
);

const wins = $computed(
    () =>
        filtered_tournaments
            .map((el) => el.sets)
            .flat()
            .filter((el) => el.winner.name === data.player.name).length
);

const losses = $computed(
    () =>
        filtered_tournaments
            .map((el) => el.sets)
            .flat()
            .filter((el) => el.loser.name === data.player.name).length
);

const characters = $computed(() => {
    const characters = {};
    for (const tournament of filtered_tournaments) {
        for (const set of tournament.sets) {
            for (const game of set.games) {
                const character =
                    game.winner.name === data.player.name
                        ? game.winnerChar
                        : game.loserChar;

                if (!(character in characters)) {
                    characters[character] = 1;
                } else {
                    characters[character] += 1;
                }
            }
        }
    }

    const characters_list = Object.entries(characters);

    // @ts-ignore
    characters_list.sort(([, a], [, b]) => b - a);

    return characters_list;
});

const { data: allPlayers } = $(
    await useFetch("/api/players", { query: { min: true } })
);

provide("allPlayers", allPlayers);
provide("filters", filters);
</script>
