<!-- eslint-disable vue/attribute-hyphenation -->
<template>
    <form
        class="$ flex items-center"
        :class="{ 'flex-col': !horizontal }"
        @submit.prevent="() => submit(autocomplete[selected])"
    >
        <ABtn
            v-if="horizontal"
            type="submit"
            class="$ mb-4"
            :class="{ 'mr-4': horizontal }"
        >
            Submit
        </ABtn>
        <div class="$ w-40">
            <VDropdown
                :placement="placement"
                :triggers="[]"
                :autoHide="false"
                :shown="
                    (autocomplete?.length ?? 0) > 0 && focused // && autocomplete[0] !== input
                "
                :auto-size="!horizontal"
            >
                <AInput
                    v-model="input"
                    placeholder="Search..."
                    type="text"
                    class="$ mb-4"
                    @keydown.down="
                        async () => {
                            selected >= autocomplete.length - 1
                                ? (selected = autocomplete.length - 1)
                                : selected++;
                            if (
                                isScrolledIntoView(
                                    autocompleteref?.children[selected]
                                )
                            ) {
                                key_pressed = true;
                                await sleep(150);
                                key_pressed = false;
                            }
                            autocompleteref?.children[selected].scrollIntoView({
                                block: 'nearest',
                            });
                        }
                    "
                    @keydown.up="
                        async () => {
                            selected <= 0 ? (selected = 0) : selected--;
                            if (
                                isScrolledIntoView(
                                    autocompleteref?.children[selected]
                                )
                            ) {
                                key_pressed = true;
                                await sleep(150);
                                key_pressed = false;
                            }
                            autocompleteref?.children[selected].scrollIntoView({
                                block: 'nearest',
                            });
                        }
                    "
                    @focus="
                        selected = 0;
                        focused = true;
                    "
                    @blur="focused = false"
                />
                <template #popper>
                    <div
                        ref="autocompleteref"
                        class="$ max-h-50"
                        :class="{ 'w-40': horizontal }"
                    >
                        <div
                            v-for="(item, index) in autocomplete"
                            :key="item"
                            class="$ p-2 hover:bg-purple-300 cursor-pointer"
                            :class="{
                                'bg-purple-300': selected === index,
                                'transition-colors': key_pressed,
                            }"
                            @mousedown="submit(item)"
                        >
                            {{ item }}
                        </div>
                    </div>
                </template>
            </VDropdown>
        </div>
        <ABtn v-if="!horizontal" type="submit" class="$ mb-4">Submit</ABtn>
    </form>
</template>
<script setup lang="ts">
import { sleep, isScrolledIntoView } from "~~/server/utils";
const {
    data,
    horizontal = false,
    placement = "bottom",
} = defineProps<{
    data: Array<any>;
    horizontal?: boolean;
    placement?: string;
}>();

const emit = defineEmits(["submit", "input"]);

let input = $ref("");

const autocompleteref = $ref<HTMLElement | null>(null);

const clean_data = [...new Set(data)];

let selected = $ref(0);

let focused = $ref(false);

const key_pressed = $ref(false);

const autocomplete = $computed(() => {
    if (!input) {
        return [];
    }

    selected = 0;

    return clean_data.filter((item) => {
        return item.toLowerCase().startsWith(input.toLowerCase());
    });
});

function submit(item) {
    if (!item) {
        return;
    }
    input = item;

    emit("submit", item);

    focused = false;

    // @ts-ignore
    document.activeElement.blur();
}

watchEffect(() => {
    emit("input", input);
});
</script>
