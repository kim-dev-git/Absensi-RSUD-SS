<template>
    <v-main :class="color" style="min-height: 100vh">
        <v-layout column>
            <slot />
        </v-layout>
    </v-main>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: "base",
        },
    },
};
</script>

<style></style>
