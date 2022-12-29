<template>
    <main class="flex flex-col items-center">
        <div class="flex flex-col mt-8">
            <Autocomplete
                :horizontal="true"
                placement="right-start"
                class="ml-auto"
                :data="data.map((el) => el.name)"
                @submit="
                    (e) => {
                        router.push(`/players/${e}/`);
                    }
                "
                @input="(e) => (filterinput = e)"
            />
            <div class="overflow-hidden border border-gray-900 rounded-xl">
                <div
                    class="flex items-center text-center border-b border-gray-900 px-4 pb-4 pt-6"
                >
                    <div
                        v-for="header in headers"
                        :key="header"
                        class="flex items-center justify-center pr-8"
                        :class="header.width"
                    >
                        <div class="pl-2">{{ header.name }}</div>
                        <div class="flex flex-col ml-2">
                            <div
                                class="i-bx-bxs-chevron-up cursor-pointer"
                                :class="{
                                    'opacity-50 cursor-default!':
                                        sort.type === header.name &&
                                        sort.order === 'asc',
                                }"
                                @click="
                                    sort = { type: header.name, order: 'asc' }
                                "
                            />
                            <div
                                class="i-bx-bxs-chevron-down cursor-pointer"
                                :class="{
                                    'opacity-50 cursor-default!':
                                        sort.type === header.name &&
                                        sort.order === 'desc',
                                }"
                                @click="
                                    sort = { type: header.name, order: 'desc' }
                                "
                            />
                        </div>
                    </div>
                </div>
                <NuxtLink
                    v-for="(player, index) in sorted"
                    :key="player.id"
                    :to="`/players/${player.name}/`"
                    class="py-4 hover:bg-purple-300 block border-gray-900"
                    :class="{
                        'bg-purple-200': index % 2 === 1,
                    }"
                >
                    <div class="flex items-center text-center px-4 h-8">
                        <div class="flex items-center pr-8 w-60 pl-12">
                            <div
                                v-if="player.favoriteCharacter"
                                :class="player.favoriteCharacter"
                            />
                            <div v-else class="h-32px w-32px" />
                            <div class="pl-2 whitespace-nowrap">
                                {{ player.name }}
                            </div>
                        </div>
                        <div class="pr-8 w-20">
                            {{ player.rankings[0]?.rank }}
                        </div>
                        <div class="pr-8 w-30">
                            {{
                                winrate(player._count.wins, player._count.sets)
                            }}
                        </div>
                        <div class="pr-8 w-60">
                            {{ player.tournaments[0]?.name }}
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
        <div class="flex items-center mt-4">
            <div
                class="i-bx-bxs-chevrons-left"
                :class="{
                    'cursor-pointer': page > 1,
                    'opacity-50 cursor-default!': page <= 1,
                }"
                @click="page = 1"
            />
            <div
                class="i-bx-bxs-chevron-left"
                :class="{
                    'cursor-pointer': page > 1,
                    'opacity-50 cursor-default!': page <= 1,
                }"
                @click="page > 1 ? page-- : (page = 1)"
            />
            <div class="flex justify-evenly w-120">
                <div
                    v-for="index in pages"
                    :key="index"
                    class="mx-1 cursor-pointer select-none border border-black rounded-full flex justify-center items-center w-full px-2"
                    :class="{ 'bg-purple-300': index === page }"
                    @click="page = index"
                >
                    {{ index }}
                </div>
            </div>
            <div
                class="i-bx-bxs-chevron-right"
                :class="{
                    'cursor-pointer': page < totalPages,
                    'opacity-50 cursor-default!': page >= totalPages,
                }"
                @click="page < totalPages ? page++ : (page = totalPages - 1)"
            />
            <div
                class="i-bx-bxs-chevrons-right"
                :class="{
                    'cursor-pointer': page < totalPages,
                    'opacity-50 cursor-default!': page >= totalPages,
                }"
                @click="page = totalPages"
            />
        </div>
    </main>
</template>

<script setup>
import Autocomplete from "../components/Autocomplete.vue";
import { winrate, decompress } from "~~/server/utils";

const router = useRouter();

const { data: compressed_data } = $(await useFetch("/api/players"));

// const data = $computed(() => decompress(compressed_data));

const data = decompress(compressed_data);

const sort = $ref({
    type: "Rank",
    order: "asc",
});

const headers = [
    { name: "Player", width: "w-60" },
    { name: "Rank", width: "w-20" },
    { name: "Winrate", width: "w-30" },
    { name: "Last Tournament", width: "w-60" },
];

let page = $ref(1);

const filterinput = $ref("");

const filtered = $computed(() => {
    if (!filterinput) {
        return data;
    }

    page = 1;

    return data.filter((item) => {
        return item.name.toLowerCase().startsWith(filterinput.toLowerCase());
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
            .slice(
                (page - 1) * Math.min(10, filtered.length),
                page * Math.min(10, filtered.length)
            );
    }
    if (sort.type === "Player") {
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
            .slice((page - 1) * 10, page * 10);
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
            .slice((page - 1) * 10, page * 10);
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
            .slice((page - 1) * 10, page * 10);
    }
});

const totalPages = $computed(() => Math.ceil(filtered.length / 10));

const pages = $computed(() => {
    if (page === 1) {
        const output = [];
        for (
            let i = page;
            i < page + Math.min(10, filtered.length) && i <= totalPages;
            i++
        ) {
            output.push(i);
        }
        return output;
        // } else if (page === totalPages) {
        //     const output = [];
        //     for (
        //         let i = totalPages - Math.min(10, filtered.length) + 1;
        //         i <= totalPages;
        //         i++
        //     ) {
        //         output.push(i);
        //     }
        //     return output;
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
</script>
