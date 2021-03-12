<template>
    <layout-base>
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="3" order-md="2">
                    <!-- QR Code -->
                    <v-card class="pb-4 shadow">
                        <v-layout column class="align-center">
                            <v-sheet
                                rounded
                                dark
                                color="primary"
                                class="py-2 px-4"
                            >
                                <v-layout class="align-start">
                                    <v-icon v-text="'mdi-information'" />
                                    <p
                                        v-text="
                                            'Scan Kode QR dibawah ini untuk absen'
                                        "
                                        class="ml-2 mb-0"
                                    />
                                </v-layout>
                            </v-sheet>

                            <vue-qrcode
                                v-if="showQrCode"
                                :value="currentQrCode"
                                :options="{ width: 240 }"
                                class="mt-3"
                            ></vue-qrcode>

                            <v-sheet v-else height="252">
                                <v-layout
                                    column
                                    fill-height
                                    class="align-center justify-center"
                                >
                                    <v-progress-circular
                                        indeterminate
                                        color="black"
                                    />
                                </v-layout>
                            </v-sheet>
                        </v-layout>
                    </v-card>

                    <!-- Countdown -->
                    <v-layout column class="mt-4 align-center">
                        <p
                            v-text="'Kode QR akan diperbarui dalam'"
                            class="text-center text--secondary"
                        />
                        <p
                            v-text="formatTimeLeft(timeLeft)"
                            class="text-h2 font-weight-bold"
                        />
                        <v-btn
                            text
                            v-text="'Perbarui sekarang'"
                            color="primary"
                            class="mt-n2 text-none font-weight-bold"
                            @click="refresh()"
                        />
                    </v-layout>
                </v-col>

                <v-col cols="12" md="9" order-md="1">
                    <v-row>
                        <main-attendance-list
                            title="Masuk"
                            color="info"
                            :attendances="todayAttendancesPresent"
                        />
                        <main-attendance-list
                            title="Pulang"
                            color="success"
                            :attendances="todayAttendancesReturn"
                        />
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </layout-base>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import LayoutBase from "../Others/LayoutBase.vue";
import MainAttendanceList from "./MainAttendanceList.vue";
export default {
    components: {
        VueQrcode,
        LayoutBase,
        MainAttendanceList,
    },

    props: {
        location: Object,
    },

    data: () => ({
        timeLimit: 180,
        timeLeft: 0,
        timerInterval: null,
        isGettingQrCode: true,
    }),

    computed: {
        currentQrCode() {
            return this.$store.state.attendances.currentQrCode;
        },
        qrCodeData() {
            return this.$store.state.attendances.qrCodeData;
        },
        showQrCode() {
            return !this.isGettingQrCode && this.currentQrCode !== null;
        },
        todayAttendances() {
            return this.$store.state.attendances.todayAttendances;
        },
        todayAttendancesPresent() {
            return this.$store.getters[
                "attendances/listenerTodayAttendancesPresent"
            ];
        },
        todayAttendancesReturn() {
            return this.$store.getters[
                "attendances/listenerTodayAttendancesReturn"
            ];
        },
    },

    methods: {
        generateQrCode() {
            this.$store.dispatch("attendances/generate");
        },

        refresh() {
            this.timeLeft = 0;
        },

        formatTimeLeft(time) {
            const minutes = Math.floor(time / 60);

            let seconds = time % 60;

            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            return `${minutes}:${seconds}`;
        },

        startTimer() {
            this.timerInterval = setInterval(() => {
                if (this.timeLeft > 0) this.timeLeft--;
            }, 1000);
        },

        timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        async reset() {
            this.isGettingQrCode = true;

            await this.timeout(2000);

            this.timeLeft = this.timeLimit;
            clearInterval(this.timerInterval);
            await this.generateQrCode();
            this.startTimer();

            this.isGettingQrCode = false;
        },

        listener() {
            this.$store.dispatch("attendances/listener");
        },

        listenerTodayAttendances() {
            return this.$store.dispatch("attendances/listenerTodayAttendances");
        },
    },

    async mounted() {
        await this.reset();
        this.listenerTodayAttendances();
    },

    beforeDestroy() {},

    watch: {
        timeLeft: {
            immediate: false,
            handler(timeLeft) {
                if (timeLeft === 0) {
                    this.reset();
                }
            },
        },

        currentQrCode: {
            immediate: true,
            async handler(currentQrCode) {
                if (currentQrCode) {
                    await this.listener();
                }
            },
        },

        qrCodeData: {
            immediate: true,
            async handler(newData, oldData) {
                let isScanned = newData?.isScanned || false;
                if (oldData && newData !== oldData && isScanned) {
                    let displayName = newData.scannedByDisplayName.slice(0);
                    let photoURL = newData.scannedByPhotoURL.slice(0);
                    console.log("Hallo " + displayName);
                    await this.reset();
                }
            },
        },
    },
};
</script>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
