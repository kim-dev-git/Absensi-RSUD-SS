<template>
    <div>
        <v-navigation-drawer app color="white">
            <v-app-bar dense flat color="white">
                <!-- <navigation-logo /> -->
            </v-app-bar>

            <v-list class="mt-5">
                <template v-for="(navigation, index) in navigations">
                    <v-list-item
                        :key="index"
                        @click="navigationClick(navigation)"
                        :style="listStyle(navigation)"
                    >
                        <v-layout class="align-center">
                            <v-icon
                                v-text="navigation.icon"
                                :color="iconColor(navigation)"
                            />
                            <span
                                v-text="navigation.text"
                                class="mx-3"
                                :class="textClass(navigation)"
                            />
                        </v-layout>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    props: {
        navigations: Array,
    },

    data: () => ({}),

    computed: {
        currentRoute() {
            let currentRoute = this.$route.path;

            return currentRoute;
        },
    },

    methods: {
        iconColor(navigation) {
            let color = "";
            let currentRoute = this.currentRoute;
            let navigationRoute = navigation.link;
            let isActive = currentRoute === navigationRoute;

            if (isActive) color = "black";

            return color;
        },
        textClass(navigation) {
            let textClass = "font-weight-normal";
            let currentRoute = this.currentRoute;
            let navigationRoute = navigation.link;
            let isActive = currentRoute === navigationRoute;

            if (isActive) textClass = "font-weight-medium";

            return textClass;
        },

        listStyle(navigation) {
            let listStyle = "";
            let currentRoute = this.currentRoute;
            let navigationRoute = navigation.link;
            let isActive = currentRoute === navigationRoute;

            if (isActive) listStyle = "background-color: rgba(0, 0, 0, .1)";

            return listStyle;
        },

        navigationClick(navigation) {
            this.$emit("navigation-click", navigation);
        },
    },
};
</script>

<style></style>
