import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "../services/firebase";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Default",
        component: () => import("../layouts/Default.vue"),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "",
                name: "Main",
                component: () => import("../views/Default/Main.vue"),
            },
            {
                path: "register",
                name: "Registrations",
                component: () => import("../views/Default/Registrations.vue"),
            },
            {
                path: "absensi",
                name: "Attendances",
                component: () => import("../views/Default/Attendances.vue"),
            },
            {
                path: "absensi/semua",
                name: "AttendancesAll",
                component: () => import("../views/Default/AttendancesAll.vue"),
            },
            {
                path: "absensi/semua/:id",
                name: "AttendancesAllDetail",
                props: true,
                component: () =>
                    import("../views/Default/AttendancesAllDetail.vue"),
            },
            {
                path: "profil",
                name: "Profil",
                component: () => import("../views/Default/Profile.vue"),
            },
        ],
    },
    {
        path: "/masuk",
        name: "SignIn",
        component: () => import("../views/SignIn.vue"),
    },
    {
        path: "/daftar/:id",
        name: "SignUp",
        props: true,
        component: () => import("../views/SignUp.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import("../views/About.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
    const isLoginRoute = to.path === "/masuk";
    if (requiresAuth && !auth.currentUser) {
        next("/masuk");
    } else if (auth.currentUser && isLoginRoute) {
        next("/");
    } else {
        next();
    }
});

export default router;
