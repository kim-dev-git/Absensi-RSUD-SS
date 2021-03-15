<template>
    <div>
        <navigation-bar
            :title="`Absensi ${toDayDateMonth(id)}`"
            :backButton="true"
        >
            <print-report
                :title="reportTitle"
                :items="detailAttendancesToItems"
                :headers="headers"
            />
        </navigation-bar>
        <layout-base>
            <line-chart
                :categories="detailAttendancesToChartCategory"
                :series="detailAttendancesToChartData"
            />

            <v-layout column class="py-0 white shadow">
                <v-list class="py-0">
                    <v-list-item
                        v-for="(attendance, index) in detailAttendances"
                        :key="index"
                        class="py-3"
                    >
                        <v-layout class="align-start">
                            <v-avatar size="48">
                                <v-img :src="attendance.photoURL" />
                            </v-avatar>

                            <v-layout column class="ml-3">
                                <v-layout class="align-center">
                                    <span
                                        v-text="attendance.displayName"
                                        class="font-weight-medium"
                                    />
                                    <span
                                        v-text="'•'"
                                        class="mx-1 text--secondary"
                                    />
                                    <span
                                        v-text="
                                            `${toDifferHour(
                                                attendance.presentAt,
                                                attendance.returnAt
                                            )} jam bekerja`
                                        "
                                        class="text--secondary caption"
                                    />
                                </v-layout>
                                <v-layout class="text--secondary">
                                    <span
                                        v-text="toTime(attendance.presentAt)"
                                    />
                                    <span v-text="'-'" class="mx-1" />
                                    <span
                                        v-text="toTime(attendance.returnAt)"
                                    />
                                </v-layout>
                            </v-layout>
                        </v-layout>
                    </v-list-item>
                </v-list>
            </v-layout>
        </layout-base>
    </div>
</template>

<script>
import {
    toTime,
    toDayDateMonth,
    toDifferHour,
    toReverseNormalDate,
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

    props: {
        id: String,
    },

    data: () => ({
        headers: [["Nama", "Masuk", "Keluar", "Jam Kerja"]],
    }),

    computed: {
        detailAttendances() {
            return this.$store.getters["attendances/filteredDetailAttendances"];
        },

        sortedAttendances() {
            let attendances = this.detailAttendances;
            let sortedAttendances = attendances.sort((a, b) => {
                return a.workingHour - b.workingHour;
            });

            return sortedAttendances;
        },

        detailAttendancesToChartData() {
            let attendances = this.sortedAttendances;
            let series = [{ name: "Jumlah Hadir", data: [] }];
            let yaxis = {};

            if (!attendances.length) return series;
            let serieData = [];

            attendances.map((attendance) => {
                let key = attendance.workingHour;
                let keyExist = yaxis[key] !== undefined;

                if (keyExist) yaxis[key]++;
                else yaxis[key] = 1;
            });

            for (const [key, value] of Object.entries(yaxis)) {
                serieData.push(value);
            }

            series[0].data = serieData;

            return series;
        },

        detailAttendancesToChartCategory() {
            let attendances = this.sortedAttendances;
            let options = {
                chart: {
                    id: `Absensi ${toReverseNormalDate(this.id)}`,
                },
                xaxis: {
                    categories: [],
                },
            };

            if (!attendances.length) return options;
            let categories = [];

            attendances.map((attendance) => {
                let category = this.toDifferHour(
                    attendance.presentAt,
                    attendance.returnAt
                );

                categories.push(category + " jam");
            });

            options.xaxis.categories = categories;

            return options;
        },

        reportTitle() {
            let reportTitle = `Laporan Absensi ${toDayDateMonth(this.id)}`;

            return reportTitle;
        },

        detailAttendancesToItems() {
            let items = [];
            let attendances = this.detailAttendances;

            attendances.map((attendance) => {
                let { displayName } = attendance;
                let presentAt = toTime(attendance.presentAt);
                let returnAt = toTime(attendance.returnAt);
                let workingHour = attendance.workingHour;
                let data = [displayName, presentAt, returnAt, workingHour];

                items.push(data);
            });

            return items;
        },
    },

    methods: {
        toTime,
        toDayDateMonth,
        toDifferHour,

        differHour(attendance) {
            let differHour = toDifferHour(
                attendance.presentAt,
                attendance.returnAt
            );

            return differHour;
        },
    },

    async mounted() {
        this.$store.dispatch("attendances/getDetailAttendances", this.id);
    },
};
</script>

<style></style>
