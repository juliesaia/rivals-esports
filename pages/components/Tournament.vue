<template>
    <div class="flex flex-col items-center">
        <h1 class="$ my-4">Tournaments</h1>
        <Accordion
            class="$ w-80vw md:w-160 overflow-y-auto border border-2 rounded-xl shadow-lg"
        >
            <!-- <div v-for="tournament in tournaments" :key="tournament.id"> -->
            <DynamicScroller
                :items="tournaments"
                :min-item-size="74"
                :prerender="10"
                class="max-h-200"
            >
                <template #default="{ item: tournament, index, active }">
                    <DynamicScrollerItem
                        :item="tournament"
                        :active="active"
                        :size-dependencies="tournament"
                        :data-index="index"
                    >
                        <div v-if="active">
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
                                                v-for="league in tournament.leagues"
                                                :key="league.name"
                                            >
                                                {{ league.shortName }} S{{
                                                    league.season
                                                }}
                                            </div>
                                            <div
                                                v-if="
                                                    tournament.standings.at(-1)
                                                        .placement != null
                                                "
                                            >
                                                {{
                                                    int_to_ord(
                                                        tournament.standings.at(
                                                            -1
                                                        ).placement
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
                                                    tournament.standings.at(-1)
                                                        .seed != null
                                                "
                                            >
                                                Seed:
                                                {{
                                                    tournament.standings.at(-1)
                                                        .seed
                                                }}
                                            </div>
                                            <div
                                                v-if="
                                                    tournament.standings.at(-1)
                                                        .spr != null
                                                "
                                            >
                                                SPR:
                                                {{
                                                    tournament.standings.at(-1)
                                                        .spr
                                                }}
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
                    </DynamicScrollerItem>
                </template>
                <!-- </div> -->
            </DynamicScroller>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import Accordion from "./Accordion.vue";
import AccordionItem from "./AccordionItem.vue";
import Set from "./Set.vue";
import { int_to_ord, resizeSGG } from "~~/server/utils";

defineEmits(["toggle"]);

const { data: tournaments } = defineProps<{
    data: Array<any>;
}>();
</script>
