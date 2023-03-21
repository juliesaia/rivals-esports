<template>
    <div
        style="
            font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif;
        "
        class="$ flex flex-col min-h-100vh"
    >
        <NuxtLayout>
            <NuxtLoadingIndicator color="rgb(88,28,135)" />
            <Navbar />
            <div class="$ flex-grow">
                <NuxtPage />
            </div>
            <Footer />
        </NuxtLayout>
    </div>
</template>
<script setup>
import Navbar from "./pages/components/Navbar.vue";
import Footer from "./pages/components/Footer.vue";
</script>
