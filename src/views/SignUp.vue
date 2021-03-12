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

                    <v-layout
                        v-if="registrationData"
                        column
                        class="align-center justify-center"
                    >
                        <p
                            v-text="'Daftar Sebagai: '"
                            class="text--secondary"
                        />
                        <v-chip
                            v-for="role in registrationData.roles"
                            :key="role"
                            v-text="role"
                            class="mb-4"
                        />
                    </v-layout>

                    <v-layout class="align-end" style="width: 100%">
                        <v-btn
                            large
                            depressed
                            block
                            :disabled="disabledButton"
                            color="primary"
                            @click="userSignIn()"
                        >
                            Daftar
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

    props: {
        id: String,
    },

    data: () => ({
        //
    }),

    computed: {
        isAuthenticated() {
            return this.$store.getters["users/isAuthenticated"];
        },
        registrationData() {
            return this.$store.state.users.registrationData;
        },
        disabledButton() {
            return this.registrationData === null;
        },
    },

    methods: {
        userSignIn() {
            this.$store.dispatch("users/authGoogle");
        },
        getRegistration() {
            let registrationId = this.id;
            this.$store.dispatch("users/getRegistration", registrationId);
        },
    },

    watch: {
        isAuthenticated(isAuthenticated) {
            if (isAuthenticated) this.$router.push("/");
        },
    },

    mounted() {
        this.getRegistration();
    },
};
</script>

<style></style>
