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
        <div class="$ flex flex-wrap mb-4">
            <div
                v-for="accolade in grouped_accolades"
                :key="accolade.shortName"
                v-tooltip="
                    `${accolade.title}${
                        accolade.count > 1 ? ` ${accolade.count}x` : ''
                    }: ${accolade.description}`
                "
                class="$ text-2xl"
                :class="{
                    'i-bx-trophy': accolade.type === 'trophy',
                    'i-bx-medal': accolade.type === 'achievement',
                    'text-[#acffbd]':
                        accolade.rarity.split('-').at(-1) === 'master' ||
                        accolade.rarity.split('-').at(-1) === 'jeweled',
                    'text-[#acffff]':
                        accolade.rarity.split('-').at(-1) === 'diamond',
                    'text-[#d2d2f0]':
                        accolade.rarity.split('-').at(-1) === 'platinum',
                    'text-[#ffcc00]':
                        accolade.rarity.split('-').at(-1) === 'gold',
                    'text-[#c8c8c8]':
                        accolade.rarity.split('-').at(-1) === 'silver',
                    'text-[#ff9966]':
                        accolade.rarity.split('-').at(-1) === 'bronze',
                }"
            />
        </div>
        <div class="$ flex">
            <div
                v-for="character in characters.filter((el) => el[0] !== 'null')"
                :key="character.name"
                class="$ flex items-center m-2"
            >
                <div :class="character[0]" />
                <h3 class="$ whitespace-nowrap">: {{ character[1] }}</h3>
            </div>
        </div>

        <Tournament :data="hidden_tournaments" />

        <div
            v-if="isGreaterOrEquals('lg')"
            class="$ fixed top-50% right-0 border-2 border-purple-900 border-r-transparent rounded-l-xl p-8 flex flex-col"
            style="transform: translateY(-50%)"
        >
            <ACheckbox
                v-model="filters.offline"
                label="Offline"
                class="$ mb-4"
            />
            <ACheckbox v-model="filters.online" label="Online" class="$ mb-4" />
            <ACheckbox
                v-model="filters.offseason"
                label="Offseason"
                class="$ mb-4"
            />
            <div class="$ flex">
                <div
                    v-for="(seasons, league) in seasons_dict"
                    :key="league"
                    class="$ flex flex-col items-evenly mr-4"
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
</template>

<script setup>
import Tournament from "../components/Tournament.vue";
import SetList from "../components/SetList.vue";
import { winrate } from "~~/server/utils";
import { seasons_dict } from "~~/server/dictionaries";

const route = useRoute();
const { isGreaterOrEquals } = $(useViewport());

const data = $ref({
    player: null,
    h2h: { sets: [] },
    armadaNumber: { sets: [] },
});

const filters = $ref({
    offline: true,
    online: true,
    offseason: true,
});

filters.leagues = structuredClone(seasons_dict); // sometimes its too reactive...
// filters.leagues = { RCS: [7], GRL: [], ROCS: [] };

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

const { data: player_data } = $(
    await useFetch("/api/player", {
        query: { name: route.params.player, id: route.query?.id },
    })
);

data.player = player_data;

const hidden_tournaments = $computed(() => {
    const output = [];
    // data.player.tournaments.map(
    for (const el of data.player.tournaments) {
        if (
            el.sets.filter(
                (el2) =>
                    el2.loserGameCount < 0 &&
                    el2.loser.name === data.player.name
            ).length < 2 &&
            (filters.offline || el.online === true) &&
            (filters.online || el.online === false) &&
            (filters.offseason || el.leagues.length > 0) &&
            (el.leagues.length === 0 ||
                el.leagues.some((el2) =>
                    filters.leagues[el2.shortName].includes(el2.season)
                ))
        ) {
            // el.size = 74;
            output.push(el);
        }
        // else {
        //     el.size = 0;
        // }
    }
    // return data.player.tournaments;
    return output;
});

const filtered_tournaments = $computed(() =>
    hidden_tournaments.filter((el) => !el.hidden)
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

    const output = [];

    let total = 0;

    for (const [character, count] of characters_list) {
        if (character !== "null") {
            total += count;
        }
    }
    for (const [character, count] of characters_list) {
        if (count / total > 0.1) {
            output.push([
                character,
                Math.round((count / total) * 100).toString() + "%",
            ]);
        }
    }

    return output;
});

const { data: allPlayers } = $(
    await useFetch("/api/players", { query: { min: true } })
);

provide("allPlayers", allPlayers);
provide("filters", filters);

const grouped_accolades = $computed(() => {
    let accolades = {};
    for (const accolade of data.player.accolades) {
        if (
            (accolade.online == null && accolade.leagues == null) ||
            ((filters.offline || accolade.online[0] === true) &&
                (filters.online || accolade.online[0] === false) &&
                (filters.offseason || accolade.leagues.length > 0) &&
                ((accolade.leagues?.length ?? 0) === 0 ||
                    accolade.leagues.some((el2) =>
                        filters.leagues[el2.shortName].includes(el2.season)
                    )))
        ) {
            const shortName = accolade.shortName;
            if (!(shortName in accolades)) {
                accolade.count = 1;
                accolades[shortName] = accolade;
            } else {
                accolades[shortName].count += 1;
                accolades[shortName].leagues = accolades[
                    shortName
                ].leagues.concat(accolade.leagues);
                accolades[shortName].online = accolades[
                    shortName
                ].online.concat(accolade.online);
            }
        }
    }

    accolades = Object.values(accolades);

    const rarities = [
        "jeweled",
        "master",
        "diamond",
        "platinum",
        "gold",
        "silver",
        "bronze",
        "8",
        "32",
    ];
    let trophies = [];
    let achievements = [];

    for (const rarity of rarities) {
        trophies = [
            ...trophies,
            ...accolades.filter(
                (el) =>
                    el.rarity.split("-").at(-1) === rarity &&
                    el.type === "trophy"
            ),
        ];
        achievements = [
            ...achievements,
            ...accolades.filter(
                (el) =>
                    el.rarity.split("-").at(-1) === rarity &&
                    el.type === "achievement"
            ),
        ];
    }

    return [...trophies, ...achievements];
});
</script>
