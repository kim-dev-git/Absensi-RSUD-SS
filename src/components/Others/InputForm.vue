<template>
    <v-layout class="px-3 mt-0">
        <v-text-field
            autofocus
            dense
            filled
            clearable
            v-model="model"
            :placeholder="label"
        />

        <v-scale-transition leave-absolute>
            <v-btn
                v-if="model"
                icon
                class="mt-1"
                color="primary"
                @click="onSubmit()"
            >
                <v-icon v-text="'mdi-send'" />
            </v-btn>
        </v-scale-transition>
    </v-layout>
</template>

<script>
export default {
    props: {
        value: String,
        label: String,
    },

    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            },
        },
    },

    methods: {
        onSubmit() {
            this.$emit("submit", this.model);
        },
    },
};
</script>

<style></style>
