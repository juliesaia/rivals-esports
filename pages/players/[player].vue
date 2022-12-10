<template>
    <div class="$">{{ $route.params.player }}</div>
    <div>{{ data }}</div>
    <!-- <div class="$">
        Season 7 Standing: #{{
            data?.rankings.find((el) => el.season === 7).rank
        }}
    </div>
    <div class="$">Pronouns: {{ data?.pronouns }}</div>
    <div class="$">Socials: {{ data?.socials }}</div>
    <div>The Big House 10</div>
    <div class="$">Wins: {{ data?.wins.map((el) => el.loser.name) }}</div> -->
</template>

<script setup>
const route = useRoute();

const { data } = $(await useFetch(`/api/player?name=${route.params.player}`));

console.log(data);
</script>
