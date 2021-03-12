<template>
    <div>
        <v-btn
            dark
            fab
            fixed
            bottom
            right
            icon
            class="mb-14 primary elevation-4"
            @click="onClick()"
        >
            <v-icon v-text="'mdi-plus'" />
        </v-btn>
    </div>
</template>

<script>
export default {
    methods: {
        onClick() {
            this.$emit("click");
        },
    },
};
</script>

<style></style>
