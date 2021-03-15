<template>
    <div>
        <v-layout column class="pr-4 py-4 mb-4 white shadow">
            <div :style="isMobile ? 'max-width: 100%' : 'max-width: 600px'">
                <apexchart
                    width="100%"
                    type="line"
                    :options="categories"
                    :series="series"
                />
            </div>
        </v-layout>
    </div>
</template>

<script>
import apexchart from "vue-apexcharts";
export default {
    components: {
        apexchart,
    },

    props: {
        categories: Object,
        series: Array,
    },

    computed: {
        isMobile() {
            let isMobile = this.$vuetify.breakpoint.xs;

            return isMobile;
        },
    },
};
</script>

<style></style>
