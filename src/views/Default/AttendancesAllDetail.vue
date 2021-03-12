<template>
    <div>
        <navigation-bar
            :title="`Absensi ${toDayDateMonth(id)}`"
            :backButton="true"
        >
            <v-btn icon>
                <v-icon v-text="'mdi-printer'" />
            </v-btn>
        </navigation-bar>
        <layout-base>
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
                                <span
                                    v-text="attendance.displayName"
                                    class="font-weight-medium"
                                />
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
import { toTime, toDayDateMonth } from "../../filters/date";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
import AllCalendar from "../../components/Attendances/AllCalendar.vue";
export default {
    components: { LayoutBase, NavigationBar, AllCalendar },

    props: {
        id: String,
    },

    data: () => ({
        //
    }),

    computed: {
        detailAttendances() {
            return this.$store.getters["attendances/filteredDetailAttendances"];
        },
    },

    methods: {
        toTime,

        toDayDateMonth,
    },

    async mounted() {
        this.$store.dispatch("attendances/getDetailAttendances", this.id);
    },
};
</script>

<style></style>
