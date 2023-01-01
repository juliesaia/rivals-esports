<template>
    <div v-if="tournament.online">Online</div>
    <div
        v-else-if="tournament.city && tournament.state"
        class="$ flex justify-center"
    >
        <div class="$ mr-1">{{ tournament.city }},</div>
        <div>{{ tournament.state }}</div>
    </div>
</template>
<script setup lang="ts">
const { tournament } = defineProps<{ tournament: any }>();
</script>
