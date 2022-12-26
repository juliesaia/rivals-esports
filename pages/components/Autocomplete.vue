<template>
    <form
        class="flex flex-col items-center"
        @submit.prevent="() => submit(autocomplete[selected])"
    >
        <div class="w-40 mb-4">
            <VDropdown
                :placement="'bottom'"
                :triggers="[]"
                :autoHide="false"
                :shown="
                    focused && input?.length > 0 && autocomplete[0] !== input
                "
                :auto-size="true"
            >
                <AInput
                    v-model="input"
                    type="text"
                    @keydown.down="
                        selected === autocomplete.length - 1
                            ? (selected = autocomplete.length - 1)
                            : selected++;
                        autocompleteref?.children[selected].scrollIntoView({
                            block: 'nearest',
                        });
                    "
                    @keydown.up="
                        selected <= 0 ? (selected = 0) : selected--;
                        autocompleteref?.children[selected].scrollIntoView({
                            block: 'nearest',
                        });
                    "
                    @focus="
                        selected = 0;
                        focused = true;
                    "
                    @blur="focused = false"
                />
                <template #popper>
                    <div ref="autocompleteref" class="max-h-50">
                        <div
                            v-for="(item, index) in autocomplete"
                            :key="item"
                            class="p-2 hover:bg-purple-300 transition-colors cursor-pointer"
                            :class="{ 'bg-purple-300': selected === index }"
                            @mousedown="submit(item)"
                        >
                            {{ item }}
                        </div>
                    </div>
                </template>
            </VDropdown>
        </div>
        <ABtn type="submit" class="mb-4">Submit</ABtn>
    </form>
</template>
<script setup lang="ts">
const { data } = defineProps<{
    data: Array<any>;
}>();

const emit = defineEmits(["submit"]);

let input = $ref("");

const autocompleteref = $ref<HTMLElement | null>(null);

const selected = $ref(0);

let focused = $ref(false);

const autocomplete = $computed(() => {
    if (!input) {
        return [];
    }

    return data.filter((item) => {
        return item.toLowerCase().startsWith(input.toLowerCase());
    });
});

function submit(item) {
    input = item;

    emit("submit", item);

    focused = false;

    // @ts-ignore
    document.activeElement.blur();
}
</script>
