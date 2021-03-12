<template>
    <div>
        <v-layout class="py-4 align-center white">
            <span v-text="'Semua Absensi'" class="ml-4 font-weight-medium" />

            <v-spacer />

            <v-text-field
                v-model="selectedMonth"
                type="month"
                solo
                dense
                flat
                background-color="grey lighten-3"
                class="mx-4 mb-n7"
            />
        </v-layout>

        <template v-for="data in monthlyAttendances">
            <div :key="data.id">
                <v-card flat>
                    <v-layout column class="px-4 py-2">
                        <span
                            v-text="toDayDateMonth(String(data.numericDate))"
                            class="font-weight-medium"
                        />

                        <v-layout class="align-center">
                            <v-icon v-text="'mdi-account-check'" />
                            <span
                                v-text="
                                    data.returns ? data.returns.length : '-'
                                "
                                class="mx-1 font-weight-bold"
                            />
                            <span
                                v-text="'hadir'"
                                class="mr-4 text--secondary"
                            />
                            <v-icon v-text="'mdi-account-cancel'" />
                            <span
                                v-text="
                                    data.absences ? data.absences.length : '-'
                                "
                                class="mx-1 font-weight-bold"
                            />

                            <v-spacer />

                            <v-btn
                                text
                                color="primary"
                                class="mr-n4"
                                @click="selectDetailAbsen(data.numericDate)"
                            >
                                <span v-text="'Detail'" class="text-none" />
                                <v-icon v-text="'mdi-chevron-down'" />
                            </v-btn>
                        </v-layout>
                    </v-layout>
                </v-card>
            </div>
        </template>

        <!-- <template v-for="attendance in todayAttendances">
            <div :key="attendance.id">
                <v-card class="ma-4">
                    <v-layout class="px-4 py-2">
                        <v-avatar size="32">
                            <v-img :src="attendance.photoURL" />
                        </v-avatar>
                        <v-layout column class="ml-3">
                            <span
                                v-text="attendance.displayName"
                                class="font-weight-bold"
                            />
                            <span
                                v-text="attendance.jobTitle || '-'"
                                class="text--secondary"
                            />
                        </v-layout>
                        <span v-text="toJSDate(attendance.numericDate)" />
                    </v-layout>
                </v-card>
            </div>
        </template> -->
    </div>
</template>

<script>
import { toDayDateMonth, toCollectionDate } from "../../filters/date";
export default {
    data: () => ({
        selectedMonth: new Date().toISOString().slice(0, 7),
    }),

    computed: {
        monthlyAttendances() {
            return this.$store.state.attendances.monthlyAttendances;
        },
        todayAttendances() {
            return this.$store.state.attendances.todayAttendances;
        },
        startOfMonth() {
            let startOfMonth = new Date(this.selectedMonth + "-01");
            let convertedStartOfMonth = toCollectionDate(startOfMonth);

            return convertedStartOfMonth;
        },
        endOfMonth() {
            let selectedMonth = new Date(this.selectedMonth + "-01");
            let endOfMonth = selectedMonth.setMonth(
                selectedMonth.getMonth() + 1,
                0
            );
            let convertedEndOfMonth = toCollectionDate(endOfMonth);

            return convertedEndOfMonth;
        },
    },

    methods: {
        toDayDateMonth,

        convertMonth(month) {
            console.log(month);
        },

        selectDetailAbsen(numericDate) {
            this.$router.push("/absensi/semua/" + numericDate);
        },
    },

    watch: {
        selectedMonth: {
            immediate: true,
            async handler() {
                await this.$store.dispatch(
                    "attendances/getMonthlyAttendances",
                    {
                        startOfMonth: this.startOfMonth,
                        endOfMonth: this.endOfMonth,
                    }
                );
            },
        },
    },
};
</script>

<style></style>
