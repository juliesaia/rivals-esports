<template>
    <div class="flex flex-col items-center">
        <h1 class="$ mt-8">Tournaments</h1>
        <Accordion class="$ w-160 py-4">
            <div v-for="tournament in tournaments" :key="tournament.id">
                <div v-show="!tournament.hidden">
                    <AccordionItem>
                        <!-- This slot will handle the title/header of the accordion and is the part you click on -->

                        <template #accordion-header>
                            <h3 class="$ flex items-center p-3">
                                <nuxt-img
                                    :src="
                                        resizeSGG(
                                            tournament.profileImage,
                                            40,
                                            40
                                        )
                                    "
                                    height="40"
                                    width="40"
                                    class="$ mr-2"
                                />
                                <div class="$ flex flex-col">
                                    <NuxtLink
                                        class="$ hover:underline"
                                        :to="`/tournaments/${tournament.shortSlug}`"
                                    >
                                        {{ tournament.name }}
                                    </NuxtLink>
                                    <div
                                        v-if="
                                            tournament.standings[0].placement !=
                                            null
                                        "
                                    >
                                        {{
                                            int_to_ord(
                                                tournament.standings[0]
                                                    .placement
                                            )
                                        }}
                                        place
                                    </div>
                                </div>
                                <div class="$ flex-grow" />
                                <div
                                    class="$ flex flex-col text-end whitespace-nowrap"
                                >
                                    <div
                                        v-if="
                                            tournament.standings[0].seed != null
                                        "
                                    >
                                        Seed: {{ tournament.standings[0].seed }}
                                    </div>
                                    <div
                                        v-if="
                                            tournament.standings[0].spr != null
                                        "
                                    >
                                        SPR: {{ tournament.standings[0].spr }}
                                    </div>
                                </div>
                            </h3>
                        </template>
                        <!-- This slot will handle all the content that is passed to the accordion -->
                        <template #accordion-content>
                            <Set :data="tournament.sets" />
                        </template>
                    </AccordionItem>
                </div>
            </div>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import Accordion from "../components/Accordion.vue";
import AccordionItem from "../components/AccordionItem.vue";
import Set from "./Set.vue";
import { int_to_ord, resizeSGG } from "~~/server/utils";

defineEmits(["toggle"]);

const { data: tournaments } = defineProps<{
    data: Array<any>;
}>();
</script>
