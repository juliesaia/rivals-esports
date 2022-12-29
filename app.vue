<template>
    <div
        style="
            font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif;
        "
    >
        <NuxtLayout>
            <Navbar />
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup>
import Navbar from "./pages/components/Navbar.vue";
</script>
