<template>
    <div>
        <v-bottom-navigation grow app v-model="active" color="black">
            <v-layout
                height="100%"
                width="100%"
                class="align-center justify-center"
            >
                <template v-for="(navigation, index) in navigations">
                    <v-btn
                        :key="'navigation-' + index"
                        :exact="
                            navigation.link === '/' ||
                                navigation.link === '/absensi'
                        "
                        text
                        :value="navigation.link"
                        :to="navigation.link"
                        height="100%"
                        :style="active !== navigation.link ? 'opacity: 1' : ''"
                    >
                        <span v-text="navigation.text" />

                        <v-icon
                            v-text="
                                active === navigation.link
                                    ? navigation.icon
                                    : navigation.icon + '-outline'
                            "
                        />
                    </v-btn>
                </template>
            </v-layout>
        </v-bottom-navigation>
    </div>
</template>

<script>
export default {
    props: {
        navigations: Array,
    },

    data: () => ({
        active: null,
        forceUpdate: 0,
    }),

    computed: {
        currentRoute() {
            let currentRoute = this.$route.path;

            return currentRoute;
        },
    },

    methods: {
        async timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
    },

    async created() {
        await this.timeout(100);
        this.active = this.currentRoute;
    },
};
</script>

<style></style>
