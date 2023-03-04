<template>
    <div
        style="
            font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        "
    >
        <NuxtLayout>
            <NuxtLoadingIndicator color="rgb(88,28,135)" />
            <Navbar />
            <NuxtPage class="flex-grow" />
            <Footer />
        </NuxtLayout>
    </div>
</template>
<script setup>
import Navbar from "./pages/components/Navbar.vue";
import Footer from "./pages/components/Footer.vue";
</script>
