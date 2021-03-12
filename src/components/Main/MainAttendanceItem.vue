<template>
    <v-list-item>
        <v-layout
            v-if="attendance && attendance.createdAt"
            class="align-center text--secondary"
        >
            <v-avatar size="24" class="mr-3">
                <v-img :src="attendance.photoURL" />
            </v-avatar>
            <span
                v-text="attendance.displayName"
                style="line-height: 1.2rem;"
                class="line-clamp"
            />

            <v-spacer />

            <span v-text="toTime(attendance.createdAt)" />
        </v-layout>
    </v-list-item>
</template>

<script>
import { toTime } from "../../filters/date";
export default {
    props: {
        attendance: Object,
    },

    methods: {
        toTime,
    },
};
</script>

<style></style>
