<template>
    <main class="$ flex flex-col items-center">
        <div class="text-3xl my-8">Rivals Replay Organizer</div>
        <div class="text-xl mb-8">
            The easiest way to upload your replays for online tournament
            streams!
        </div>
        <div class="flex gap-10 items-center text-center">
            <div>
                <img src="rroscreenshot1.png" width="444" height="327" />
                <div class="my-8">Load your sets from saved replays,</div>
            </div>
            <div>
                <img
                    src="rroscreenshot2.png"
                    width="397"
                    height="219"
                    class="py-54px"
                />
                <div class="my-8">
                    And automatically generate zip files of your sets!
                </div>
            </div>
        </div>
        <a
            href="https://github.com/CheesyPotato/Rivals-Replay-Organizer/releases/download/1.0.4/Rivals.Replay.Organizer.1.0.4.zip"
        >
            <ABtn class="text-2xl mt-5"> Download </ABtn>
        </a>
        <div class="mt-2 text-gray">Windows x64, portable</div>
    </main>
</template>
<script setup>
import { ABtn } from "anu-vue";
</script>
