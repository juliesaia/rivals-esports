<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-3xl mt-8">Players</div>
        <Table v-bind="{ data, headers, defaultSort }" type="players" />
    </main>
</template>

<script setup>
import Table from "../components/Table.vue";

const { isGreaterOrEquals } = $(useViewport());

const { data } = $(
    await useFetch("/api/players", {
        headers: { "Cache-Control": "s-max-age=604800", Pragma: "" },
    })
);

const headers = $computed(() =>
    isGreaterOrEquals("md")
        ? [
              { name: "Player", width: "w-50" },
              { name: "Winrate", width: "w-30" },
              { name: "Last Tournament", width: "w-60" },
              { name: "Sets", width: "w-30" },
          ]
        : [{ name: "Player", width: "w-50" }]
);

const defaultSort = {
    type: "Sets",
    order: "desc",
};
</script>
