<template>
    <main class="$ flex flex-col items-center">
        <div class="$ text-3xl mt-8">Tournaments</div>
        <Table v-bind="{ data, headers, defaultSort }" type="tournaments" />
    </main>
</template>

<script setup lang="ts">
import Table from "../components/Table.vue";

const { isGreaterOrEquals } = $(useViewport());

const { data } = $(
    await useFetch("/api/tournaments", {
        headers: { "Cache-Control": "max-age=604800", Pragma: "" },
    })
);

const headers = $computed(() =>
    isGreaterOrEquals("md")
        ? [
              { name: "Tournament", width: "w-60" },
              { name: "Leagues", width: "w-20", unsortable: true },
              { name: "Entrants", width: "w-30" },
              { name: "Date", width: "w-40" },
              { name: "Location", width: "w-40", unsortable: true },
          ]
        : [{ name: "Tournament", width: "w-60" }]
);

const defaultSort = {
    type: "Date",
    order: "desc",
};
</script>
