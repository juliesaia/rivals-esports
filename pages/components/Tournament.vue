<template>
    <div class="$ flex flex-col items-center">
        <h1 class="$ my-4">Tournaments</h1>
        <Accordion
            class="$ w-80vw md:w-160 overflow-y-auto border border-2 rounded-xl shadow-lg"
        >
            <!-- <div v-for="tournament in tournaments" :key="tournament.id"> -->
            <DynamicScroller
                :items="tournaments"
                :min-item-size="74"
                :prerender="10"
                class="$ max-h-200"
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
                                    <div class="$ flex items-center p-3">
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
                                            :alt="`${tournament.name} Icon`"
                                        />
                                        <div class="$ flex flex-col">
                                            <NuxtLink
                                                class="$ hover:underline"
                                                :to="`/tournaments/${shortSlug(
                                                    tournament
                                                )}`"
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
                                                    tournament.standings.sort(
                                                        (a, b) =>
                                                            b.placement -
                                                            a.placement
                                                    )[0].placement != null
                                                "
                                            >
                                                {{
                                                    int_to_ord(
                                                        tournament.standings.sort(
                                                            (a, b) =>
                                                                b.placement -
                                                                a.placement
                                                        )[0].placement
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
                                                    tournament.standings.sort(
                                                        (a, b) =>
                                                            b.placement -
                                                            a.placement
                                                    )[0].seed != null
                                                "
                                            >
                                                Seed:
                                                {{
                                                    tournament.standings.sort(
                                                        (a, b) =>
                                                            b.placement -
                                                            a.placement
                                                    )[0].seed
                                                }}
                                            </div>
                                            <div
                                                v-if="
                                                    spr(
                                                        tournament.standings.sort(
                                                            (a, b) =>
                                                                b.placement -
                                                                a.placement
                                                        )[0]
                                                    ) != null
                                                "
                                            >
                                                SPR:
                                                {{
                                                    spr(
                                                        tournament.standings.sort(
                                                            (a, b) =>
                                                                b.placement -
                                                                a.placement
                                                        )[0]
                                                    )
                                                }}
                                            </div>
                                        </div>
                                    </div>
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
import { int_to_ord, resizeSGG, spr, shortSlug } from "~~/server/utils";

defineEmits(["toggle"]);

const { data: tournaments } = defineProps<{
    data: Array<any>;
}>();
</script>
