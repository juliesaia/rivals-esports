<template>
    <div
        style="
            font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif;
        "
    >
        <NuxtLayout>
            <NuxtLoadingIndicator color="rgb(88,28,135)" />
            <Navbar />
            <NuxtPage />
            <Footer />
        </NuxtLayout>
    </div>
</template>
<script setup>
import Navbar from "./pages/components/Navbar.vue";
import Footer from "./pages/components/Footer.vue";
</script>
