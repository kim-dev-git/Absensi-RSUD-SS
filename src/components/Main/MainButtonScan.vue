<template>
    <div>
        <v-btn
            dark
            rounded
            fixed
            bottom
            right
            class="mb-14 primary elevation-4"
            @click="onClick()"
        >
            <v-icon v-text="'mdi-qrcode-scan'" class="ml-1 mr-3" />
            <span v-text="'Scan Absen'" class="mr-2" />
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
