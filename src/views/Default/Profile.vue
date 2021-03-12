<template>
    <div>
        <navigation-bar title="Profil" marginButton="6" />
        <layout-base color="white">
            <v-layout column>
                <v-layout v-if="user" class="pa-4 align-start">
                    <v-avatar size="42" class="shadow">
                        <v-img :src="user.photoURL" />
                    </v-avatar>

                    <v-layout column class="ml-4 mt-n1 align-start">
                        <v-layout class="mt-n1 align-center">
                            <span
                                v-text="user.displayName"
                                class="font-weight-bold"
                            />
                            <!-- <v-spacer /> -->
                            <v-btn icon @click="onEdit()">
                                <v-icon small v-text="'mdi-pencil'" />
                            </v-btn>
                        </v-layout>
                        <span v-text="userRole" class="mt-n2 text--secondary" />

                        <v-btn
                            text
                            color="error"
                            height="20"
                            class="ml-n2 mt-2"
                            @click="userSignOut()"
                        >
                            <span v-text="'Logout'" class="text-none mx-n2" />
                        </v-btn>
                    </v-layout>
                </v-layout>

                <v-divider />

                <v-sheet height="50vh" />
            </v-layout>
        </layout-base>

        <dialog-sheet v-model="showDialogInput" title="Edit Nama">
            <input-form v-model="userName" label="Nama" @submit="onUpdate" />
        </dialog-sheet>
    </div>
</template>

<script>
import DialogSheet from "../../components/Others/DialogSheet.vue";
import InputForm from "../../components/Others/InputForm.vue";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
export default {
    components: { LayoutBase, DialogSheet, InputForm, NavigationBar },

    data: () => ({
        showDialogInput: false,
        userName: "",
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },
        userRole() {
            return this.$store.getters["users/userRole"];
        },
    },

    methods: {
        userSignOut() {
            this.$store.dispatch("users/signOut");
        },

        onEdit() {
            this.userName = this.user.displayName;
            this.showDialogInput = true;
        },

        async onUpdate(value) {
            let updatedUser = {
                displayName: value,
            };

            await this.$store.dispatch("users/update", updatedUser);
            this.showDialogInput = false;
        },
    },
};
</script>

<style></style>
