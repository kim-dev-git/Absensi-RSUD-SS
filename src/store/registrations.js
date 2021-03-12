import { db, serverTimestamp } from "../services/firebase";

const END_POINT = "registrations";
const ref = db.collection(END_POINT);

const state = {
    registrations: [],
    registration: null,
};

const getters = {};

const mutations = {
    SET_REGISTRATIONS: (state, data) => {
        state.registrations = data;
    },
    PUSH_REGISTRATIONS: (state, data) => {
        state.registrations = [data, ...state.registrations];
    },
    SET_REGISTRATION: (state, data) => {
        state.registration = data;
    },
};

const actions = {
    async get({ commit }, id = null) {
        try {
            if (id) {
                let query = await ref.doc(id).get();

                if (!query.exists) {
                    console.log("Data not found");
                    return;
                }

                let data = query.data();
                data.id = id;

                commit("SET_REGISTRATION", data);
            } else {
                let query = await ref.get();
                let docs = query.docs;
                let data = [];

                docs.map((doc) => {
                    var obj = doc.data();
                    obj.id = doc.id;
                    data.push(obj);
                });

                commit("SET_REGISTRATIONS", data);
            }
        } catch (err) {
            console.log(err);
        }
    },

    async post({ rootState, commit }, data) {
        try {
            let user = rootState.users.currentUser;

            data.createdByUID = user.uid;
            data.createdByDisplayName = user.displayName;
            data.createdByPhotoURL = user.photoURL;
            data.createdAt = serverTimestamp();
            data.alreadyUsed = false;
            data.lastPresentId = null;
            data.lastReturnId = null;

            let query = ref.add(data);

            await query.then((registration) => {
                data.id = registration.id;
                commit("PUSH_REGISTRATIONS", data);
            });
        } catch (err) {
            console.log(err);
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
