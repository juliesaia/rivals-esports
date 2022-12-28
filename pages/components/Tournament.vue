<template>
    <h1 class="mt-8">Tournaments</h1>
    <Accordion class="w-160 py-4">
        <div
            v-for="tournament in tournaments"
            :key="tournament.id"
            class="m-3 mb-0 shadow-lg rounded-lg border border-gray-900"
        >
            <AccordionItem>
                <!-- This slot will handle the title/header of the accordion and is the part you click on -->

                <template #accordion-trigger>
                    <h3 class="cursor-pointer flex items-center p-3">
                        <nuxt-img
                            :src="`/tournaments/${tournament.name}.png`"
                            height="40"
                            width="40"
                            class="mr-2"
                        />
                        <div class="flex flex-col">
                            <div>
                                {{ tournament.name }}
                            </div>
                            <div>
                                {{
                                    int_to_ord(
                                        tournament.standings[0].placement
                                    )
                                }}
                                place
                            </div>
                        </div>
                        <div class="flex-grow" />
                        <div class="flex flex-col text-end">
                            <div>Seed: {{ tournament.standings[0].seed }}</div>
                            <div>SPR: {{ tournament.standings[0].spr }}</div>
                        </div>
                    </h3>
                </template>
                <!-- This slot will handle all the content that is passed to the accordion -->
                <template #accordion-content>
                    <Set :data="tournament.sets" />
                </template>
            </AccordionItem>
        </div>
    </Accordion>
</template>

<script setup lang="ts">
import Accordion from "../components/Accordion.vue";
import AccordionItem from "../components/AccordionItem.vue";
import Set from "./Set.vue";
import { int_to_ord } from "~~/server/utils";

// const username = location.pathname.split("/").at(-1);

const { data: tournaments } = defineProps<{
    data: Array<any>;
}>();
</script>
