<template>
    <div>
        <v-app-bar app dense class="shadowbar" color="white">
            <v-layout v-if="!title" class="align-center">
                <img
                    :src="require('@/assets/logo.png')"
                    height="18"
                    class="mr-3"
                />
                <span v-text="'RSUD SS'" class="title" />
            </v-layout>
            <v-layout v-else class="align-center">
                <v-btn
                    v-if="backButton"
                    icon
                    :class="`ml-n4 mr-${marginButton}`"
                    @click="onBack()"
                >
                    <v-icon v-text="'mdi-arrow-left'" />
                </v-btn>

                <span v-text="title" class="title" />
            </v-layout>

            <!-- <v-spacer /> -->

            <slot />

            <v-avatar
                v-if="!title && user"
                size="28"
                class="shadow"
                style="cursor: pointer"
                @click="$router.push('/profil')"
            >
                <img :src="user.photoURL" />
            </v-avatar>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        backButton: Boolean,
        marginButton: {
            type: String || Number,
            default: "2",
        },
    },

    data: () => ({
        //
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },
    },

    methods: {
        onBack() {
            this.$router.go(-1);
        },
    },
};
</script>

<style></style>
