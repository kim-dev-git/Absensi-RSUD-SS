<template>
    <div>
        <navigation-bar title="Pegawai">
            <print-report
                :title="reportTitle"
                :headers="headers"
                :items="employeesToItems"
            />
        </navigation-bar>

        <layout-base>
            <v-layout class="py-4 align-center white">
                <span
                    v-text="'Status Pegawai'"
                    class="ml-4 font-weight-medium"
                />

                <v-spacer />

                <v-combobox
                    v-model="selectedEmployeeStatus"
                    :items="['Semua', 'PNS', 'PKWT', 'Kontrak']"
                    solo
                    dense
                    flat
                    background-color="grey lighten-3"
                    class="mx-4 mb-n7"
                />
            </v-layout>

            <v-layout column class="py-0 white shadow">
                <v-list class="py-0">
                    <v-list-item
                        v-for="(employee, index) in filteredEmployees"
                        :key="index"
                        class="py-3"
                    >
                        <v-layout class="align-start">
                            <v-avatar size="48">
                                <v-img :src="employee.photoURL" />
                            </v-avatar>

                            <v-layout column class="ml-3">
                                <v-layout class="align-center">
                                    <span
                                        v-text="employee.displayName"
                                        class="font-weight-medium"
                                    />
                                    <span
                                        v-text="'•'"
                                        class="mx-1 text--secondary"
                                    />
                                    <span
                                        v-text="employee.employeeStatus"
                                        class="text--secondary caption"
                                    />
                                </v-layout>
                                <v-layout class="text--secondary">
                                    <span v-text="employeeRole(employee)" />

                                    <!-- <span v-text="toTime(employee.presentAt)" />
                                    <span v-text="'-'" class="mx-1" />
                                    <span v-text="toTime(employee.returnAt)" /> -->
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
import LayoutBase from "../../components/Others/LayoutBase.vue";
import NavigationBar from "../../components/Others/NavigationBar.vue";
import PrintReport from "../../components/Reports/PrintReport.vue";
export default {
    components: { NavigationBar, PrintReport, LayoutBase },

    data: () => ({
        selectedEmployeeStatus: "Semua",
        headers: [["Nama", "Role", "Status Pegawai"]],
    }),

    computed: {
        employees() {
            return this.$store.getters["users/employeesSortedByName"];
        },

        filteredEmployees() {
            let employees = this.employees;
            let filter = this.selectedEmployeeStatus;

            if (filter === "Semua") return employees;

            let filteredEmployees = employees.filter((employee) => {
                return employee.employeeStatus == filter;
            });

            return filteredEmployees;
        },

        reportTitle() {
            let status = this.selectedEmployeeStatus;

            let reportTitle = `List Pegawai - ${status}`;

            return reportTitle;
        },

        employeesToItems() {
            let items = [];
            let employees = this.filteredEmployees;

            employees.map((employee) => {
                const { displayName, employeeStatus } = employee;
                let role = this.employeeRole(employee);
                let data = [displayName, role, employeeStatus];

                items.push(data);
            });

            return items;
        },
    },

    methods: {
        employeeRole(employee) {
            let roles = employee.roles;
            let length = roles.length;

            let employeeRole = roles[length - 1];

            return employeeRole;
        },
    },

    mounted() {
        this.$store.dispatch("users/getEmployees");
    },
};
</script>

<style></style>
