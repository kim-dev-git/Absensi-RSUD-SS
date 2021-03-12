import { db, serverTimestamp, auth, provider } from "../services/firebase";
import router from "../router";

const END_POINT = "users";
const ref = db.collection(END_POINT);

const state = {
    currentUser: null,
    registrationData: null,
};

const getters = {
    isAuthenticated(state) {
        let user = state.currentUser;
        let isAuthenticated = user !== null;

        return isAuthenticated;
    },
    isRegistering(state) {
        let registrationData = state.registrationData;
        let isRegistering = registrationData !== null;

        return isRegistering;
    },
    userRole(state) {
        let user = state.currentUser;
        let role = null;

        if (user.roles) {
            let length = user.roles.length;
            role = user.roles[length - 1];
        }

        return role;
    },
};

const mutations = {
    SET_CURRENT_USER: (state, user) => {
        state.currentUser = user;
    },
    CLEAR_CURRENT_USER: (state) => {
        state.currentUser = null;
        console.log("User signOut");
    },
    SET_REGISTRATION_DATA: (state, registrationData) => {
        state.registrationData = registrationData;
    },
    CLEAR_REGISTRATION_DATA: (state) => {
        state.registrationData = null;
    },
};

const actions = {
    async checkUserExists({ commit, dispatch, getters, state }, firebaseUser) {
        let userRef = ref.doc(firebaseUser.uid);

        // Set Loading

        let user = await userRef.get();

        if (user.exists) {
            let uid = user.id;
            dispatch("getUser", uid);
            // Set Loaded
        } else {
            let isUserNotRegistering = !getters.isRegistering;

            if (isUserNotRegistering) {
                console.log("User not found");
                dispatch("signOut");
                return;
            }

            let registrationData = state.registrationData;
            let newUser = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                email: firebaseUser.email,
                roles: registrationData.roles,
                registeredAt: serverTimestamp(),
            };

            await dispatch("registerUser", newUser);
        }
    },

    async getRegistration({ commit }, registrationId) {
        let registrationRef = db
            .collection("registrations")
            .doc(registrationId);

        let registrationQuery = await registrationRef.get();

        if (!registrationQuery.exists) {
            console.log("Registration not found");
            return;
        }

        let registrationData = registrationQuery.data();
        registrationData.id = registrationId;

        let isRegistrationAlreadyUsed = registrationData.alreadyUsed;

        if (isRegistrationAlreadyUsed) {
            console.log("Registration already used");
            return;
        }

        commit("SET_REGISTRATION_DATA", registrationData);
    },

    async getUser({ commit }, uid) {
        let userRef = ref.doc(uid);

        let user = await userRef.get();

        if (!user.exists) console.log("User not found!.");

        let userData = user.data();
        userData.uid = uid;

        commit("SET_CURRENT_USER", userData);
    },

    async registerUser({ commit, state }, newUser) {
        let { id: registrationId } = state.registrationData;

        newUser.registrationId = registrationId;

        let userRef = ref.doc(newUser.uid);
        let registrationRef = db
            .collection("registrations")
            .doc(registrationId);
        let registrationUpdate = {
            alreadyUsed: true,
            usedAt: serverTimestamp(),
            usedByUID: newUser.uid,
            usedByDisplayName: newUser.displayName,
            usedByPhotoURL: newUser.photoURL,
        };

        try {
            await userRef.set(newUser);
            await registrationRef.set(registrationUpdate, { merge: true });
            commit("SET_CURRENT_USER", newUser);
            commit("CLEAR_REGISTRATION_DATA");

            router.push("/");
        } catch (err) {
            console.log(err);
        }
    },

    async update({ state, dispatch }, updatedUser) {
        try {
            let { uid } = state.currentUser;
            let userRef = ref.doc(uid);

            await userRef.set(updatedUser, { merge: true });
            await dispatch("getUser", uid);
        } catch (err) {
            console.log(err);
        }
    },

    async authGoogle({ commit }) {
        // commit("SET_LOADING", "GET", { root: true });
        await auth
            .signInWithPopup(provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var firebaseUser = result.user;
                // commit("SET_LOADING", null, { root: true });
                // ...
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // this.errorMessage = errorMessage
                // The email of the user's account used.
                // var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // commit("SET_LOADING", null, { root: true });
                // ...
            });
    },

    async signOut({ commit }) {
        await auth.signOut();
        commit("CLEAR_CURRENT_USER");

        let currentPath = router.app._route.path;
        let destinationPath = "/masuk";

        if (currentPath !== destinationPath) router.push(destinationPath);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
