<template>
    <div class="$ w-160 text-center">
        <h1 class="$ mt-8 mb-4">{{ title }}</h1>
        <!-- <v-autocomplete /> -->

        <Autocomplete :data="allPlayers" @submit="submit" />

        <h2 v-if="type === 'h2h' && data.sets.length" class="$ mb-2">
            Lifetime: {{ data._count.wins }} -
            {{ data._count.losses }}
        </h2>
        <div
            v-if="
                type === 'armadaNumber' &&
                (data.sets.length || data.path === null)
            "
            class="$ mb-2"
        >
            <h2 v-if="data.path">
                Armada Number: {{ data.path.split(">").length - 1 }}
            </h2>
            <h2>Path: {{ data.path ?? "No possible path." }}</h2>
        </div>
        <div
            ref="setRef"
            class="$ overflow-hidden transition-all duration-500"
            :style="{
                'max-height': '0px',
            }"
        >
            <Set :data="data.sets" />
        </div>
    </div>
</template>
<script setup lang="ts">
import Set from "../components/Set.vue";
import Autocomplete from "./Autocomplete.vue";
import { sleep } from "~~/server/utils";

const { type, title } = defineProps<{
    type: String;
    title: String;
}>();

const route = useRoute();

const setRef = $ref(null);

let data = $ref({ sets: [], _count: { wins: 0, losses: 0 }, path: "" });

const allPlayers: string[] = inject("allPlayers");

async function submit(playername: string) {
    const { data: newData } = $(
        await useFetch(
            `/api/player?name=${route.params.player}&${type}=${playername}`
        )
    );

    if (data.sets.length) {
        close(setRef);
        await sleep(500);
    }

    // @ts-ignore sometimes its not worth it
    data = newData;

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
