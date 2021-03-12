import Vue from "vue";
import Vuex from "vuex";

import users from "./users";
import registrations from "./registrations";
import attendances from "./attendances";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        registrations,
        attendances,
    },
    state: {},
    mutations: {},
    actions: {},
});
