<template>
    <v-img
        contain
        :src="require('@/assets/logo.png')"
        :height="height"
        :width="width"
    />
</template>

<script>
export default {
    props: {
        height: {
            type: Number,
            default: 64,
        },
        width: {
            type: Number,
            default: 64,
        },
    },
};
</script>

<style></style>
