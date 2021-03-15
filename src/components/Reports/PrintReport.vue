<template>
    <div>
        <v-btn icon @click="printData">
            <v-icon v-text="'mdi-printer'" />
        </v-btn>
    </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
    props: {
        title: {
            type: String,
            default: "PKL - Absensi",
        },
        subtitle: String,
        headers: Array,
        items: Array,
    },

    data: () => ({
        //
    }),

    methods: {
        printData() {
            const doc = new jsPDF();

            doc.text(
                this.title,
                doc.internal.pageSize.width / 2,
                20,
                null,
                null,
                "center"
            );

            doc.autoTable({
                head: this.headers,
                body: this.items,
                startY: 30,
            });

            doc.save(`${this.title}.pdf`);
        },
    },
};
</script>

<style></style>
