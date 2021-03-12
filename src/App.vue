<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
export default {
    name: "App",

    components: {},

    data: () => ({
        //
    }),
};
</script>

<style lang="scss">
.shadow {
    box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
        0 15px 40px rgba(166, 173, 201, 0.2) !important;
}
.shadowbar {
    box-shadow: 0 1px 10px rgba(154, 160, 185, 0.2) !important;
}
</style>
