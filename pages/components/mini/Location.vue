<template>
    <div v-if="tournament.online">Online</div>
    <div v-else class="$ flex justify-center">
        <div v-if="tournament.city" class="$ mr-1">{{ tournament.city }},</div>
        <div v-if="tournament.state">{{ tournament.state }}</div>
    </div>
</template>
<script setup lang="ts">
const { tournament } = defineProps<{ tournament: any }>();
</script>
