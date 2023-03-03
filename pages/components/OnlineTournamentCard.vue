<template>
    <div
        class="$ shadow-lg p-4 rounded-xl border-2 flex flex-col items-center h-full w-full"
    >
        <div class="$ mb-2">{{ tournament.name }}</div>
        <div
            v-if="fixTimestamp(tournament).isSame(dayjs(), 'day')"
            class="$ mb-2"
        >
            {{ fixTimestamp(tournament).format("MMMM D, h:mm A") }}
        </div>
        <div v-else-if="tournament.repeats === 'weekly'" class="$ mb-2">
            Every {{ fixTimestamp(tournament).format("dddd") }} at
            {{ fixTimestamp(tournament).format("h:mm A") }}
        </div>
        <div v-else class="$ mb-2">
            {{ fixTimestamp(tournament).format("MMMM D, h:mm A") }}
        </div>
        <NuxtLink
            :to="tournament.discordUrl"
            class="$ text-blue-500 hover:underline mb-2 break-all"
        >
            {{ tournament.discordUrl }}
        </NuxtLink>
        <div v-if="tournament.prize" class="$ mb-2">
            {{ tournament.prize }}
        </div>
        <!-- <div v-if="tournament.repeats === 'monthly'" class="$  mb-2">
            Every {{ int_to_ord(weekmonth) }}
            {{ fixTimestamp(tournament).format("dddd") }} at
            {{ fixTimestamp(tournament).format("h:mm A") }}
        </div> -->
        <nuxt-img
            :src="tournament.imageUrl"
            height="100"
            width="100"
            class="$ mb-4"
        />
    </div>
</template>
<script setup lang="ts">
import { OnlineTournament } from "@prisma/client";
import dayjs from "dayjs";
import { fixTimestamp } from "~~/server/utils";

const { tournament } = defineProps<{
    tournament: OnlineTournament;
}>();

// let weekmonth = 0;

// if (tournament.repeats === "monthly") {
//     let start = dayjs(tournament.startAtISO).date(1);

//     while (start.date() < dayjs(tournament.startAtISO).date()) {
//         start = start.add(1, "day");
//         if (start.day() === dayjs(tournament.startAtISO).day()) {
//             weekmonth++;
//         }
//     }
// }
</script>
