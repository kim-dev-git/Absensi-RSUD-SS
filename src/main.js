import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth } from "./services/firebase";

Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged(async (firebaseCache) => {
    if (firebaseCache) {
        const firebaseUser = {
            uid: firebaseCache.uid,
            displayName: firebaseCache.displayName,
            photoURL: firebaseCache.photoURL,
            email: firebaseCache.email,
        };
        await store.dispatch("users/checkUserExists", firebaseUser);
    }

    if (!app) {
        app = new Vue({
            router,
            store,
            vuetify,
            render: (h) => h(App),
        }).$mount("#app");
    }
});
