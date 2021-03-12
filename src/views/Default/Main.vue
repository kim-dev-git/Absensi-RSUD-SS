<template>
    <div>
        <navigation-bar />

        <!-- <v-main>
            <span v-text="'Location'" />
            <span v-text="location.latitude + ' | ' + location.longitude" />
        </v-main> -->

        <main-qr-generator v-if="isQrGenerator" :location="location" />

        <layout-base v-else>
            <!-- <span v-text="location.latitude + ' | ' + location.longitude" /> -->

            <!-- <span v-text="'Main'" /> -->

            <v-layout v-if="user" column class="pa-4">
                <v-row>
                    <v-col
                        v-if="isPresentToday && !isReturnedToday"
                        cols="12"
                        sm="6"
                        lg="4"
                        class="mb-n2"
                    >
                        <v-card dark color="info" class="pa-4 shadow">
                            <v-layout class="align-start">
                                <span
                                    v-html="
                                        `Hallo <b>${user.displayName}</b>, kamu sudah absen`
                                    "
                                    style="line-height: 1.3rem;"
                                    class="font-weight-light"
                                />
                                <v-spacer />
                                <v-icon v-text="'mdi-check'" />
                            </v-layout>
                        </v-card>
                    </v-col>
                    <!-- // -->
                    <v-col
                        v-if="isPresentToday && !isReturnedToday"
                        cols="12"
                        sm="6"
                        lg="4"
                        class="mb-n2"
                    >
                        <v-card dark color="grey" class="pa-4 shadow">
                            <span
                                v-text="'Absen dulu sebelum pulang'"
                                style="line-height: 1.3rem;"
                                class="title"
                            />
                            <v-layout class="mt-2">
                                <v-layout column fill-height align-start>
                                    <span
                                        v-text="
                                            'Tekan tombol dibawah untuk absen'
                                        "
                                        class="font-weight-light"
                                        style="line-height: 1.5rem; min-width: 150px;"
                                    />
                                    <v-btn
                                        light
                                        depressed
                                        class="mt-4"
                                        @click="showScanner()"
                                    >
                                        <span
                                            v-text="'Scan Absen'"
                                            class="text--secondary"
                                        />
                                    </v-btn>
                                </v-layout>
                                <v-spacer />
                                <v-img
                                    contain
                                    :src="svg.notPresentYet"
                                    max-height="124"
                                    :max-width="
                                        $vuetify.breakpoint.xs
                                            ? '40vw'
                                            : '128px'
                                    "
                                    position="bottom right"
                                />
                            </v-layout>
                        </v-card>
                    </v-col>
                    <!-- // -->
                    <v-col v-if="!isPresentToday" cols="12" sm="6" lg="4">
                        <v-card dark color="warning" class="pa-4 shadow">
                            <span
                                v-text="'Anda belum absen'"
                                style="line-height: 1.3rem;"
                                class="title"
                            />
                            <v-layout class="mt-2">
                                <v-layout column fill-height align-start>
                                    <span
                                        v-text="
                                            'Tekan tombol dibawah untuk absen'
                                        "
                                        class="font-weight-light"
                                        style="line-height: 1.5rem; min-width: 150px;"
                                    />
                                    <v-btn
                                        light
                                        depressed
                                        class="mt-4"
                                        @click="showScanner()"
                                    >
                                        <span
                                            v-text="'Scan Absen'"
                                            class="text--secondary"
                                        />
                                    </v-btn>
                                </v-layout>
                                <v-spacer />
                                <v-img
                                    contain
                                    :src="svg.notPresentYet"
                                    max-height="124"
                                    :max-width="
                                        $vuetify.breakpoint.xs
                                            ? '40vw'
                                            : '128px'
                                    "
                                    position="bottom right"
                                />
                            </v-layout>
                        </v-card>
                    </v-col>
                    <!-- // -->
                    <v-col v-if="isReturnedToday" cols="12" sm="6" lg="4">
                        <v-card dark color="success" class="pa-4 shadow">
                            <span
                                v-text="'Anda sudah absen pulang'"
                                style="line-height: 1.3rem;"
                                class="title"
                            />
                            <v-layout class="mt-2">
                                <v-layout column fill-height align-start>
                                    <span
                                        v-text="
                                            'Tekan tombol dibawah untuk melihat detail absen hari ini'
                                        "
                                        class="font-weight-light"
                                        style="line-height: 1.5rem; min-width: 150px;"
                                    />
                                    <v-btn
                                        light
                                        depressed
                                        class="mt-4"
                                        @click="$router.push('/absensi')"
                                    >
                                        <span
                                            v-text="'Detail Absen'"
                                            class="text--secondary"
                                        />
                                    </v-btn>
                                </v-layout>
                                <v-spacer />
                                <v-img
                                    contain
                                    :src="svg.notReturnedYet"
                                    max-height="124"
                                    :max-width="
                                        $vuetify.breakpoint.xs
                                            ? '40vw'
                                            : '128px'
                                    "
                                    position="bottom right"
                                />
                            </v-layout>
                        </v-card>
                    </v-col>
                </v-row>
            </v-layout>

            <!-- <main-button-scan @click="showScanner()" /> -->
            <main-qr-scanner v-model="showQrScanner" @decode="onDecode" />
        </layout-base>
    </div>
</template>

<script>
import { toCollectionDate } from "../../filters/date";
import geolocation from "../../services/geolocation";
import MainButtonScan from "../../components/Main/MainButtonScan.vue";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import MainQrScanner from "../../components/Main/MainQrScanner.vue";
import MainQrGenerator from "../../components/Main/MainQrGenerator.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";

export default {
    components: {
        LayoutBase,
        MainButtonScan,
        MainQrScanner,
        MainQrGenerator,
        NavigationBar,
    },

    data: () => ({
        showQrScanner: false,
        location: {},
        svg: {
            notPresentYet: require("@/assets/attendance_not_present_yet.svg"),
            present: require("@/assets/attendance_present.svg"),
            notReturnedYet: require("@/assets/attendance_not_returned_yet.svg"),
            returned: require("@/assets/attendance_present.svg"),
        },
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },
        isQrGenerator() {
            let isQrGenerator = false;
            let user = this.user;

            if (!user) return false;

            user.roles.map((role) => {
                if (role === "QR Generator") isQrGenerator = true;
            });

            return isQrGenerator;
        },
        isPresentToday() {
            let { lastPresentId } = this.user;
            let todayToId = this.toCollectionDate(new Date());
            let isPresentToday = lastPresentId === todayToId;

            return isPresentToday;
        },
        isReturnedToday() {
            let { lastReturnId } = this.user;
            let todayToId = this.toCollectionDate(new Date());
            let isReturnedToday = lastReturnId === todayToId;

            return isReturnedToday;
        },
    },

    methods: {
        toCollectionDate,
        async geo() {
            let geo = await geolocation;
            this.location = geo;
        },

        showScanner() {
            this.showQrScanner = true;
        },

        async onDecode(qrcode) {
            await this.$store.dispatch("attendances/checkQrCode", qrcode);
            this.showQrScanner = false;
        },
    },

    mounted() {
        this.geo();
    },
};
</script>

<style></style>
