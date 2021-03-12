<template>
    <v-bottom-sheet v-model="show" max-width="600">
        <v-sheet class="dialog-sheet-radius">
            <v-layout class="pa-3 align-center">
                <span v-if="title" v-text="title" class="title" />
                <v-spacer />
                <v-btn v-if="closeable" icon @click="show = false">
                    <v-icon v-text="'mdi-close'" />
                </v-btn>
            </v-layout>

            <v-layout column>
                <slot />
            </v-layout>
        </v-sheet>
    </v-bottom-sheet>
</template>

<script>
export default {
    props: {
        value: Boolean,
        title: String,
        closeable: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        show: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
$radius: 1rem;

.dialog-sheet-radius {
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
}
</style>
