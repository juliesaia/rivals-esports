<template>
    <div class="$ flex flex-col">
        <Autocomplete
            :horizontal="true"
            placement="right-start"
            class="$ ml-auto"
            :data="data.map((el) => el.name)"
            :disabled="loading"
            @submit="submit"
            @input="(e) => (filterinput = e)"
        />
        <div class="$ overflow-hidden border border-gray-900 rounded-xl">
            <div
                class="$ flex items-center text-center border-b border-gray-900 px-4 pb-4 pt-6"
            >
                <div
                    v-for="header in headers"
                    :key="header"
                    class="$ flex items-center justify-center px-4"
                    :class="header.width"
                >
                    <div class="$ pl-2">{{ header.name }}</div>
                    <div v-if="!header.unsortable" class="$ flex flex-col ml-2">
                        <div
                            class="$ i-bx-bxs-chevron-up cursor-pointer"
                            :class="{
                                'opacity-50 cursor-default!':
                                    sort.type === header.name &&
                                    sort.order === 'asc',
                            }"
                            @click="sort = { type: header.name, order: 'asc' }"
                        />
                        <div
                            class="$ i-bx-bxs-chevron-down cursor-pointer"
                            :class="{
                                'opacity-50 cursor-default!':
                                    sort.type === header.name &&
                                    sort.order === 'desc',
                            }"
                            @click="sort = { type: header.name, order: 'desc' }"
                        />
                    </div>
                </div>
            </div>
            <div
                v-for="(item, index) in sorted"
                :key="item.id"
                class="$ py-4 block border-gray-900"
                :class="{
                    'bg-purple-200': index % 2 === 1,
                }"
            >
                <div class="$ flex items-center text-center px-4 h-10">
                    <div
                        v-for="header in headers"
                        :key="header.name"
                        class="$ px-4"
                        :class="header.width"
                    >
                        <div
                            v-if="header.name === 'Player'"
                            class="$ flex items-center px-4 w-60 pl-12"
                        >
                            <div
                                v-if="item.favoriteCharacter"
                                :class="item.favoriteCharacter"
                            />
                            <div v-else class="$ h-32px w-32px" />
                            <NuxtLink
                                :external="true"
                                class="$ pl-2 whitespace-nowrap hover:underline"
                                :to="`/players/${item.name}`"
                            >
                                {{ item.name }}
                            </NuxtLink>
                        </div>
                        <div
                            v-if="header.name === 'Tournament'"
                            class="$ flex items-center px-4 w-60 pl-0"
                        >
                            <NuxtLink
                                :external="true"
                                v-if="item.profileImage"
                                :to="`/tournaments/${shortSlug(item)}`"
                            >
                                <nuxt-img
                                    :src="resizeSGG(item.profileImage, 40, 40)"
                                    height="40"
                                    width="40"
                                    class="$ mr-2"
                                    :alt="`${item.name} Icon`"
                                />
                            </NuxtLink>
                            <div v-else class="$ h-32px w-32px" />
                            <NuxtLink
                                :external="true"
                                class="$ pl-2 hover:underline text-left"
                                :to="`/tournaments/${shortSlug(item)}`"
                            >
                                {{ item.name }}
                            </NuxtLink>
                        </div>
                        <div v-if="header.name === 'Rank'">
                            {{ item.rankings[0]?.rank }}
                        </div>
                        <div
                            v-if="header.name === 'Leagues'"
                            class="$ flex flex-col"
                        >
                            <div
                                v-for="league in item.leagues"
                                :key="league.shortName"
                                class="$ whitespace-nowrap"
                            >
                                {{ league.shortName }}: S{{ league.season }}
                            </div>
                        </div>
                        <div v-if="header.name === 'Winrate'">
                            {{ winrate(item._count.wins, item._count.sets) }}
                        </div>
                        <div v-if="header.name === 'Entrants'">
                            {{ item._count.entrants }}
                        </div>
                        <div v-if="header.name === 'Date'">
                            {{
                                dayjs
                                    .unix(item.startAt)
                                    .tz(item.timezone)
                                    .format("MMMM YYYY")
                            }}
                        </div>
                        <div v-if="header.name === 'Location'">
                            <Location :tournament="item" />
                        </div>
                        <NuxtLink
                            :external="true"
                            v-if="header.name === 'Last Tournament'"
                            class="$ hover:underline"
                            :to="`/tournaments/${shortSlug(
                                item.tournaments[0]
                            )}`"
                        >
                            {{ item.tournaments[0]?.name }}
                        </NuxtLink>
                        <div v-if="header.name === 'Placement'">
                            {{ int_to_ord(item.placement) }}
                        </div>
                        <div v-if="header.name === 'Seed'">
                            {{ item.seed }}
                        </div>
                        <div v-if="header.name === 'SPR'">
                            {{ spr(item) }}
                        </div>
                        <div v-if="header.name === 'Sets'">
                            {{ item._count.sets }}
                        </div>
                        <div
                            v-if="header.name === 'Losses'"
                            class="$ flex flex-col"
                        >
                            <div
                                v-for="loss in item.losses"
                                :key="loss.id"
                                class="$ flex items-center px-4 w-60 pl-12"
                            >
                                <div
                                    v-if="loss.winner.favoriteCharacter"
                                    :class="loss.winner.favoriteCharacter"
                                />
                                <div v-else class="$ h-32px w-32px" />
                                <NuxtLink
                                    :external="true"
                                    class="$ pl-2 whitespace-nowrap hover:underline"
                                    :to="`/players/${loss.winner.name}`"
                                >
                                    {{ loss.winner.name }}
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="$ flex items-center mt-4">
        <div
            class="$ i-bx-bxs-chevrons-left"
            :class="{
                'cursor-pointer': page > 1,
                'opacity-50 cursor-default!': page <= 1,
            }"
            @click="page = 1"
        />
        <div
            class="$ i-bx-bxs-chevron-left"
            :class="{
                'cursor-pointer': page > 1,
                'opacity-50 cursor-default!': page <= 1,
            }"
            @click="page > 1 ? page-- : (page = 1)"
        />
        <div class="$ flex justify-evenly w-40 md:w-120">
            <div
                v-for="index in pages"
                :key="index"
                class="$ mx-1 cursor-pointer select-none border border-black rounded-full flex justify-center items-center w-full px-2"
                :class="{ 'bg-purple-300': index === page }"
                @click="page = index"
            >
                {{ index }}
            </div>
        </div>
        <div
            class="$ i-bx-bxs-chevron-right"
            :class="{
                'cursor-pointer': page < totalPages,
                'opacity-50 cursor-default!': page >= totalPages,
            }"
            @click="page < totalPages ? page++ : (page = totalPages - 1)"
        />
        <div
            class="$ i-bx-bxs-chevrons-right"
            :class="{
                'cursor-pointer': page < totalPages,
                'opacity-50 cursor-default!': page >= totalPages,
            }"
            @click="
                // @ts-ignore
                page = totalPages
            "
        />
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import Autocomplete from "../components/Autocomplete.vue";
import Location from "./mini/Location.vue";
import {
    int_to_ord,
    winrate,
    resizeSGG,
    spr,
    shortSlug,
} from "~~/server/utils";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

const { data, headers, type, defaultSort } = defineProps<{
    data: any;
    headers: any[];
    type: string;
    defaultSort: any;
}>();

const router = useRouter();
const { isGreaterOrEquals } = $(useViewport());

let loading = $ref(false);

const perPage = 8;
const numPagesShown = $computed(() => (isGreaterOrEquals("md") ? 8 : 4));

const sort = $ref(defaultSort);

let page = $ref(1);

const filterinput = $ref("");

const filtered = $computed(() => {
    if (!filterinput) {
        return data;
    }

    page = 1;

    return data.filter((item) => {
        return item.name.toLowerCase().includes(filterinput.toLowerCase());
    });
});

const sorted = $computed(() => {
    if (sort.type === "Rank") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.rankings[0]?.rank ?? Infinity) -
                      (b.rankings[0]?.rank ?? Infinity)
                    : (b.rankings[0]?.rank ?? Infinity) -
                      (a.rankings[0]?.rank ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Player" || sort.type === "Tournament") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? a.name > b.name
                        ? 1
                        : -1
                    : a.name > b.name
                    ? -1
                    : 1
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Winrate") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? parseInt(winrate(a._count.wins, a._count.sets)) -
                      parseInt(winrate(b._count.wins, b._count.sets))
                    : parseInt(winrate(b._count.wins, b._count.sets)) -
                      parseInt(winrate(a._count.wins, a._count.sets))
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Last Tournament") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.tournaments[0]?.name ?? Infinity) >
                      (b.tournaments[0]?.name ?? Infinity)
                        ? 1
                        : -1
                    : (a.tournaments[0]?.name ?? Infinity) >
                      (b.tournaments[0]?.name ?? Infinity)
                    ? -1
                    : 1
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Placement") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.placement ?? Infinity) - (b.placement ?? Infinity)
                    : (b.placement ?? Infinity) - (a.placement ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Seed") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.seed ?? Infinity) - (b.seed ?? Infinity)
                    : (b.seed ?? Infinity) - (a.seed ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "SPR") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (spr(a) ?? Infinity) - (spr(b) ?? Infinity)
                    : (spr(b) ?? Infinity) - (spr(a) ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Season") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.season ?? Infinity) - (b.season ?? Infinity)
                    : (b.season ?? Infinity) - (a.season ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Entrants") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a._count.entrants ?? Infinity) -
                      (b._count.entrants ?? Infinity)
                    : (b._count.entrants ?? Infinity) -
                      (a._count.entrants ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    if (sort.type === "Date") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a.startAt ?? Infinity) - (b.startAt ?? Infinity)
                    : (b.startAt ?? Infinity) - (a.startAt ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }

    if (sort.type === "Sets") {
        return filtered
            .sort((a, b) =>
                sort.order === "asc"
                    ? (a._count.sets ?? Infinity) - (b._count.sets ?? Infinity)
                    : (b._count.sets ?? Infinity) - (a._count.sets ?? Infinity)
            )
            .slice((page - 1) * perPage, page * perPage);
    }
    return filtered.slice((page - 1) * perPage, page * perPage);
});

const totalPages = $computed(() => Math.ceil(filtered.length / perPage));

const pages = $computed(() => {
    if (page === 1) {
        const output = [];
        for (let i = page; i < page + numPagesShown && i <= totalPages; i++) {
            output.push(i);
        }
        return output;
        // @ts-ignore
    } else if (page === totalPages) {
        const output = [];
        // for (let i = totalPages - numPagesShown + 1; i <= totalPages; i++) {
        for (
            let i = totalPages;
            i >= totalPages - numPagesShown + 1 && i >= 1;
            i--
        ) {
            output.unshift(i);
        }
        return output;
    } else if (page === Math.max(...pages) + 1) {
        pages.splice(0, 1);
        pages.push(page);
        return pages;
    } else if (page === Math.min(...pages) - 1) {
        pages.pop();
        pages.unshift(page);
        return pages;
    } else {
        return pages;
    }
});
// Math.min(perPage, filtered.length)

function submit(e) {
    loading = true;
    if (type === "tournaments") {
        router.push(`/${type}/${shortSlug(filtered[0])}/`);
    } else if (type === "players") {
        router.push(`/${type}/${filtered[0].name}`);
    }
}
</script>
