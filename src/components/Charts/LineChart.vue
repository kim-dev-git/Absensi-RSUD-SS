<template>
    <div>
        <v-layout column class="pr-4 py-4 mb-4 white shadow">
            <apexchart
                width="100%"
                type="line"
                :options="categories"
                :series="series"
            />
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
};
</script>

<style></style>
