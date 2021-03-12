<template>
    <div>
        <v-bottom-navigation grow app v-model="active" color="black">
            <v-layout
                height="100%"
                width="100%"
                class="align-center justify-center"
            >
                <template v-for="(nav, index) in navList">
                    <v-btn
                        :key="'nav-' + index"
                        :exact="nav.link === '/' || nav.link === '/absensi'"
                        text
                        :value="nav.link"
                        :to="nav.link"
                        height="100%"
                        :style="active !== nav.link ? 'opacity: 1' : ''"
                    >
                        <span v-text="nav.text" />

                        <v-icon
                            v-text="
                                active === nav.link
                                    ? nav.icon
                                    : nav.icon + '-outline'
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
    data: () => ({
        active: null,
        forceUpdate: 0,
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },

        navList() {
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
