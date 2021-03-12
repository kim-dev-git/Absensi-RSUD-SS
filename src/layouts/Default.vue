<template>
    <div>
        <bottom-navigation v-if="isOnMobile" />

        <router-view />
    </div>
</template>

<script>
import BottomNavigation from "../components/Others/BottomNavigation.vue";
import LayoutBase from "../components/Others/LayoutBase.vue";
export default {
    components: { LayoutBase, BottomNavigation },

    computed: {
        isOnMobile() {
            let isOnMobile = this.$vuetify.breakpoint.xs;

            return isOnMobile;
        },
    },
};
</script>

<style></style>
