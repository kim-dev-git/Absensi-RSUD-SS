<template>
    <div>
        <navigation-bar title="Semua Absensi" />
        <layout-base>
            <all-calendar />
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
                    // this.getUserAttendances(this.user.uid);
                }
            },
        },
    },
};
</script>

<style></style>
