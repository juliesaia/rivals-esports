<template>
    <ul>
        <slot />
    </ul>
</template>

<script setup lang="ts">
import { provide } from "vue";

const accordion = $ref({
    count: 0,
    active: null,
});

provide("accordion", accordion);
</script>
