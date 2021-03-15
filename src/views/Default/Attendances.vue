<template>
    <div>
        <navigation-bar title="Absensi Saya">
            <print-report
                :title="reportTitle"
                :items="userAttendancesToItems"
                :headers="headers"
            />
        </navigation-bar>
        <layout-base>
            <v-layout column>
                <v-layout class="py-4 align-center white">
                    <span v-text="'Bulan'" class="ml-4 font-weight-medium" />

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

                <line-chart
                    :series="userAttendancesToChartData"
                    :categories="userAttendancesToChartCategory"
                />

                <v-layout column class="white shadow">
                    <template v-for="(attendance, index) in userAttendances">
                        <v-divider
                            v-if="index === 0"
                            :key="'divider-' + index"
                        />

                        <v-layout
                            :key="attendance.id"
                            class="pa-4 align-center"
                        >
                            <span
                                v-text="toDayDateMonth(attendance.returnAt)"
                            />

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
                                <span
                                    v-text="'-'"
                                    class="mx-2 text--secondary"
                                />
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

                                <span
                                    v-if="attendance.returnAt"
                                    v-text="
                                        `(${toDifferHour(
                                            attendance.presentAt,
                                            attendance.returnAt
                                        )} jam)`
                                    "
                                    class="ml-2 text--secondary"
                                />
                            </v-layout>
                        </v-layout>

                        <v-divider :key="'divider-' + attendance.id" />
                    </template>
                </v-layout>
            </v-layout>
        </layout-base>
    </div>
</template>

<script>
import {
    toTime,
    toDayDateMonth,
    toDifferHour,
    toNormalDate,
    toCollectionDate,
} from "../../filters/date";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
import LineChart from "../../components/Charts/LineChart.vue";
import PrintReport from "../../components/Reports/PrintReport.vue";
export default {
    components: {
        LayoutBase,
        NavigationBar,
        LineChart,
        PrintReport,
    },

    data: () => ({
        selectedMonth: new Date().toISOString().slice(0, 7),
        headers: [["Tanggal", "Masuk", "Keluar", "Jam Kerja"]],
    }),

    computed: {
        user() {
            return this.$store.state.users.currentUser;
        },
        userAttendances() {
            return this.$store.state.attendances.userAttendances;
        },

        userAttendancesToChartData() {
            let attendances = this.userAttendances;
            let series = [{ name: "Jam Kerja", data: [] }];

            if (!attendances.length) return series;
            let serieData = [];

            attendances.map((attendance) => {
                let data = this.toDifferHour(
                    attendance.presentAt,
                    attendance.returnAt
                );

                serieData.push(data);
            });

            series[0].data = serieData;

            return series;
        },

        userAttendancesToChartCategory() {
            let attendances = this.userAttendances;
            let options = {
                chart: {
                    id: "UserAttendancesChart",
                },
                xaxis: {
                    categories: [],
                },
            };

            if (!attendances.length) return options;
            let categories = [];

            attendances.map((attendance) => {
                let category = this.numericDateToDayNumber(
                    attendance.numericDate
                );

                categories.push(category);
            });

            options.xaxis.categories = categories;

            return options;
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

        userAttendancesToItems() {
            let items = [];
            let attendances = this.userAttendances;

            attendances.map((attendance) => {
                let date = toDayDateMonth(String(attendance.numericDate));
                let presentAt = toTime(attendance.presentAt);
                let returnAt = toTime(attendance.returnAt);
                let workingHour = toDifferHour(
                    attendance.presentAt,
                    attendance.returnAt
                );
                let data = [date, presentAt, returnAt, workingHour];

                items.push(data);
            });

            return items;
        },

        reportTitle() {
            let { displayName } = this.user || "";
            let yearMonth = this.selectedMonth;

            let reportTitle = `Laporan Absensi - ${displayName} (${yearMonth})`;

            return reportTitle;
        },
    },

    methods: {
        toTime,
        toDayDateMonth,
        toDifferHour,
        toNormalDate,
        toCollectionDate,
        async getUserAttendances(uid) {
            if (!uid) return;

            await this.$store.dispatch("attendances/getUserAttendances", uid);
        },

        numericDateToDayNumber(numericDate) {
            let numericDateToDayString = String(numericDate).slice(6, 8);
            let numericDateToDayNumber = Number(numericDateToDayString);

            return numericDateToDayNumber;
        },
    },

    watch: {
        user: {
            immediate: true,
            async handler(user) {
                let isAttendancesExists = this.userAttendances.length;
                if (user && !isAttendancesExists) {
                    await this.$store.dispatch(
                        "attendances/getUserAttendances",
                        {
                            startOfMonth: this.startOfMonth,
                            endOfMonth: this.endOfMonth,
                            uid: user.uid,
                        }
                    );
                }
            },
        },

        selectedMonth: {
            immediate: true,
            async handler() {
                let user = this.user;

                if (user && user.uid) {
                    await this.$store.dispatch(
                        "attendances/getUserAttendances",
                        {
                            startOfMonth: this.startOfMonth,
                            endOfMonth: this.endOfMonth,
                            uid: user.uid,
                        }
                    );
                }
            },
        },
    },
};
</script>

<style></style>
