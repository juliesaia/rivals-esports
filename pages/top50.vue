<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-3xl mt-8">RCS Top 50 Rankings</div>
        <div class="$ flex gap-4 items-center mt-4">
            <div>Season:</div>
            <div v-for="index in top50.length" :key="index">
                <ARadio
                    v-model="season"
                    name="season"
                    :value="(top50.length - index + 1).toString()"
                    :label="(top50.length - index + 1).toString()"
                    class="$ mt-1"
                />
            </div>
        </div>
        <Accordion class="$ mt-4 w-full md:w-160">
            <AccordionItem
                v-for="player in top50[season - 1]"
                :key="player.name"
                class="$ w-full"
            >
                <template #accordion-header>
                    <div
                        class="$ px-4 md:px-12 py-4 flex items-center gap-12 text-2xl"
                    >
                        <div class="$ w-8">{{ player.ranking }}</div>
                        <div class="$ flex items-center">
                            <div :class="player.char" />
                            <NuxtLink
                                :external="true"
                                class="$ pl-2 whitespace-nowrap hover:underline"
                                :to="`/players/${player.name}`"
                            >
                                {{ player.name }}
                            </NuxtLink>
                        </div>
                    </div>
                </template>
                <template #accordion-content>
                    <div class="$ pt-3 pb-6 px-12">
                        <div class="$ pb-4">
                            <div
                                v-for="tournament in player.tournaments"
                                :key="tournament.name"
                                class="$ flex items-center p-3"
                            >
                                <NuxtLink
                                    :external="true"
                                    :to="`/tournaments/${shortSlug(
                                        tournament
                                    )}`"
                                >
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
                                </NuxtLink>
                                <div class="$ flex flex-col">
                                    <NuxtLink
                                        :external="true"
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
                                                    b.placement - a.placement
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
                                                    b.placement - a.placement
                                            )[0].seed != null
                                        "
                                    >
                                        Seed:
                                        {{
                                            tournament.standings.sort(
                                                (a, b) =>
                                                    b.placement - a.placement
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
                        </div>
                        <div class="text-left">{{ player.blurb }}</div>
                    </div>
                </template>
            </AccordionItem>
        </Accordion>
    </main>
</template>
<script setup lang="ts">
import { ARadio } from "anu-vue";
import Accordion from "./components/Accordion.vue";
import AccordionItem from "./components/AccordionItem.vue";
import { int_to_ord, spr, shortSlug, resizeSGG } from "~~/server/utils";

const { data: top50 } = $(await useFetch("/api/top50"));

const season = $ref(top50.length.toString());
</script>
