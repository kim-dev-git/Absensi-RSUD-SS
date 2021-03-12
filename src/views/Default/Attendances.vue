<template>
    <div>
        <navigation-bar title="Absensi" />
        <layout-base>
            <!-- <all-calendar /> -->

            <v-layout column class="py-4 white shadow">
                <v-layout class="ml-4 mb-4 align-center">
                    <span v-text="'Absensi Saya'" class="font-weight-bold" />

                    <v-spacer />

                    <v-btn text color="primary">
                        <span v-text="'List'" class="text-none" />
                        <v-icon v-text="'mdi-chevron-down'" class="mr-n1" />
                    </v-btn>
                </v-layout>

                <template v-for="(attendance, index) in userAttendances">
                    <v-divider v-if="index === 0" :key="'divider-' + index" />

                    <v-layout :key="attendance.id" class="pa-4 align-center">
                        <span v-text="toDayDateMonth(attendance.returnAt)" />

                        <v-spacer />

                        <v-layout
                            v-if="attendance.returnAt"
                            class="justify-end"
                        >
                            <!-- <v-icon v-text="'mdi-account-arrow-left'" /> -->
                            <span
                                v-text="toTime(attendance.presentAt)"
                                class="text--secondary"
                            />
                            <span v-text="'-'" class="mx-2 text--secondary" />
                            <!-- <v-icon
                                v-if="attendance.returnAt"
                                class="ml-3"
                                v-text="'mdi-account-arrow-right'"
                            /> -->
                            <span
                                v-if="attendance.returnAt"
                                v-text="toTime(attendance.returnAt)"
                                class="text--secondary"
                            />
                        </v-layout>
                    </v-layout>

                    <v-divider :key="'divider-' + attendance.id" />
                </template>

                <v-sheet height="50vh" />
            </v-layout>
        </layout-base>
    </div>
</template>

<script>
import { toTime, toDayDateMonth } from "../../filters/date";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
import AllCalendar from "../../components/Attendances/AllCalendar.vue";
export default {
    components: { LayoutBase, NavigationBar, AllCalendar },

    data: () => ({
        //
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },
        userAttendances() {
            return this.$store.state.attendances.userAttendances;
        },
    },

    methods: {
        toTime,
        toDayDateMonth,
        async getUserAttendances(uid) {
            if (!uid) return;

            await this.$store.dispatch("attendances/getUserAttendances", uid);
        },
    },

    watch: {
        user: {
            immediate: true,
            handler(user) {
                if (user) {
                    this.getUserAttendances(this.user.uid);
                }
            },
        },
    },
};
</script>

<style></style>
