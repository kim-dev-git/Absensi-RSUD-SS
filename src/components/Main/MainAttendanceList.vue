<template>
    <v-col cols="12" sm="6" lg="4">
        <v-card class="shadow">
            <v-layout column class="align-center py-4" :class="color">
                <span v-text="title" class="white--text" />
            </v-layout>
            <v-list>
                <main-attendance-item
                    v-for="attendance in attendances"
                    :key="attendance.id"
                    :attendance="attendance"
                />
            </v-list>
        </v-card>
    </v-col>
</template>

<script>
import MainAttendanceItem from "./MainAttendanceItem.vue";
export default {
    components: { MainAttendanceItem },
    props: {
        title: String,
        attendances: Array,
        color: {
            type: String,
            default: "grey",
        },
    },
};
</script>

<style></style>
