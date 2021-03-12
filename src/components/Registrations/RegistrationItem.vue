<template>
    <div>
        <v-list-item>
            <v-layout column class="py-3">
                <v-layout class="align-center">
                    <span
                        v-text="
                            registration.roles[registration.roles.length - 1]
                        "
                        class="font-weight-bold"
                    />
                    <v-spacer />
                    <v-sheet v-if="registration.usedByUID">
                        <v-layout class="align-center">
                            <v-avatar size="32">
                                <v-img :src="registration.usedByPhotoURL" />
                            </v-avatar>
                            <span
                                v-text="registration.usedByDisplayName"
                                class="ml-2 text--secondary d-inline-block text-truncate"
                                style="max-width: 100px;"
                            />
                            <v-btn
                                icon
                                @click="selectRegistration(registration)"
                            >
                                <v-icon v-text="'mdi-chevron-right'" />
                            </v-btn>
                        </v-layout>
                    </v-sheet>

                    <v-sheet v-else>
                        <v-layout>
                            <v-btn
                                text
                                color="primary"
                                @click="shareViaWhatsApp(registration)"
                            >
                                <span
                                    v-text="'Bagikan lewat WA'"
                                    class="text-none"
                                />
                                <v-icon right v-text="'mdi-whatsapp'" />
                            </v-btn>
                        </v-layout>
                    </v-sheet>
                </v-layout>
            </v-layout>
        </v-list-item>
    </div>
</template>

<script>
export default {
    props: {
        registration: Object,
    },

    data: () => ({
        //
    }),

    methods: {
        shareViaWhatsApp(registration) {
            let site = "https://pkl-absensi.web.app/daftar/";
            let registrationLink = encodeURIComponent(site + registration.id);
            let url = "whatsapp://send?text=";
            // let url = "https://wa.me/?text=";
            let message = `Klik disini untuk mendaftar: %0a` + registrationLink;
            window.open(url + message, "_blank");
        },

        selectRegistration(registration) {
            console.log("Selected Registration:", registration.id);
        },
    },
};
</script>

<style></style>
