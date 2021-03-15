<template>
    <div>
        <registration-button-add @click="addRegistration()" />

        <layout-base>
            <registration-list :registrations="registrations" />
        </layout-base>

        <dialog-sheet v-model="showDialogAdd" title="Pendaftaran Baru">
            <v-layout column class="pa-3">
                <span v-text="'Role Pegawai'" class="mb-3" />
                <v-layout wrap>
                    <template v-for="role in registrationRoles">
                        <v-btn
                            :key="role.text"
                            rounded
                            depressed
                            small
                            class="mr-3 mb-3"
                            color="black"
                            v-text="role.text"
                            :outlined="!buttonActive(role, 'selectedRole')"
                            :dark="buttonActive(role, 'selectedRole')"
                            @click="selectRole(role)"
                        />
                    </template>
                </v-layout>
            </v-layout>

            <v-layout v-if="isEmployee" column class="pa-3">
                <span v-text="'Status Pegawai'" class="mb-3" />
                <v-layout wrap>
                    <template v-for="status in registrationStatus">
                        <v-btn
                            :key="status"
                            rounded
                            depressed
                            small
                            v-text="status"
                            :outlined="!buttonActive(status, 'selectedStatus')"
                            :dark="buttonActive(status, 'selectedStatus')"
                            class="mr-3 mb-3"
                            color="black"
                            @click="selectStatus(status)"
                        />
                    </template>
                </v-layout>
            </v-layout>

            <v-btn
                tile
                large
                block
                color="primary"
                :disabled="disableButton"
                :dark="!disableButton"
                @click="createRegistration()"
            >
                <span v-text="'Buat Pendaftaran Baru'" />
            </v-btn>
        </dialog-sheet>
    </div>
</template>

<script>
import DialogSheet from "../../components/Others/DialogSheet.vue";
import LayoutBase from "../../components/Others/LayoutBase.vue";
import RegistrationButtonAdd from "../../components/Registrations/RegistrationButtonAdd.vue";
import RegistrationList from "../../components/Registrations/RegistrationList.vue";
export default {
    components: {
        LayoutBase,
        DialogSheet,
        RegistrationList,
        RegistrationButtonAdd,
    },

    data: () => ({
        showDialogAdd: false,
        selectedStatus: null,
        selectedRole: null,
        registrationStatus: ["PNS", "Kontrak", "PKWT"],
        registrationRoles: [
            { text: "Pegawai", value: ["Pegawai"] },
            {
                text: "Kepala Kepegawaian",
                value: ["Pegawai", "Kepala Kepegawaian"],
            },
            { text: "QR Generator", value: ["QR Generator"] },
        ],
    }),

    computed: {
        registrations() {
            return this.$store.state.registrations.registrations;
        },
        disableButton() {
            let isDisabled = false;
            let isEmployee = this.isEmployee;

            if (isEmployee) {
                isDisabled =
                    this.selectedStatus === null || this.selectedRole === null;
            } else {
                isDisabled = this.selectedRole === null;
            }

            return isDisabled;
        },
        isEmployee() {
            let selectedRole = this.selectedRole;

            if (!selectedRole) return false;

            let isEmployee = selectedRole.text === "Pegawai";

            return isEmployee;
        },
    },

    methods: {
        addRegistration() {
            this.showDialogAdd = true;
        },

        buttonActive(status, selectedData) {
            let selected = this[selectedData];
            let isButtonActive = selected === status;

            return isButtonActive;
        },

        selectRole(role) {
            this.selectedRole = role;
            this.selectedStatus = null;
        },

        selectStatus(status) {
            this.selectedStatus = status;
        },

        async createRegistration() {
            if (this.selectedRole.value == ["Pegawai", "Kepala Kepegawaian"])
                this.selectedStatus = "PNS";

            let data = {
                roles: this.selectedRole.value,
                status: this.selectedStatus,
            };

            await this.$store.dispatch("registrations/post", data);

            this.selectedRole = null;
            this.selectedStatus = null;
            this.showDialogAdd = false;
        },
    },

    mounted() {
        this.$store.dispatch("registrations/get");
    },
};
</script>

<style></style>
