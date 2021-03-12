<template>
    <div>
        <v-main>
            <v-container class="pa-0" style="height: 100vh">
                <v-layout column class="fill-height align-center">
                    <v-layout column class="align-center">
                        <the-logo :height="96" :width="96" />
                        <p
                            v-text="'ABSENSI'"
                            class="text-center title mt-n14 mb-0"
                        />
                        <p
                            v-text="'Aplikasi Absensi RSUD Sultan Suriansyah'"
                            class="text--secondary mb-0"
                        />
                    </v-layout>
                    <v-layout class="align-end" style="width: 100%">
                        <v-btn
                            tile
                            depressed
                            block
                            large
                            color="primary"
                            @click="userSignIn()"
                        >
                            Masuk
                        </v-btn>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import TheLogo from "../components/Others/TheLogo.vue";
export default {
    components: { TheLogo },

    data: () => ({
        //
    }),

    computed: {
        isAuthenticated() {
            return this.$store.getters["users/isAuthenticated"];
        },
    },

    methods: {
        userSignIn() {
            this.$store.dispatch("users/authGoogle");
        },
    },

    watch: {
        isAuthenticated(isAuthenticated) {
            if (isAuthenticated) this.$router.push("/");
        },
    },
};
</script>

<style></style>
