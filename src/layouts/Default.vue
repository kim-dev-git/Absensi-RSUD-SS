<template>
    <div>
        <bottom-navigation
            v-if="isOnMobile"
            :navigations="navigations"
            @navigation-click="goto"
        />
        <navigation-drawer
            v-else
            :navigations="navigations"
            @navigation-click="goto"
        />

        <router-view />
    </div>
</template>

<script>
import BottomNavigation from "../components/Others/BottomNavigation.vue";
import LayoutBase from "../components/Others/LayoutBase.vue";
import NavigationDrawer from "../components/Others/NavigationDrawer.vue";
export default {
    components: { LayoutBase, BottomNavigation, NavigationDrawer },

    computed: {
        isOnMobile() {
            let isOnMobile = this.$vuetify.breakpoint.xs;

            return isOnMobile;
        },

        user() {
            return this.$store.state.users.currentUser;
        },

        navigations() {
            let navigations = [
                {
                    text: "Utama",
                    icon: "mdi-home",
                    value: "main",
                    link: "/",
                },
            ];
            let user = this.user;
            let isUserNotFound = !user || !user.roles.length;

            if (isUserNotFound) return navigations;

            user.roles.map((role) => {
                if (role === "Super Admin") {
                    navigations.push({
                        text: "Semua Absen",
                        icon: "mdi-clipboard",
                        value: "attendances",
                        link: "/absensi/semua",
                    });

                    navigations.push({
                        text: "Pegawai",
                        icon: "mdi-account-group",
                        value: "employees",
                        link: "/pegawai",
                    });

                    navigations.push({
                        text: "Pendaftaran",
                        icon: "mdi-account-multiple-plus",
                        value: "registrations",
                        link: "/register",
                    });
                }

                if (role === "Pegawai") {
                    navigations.push({
                        text: "Absensi Saya",
                        icon: "mdi-clipboard-list",
                        value: "attendances",
                        link: "/absensi",
                    });
                }

                if (role === "Kepala Kepegawaian") {
                    navigations.push({
                        text: "Semua Absen",
                        icon: "mdi-clipboard",
                        value: "attendances",
                        link: "/absensi/semua",
                    });

                    navigations.push({
                        text: "Pegawai",
                        icon: "mdi-account-group",
                        value: "employees",
                        link: "/pegawai",
                    });
                }
            });

            navigations.push({
                text: "Profil",
                icon: "mdi-account",
                value: "profile",
                link: "/profil",
            });

            return navigations;
        },

        currentRoute() {
            let currentRoute = this.$route.path;

            return currentRoute;
        },
    },

    methods: {
        goto(navigation) {
            let currentRoute = this.currentRoute;
            let destinationRoute = navigation.link;
            let isSame = currentRoute === destinationRoute;

            if (isSame) return;
            else this.$router.push(destinationRoute);
        },
    },
};
</script>

<style></style>
