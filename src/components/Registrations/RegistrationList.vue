<template>
    <div>
        <v-list>
            <template v-for="(registration, index) in registrations">
                <registration-item
                    :key="registration.id"
                    :registration="registration"
                />
                <v-divider :key="'divider-' + index" />
            </template>
        </v-list>
    </div>
</template>

<script>
import RegistrationItem from "./RegistrationItem.vue";
export default {
    components: { RegistrationItem },
    props: {
        registrations: Array,
    },

    data: () => ({
        //
    }),
};
</script>

<style></style>
