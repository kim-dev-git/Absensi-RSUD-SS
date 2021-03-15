<template>
    <div>
        <navigation-bar title="Semua Absen">
            <print-report
                :title="reportTitle"
                :items="monthlyAttendancesToItems"
                :headers="headers"
            />
        </navigation-bar>

        <layout-base>
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
                :categories="monthlyAttendancesToChartCategory"
                :series="monthlyAttendancesToChartData"
            />

            <v-layout column class="white shadow">
                <template v-for="data in monthlyAttendances">
                    <div :key="data.id">
                        <v-card flat>
                            <v-layout column class="px-4 py-2">
                                <span
                                    v-text="
                                        toDayDateMonth(String(data.numericDate))
                                    "
                                    class="font-weight-medium"
                                />

                                <v-layout class="align-center">
                                    <v-icon v-text="'mdi-account-check'" />
                                    <span
                                        v-text="
                                            data.returns
                                                ? data.returns.length
                                                : '-'
                                        "
                                        class="mx-1 font-weight-bold"
                                    />
                                    <span
                                        v-text="'hadir'"
                                        class="mr-4 text--secondary"
                                    />
                                    <!-- <v-icon v-text="'mdi-account-cancel'" />
                            <span
                                v-text="
                                    data.absences ? data.absences.length : '-'
                                "
                                class="mx-1 font-weight-bold"
                            /> -->

                                    <v-spacer />

                                    <v-btn
                                        text
                                        color="primary"
                                        class="mr-n4"
                                        @click="
                                            selectDetailAbsen(data.numericDate)
                                        "
                                    >
                                        <span
                                            v-text="'Detail'"
                                            class="text-none"
                                        />
                                        <v-icon v-text="'mdi-chevron-down'" />
                                    </v-btn>
                                </v-layout>
                            </v-layout>
                        </v-card>
                    </div>
                </template>
            </v-layout>
        </layout-base>
    </div>
</template>

<script>
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
import { toDayDateMonth, toCollectionDate } from "../../filters/date";
import LineChart from "../../components/Charts/LineChart.vue";
import PrintReport from "../../components/Reports/PrintReport.vue";
export default {
    components: { LayoutBase, NavigationBar, LineChart, PrintReport },

    data: () => ({
        selectedMonth: new Date().toISOString().slice(0, 7),
        headers: [["Tanggal", "Hadir"]],
    }),

    computed: {
        months() {
            const months = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];

            return months;
        },

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

        monthlyAttendancesToChartData() {
            let attendances = this.monthlyAttendances;
            let series = [{ name: "Hadir", data: [] }];

            if (!attendances.length) return series;
            let serieName = this.numericDateToMonth(attendances[0].numericDate);
            let serieData = [];

            attendances.map((attendance) => {
                let data = attendance.presents.length;
                serieData.push(data);
            });

            // series[0].name = serieName;
            series[0].data = serieData;

            return series;
        },

        monthlyAttendancesToChartCategory() {
            let attendances = this.monthlyAttendances;
            let options = {
                chart: {
                    id: "MonthlyAttendancesChart",
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

        reportTitle() {
            let yearMonth = this.selectedMonth;

            let reportTitle = `Laporan Absensi Bulanan (${yearMonth})`;

            return reportTitle;
        },

        monthlyAttendancesToItems() {
            let items = [];
            let attendances = this.monthlyAttendances;

            attendances.map((attendance) => {
                let date = toDayDateMonth(String(attendance.numericDate));
                let returns = attendance.returns.length;
                let data = [date, returns];

                items.push(data);
            });

            return items;
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

        numericDateToMonth(numericDate) {
            let numericMonth = String(numericDate).slice(4, 6);
            numericMonth = Number(numericMonth) - 1;

            return this.months[numericMonth];
        },

        numericDateToDayNumber(numericDate) {
            let numericDateToDayString = String(numericDate).slice(6, 8);
            let numericDateToDayNumber = Number(numericDateToDayString);

            return numericDateToDayNumber;
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
