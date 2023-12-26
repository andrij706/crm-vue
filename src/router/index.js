import { createRouter, createWebHistory } from "vue-router";
import EmptyLayout from "../components/layouts/EmptyLayout.vue";
import MainLayout from "../components/layouts/MainLayout.vue";
import {auth} from '../firebase/firebaseInit'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/categories",
      name: "categories",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/Categories.vue"),
    },
    {
      path: "/detail/:id",
      name: "detail",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/DetailRecord.vue"),
    },
    {
      path: "/history",
      name: "history",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/History.vue"),
    },
    {
      path: "/planning",
      name: "planning",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/Planning.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/Profile.vue"),
    },
    {
      path: "/record",
      name: "record",
      meta: { layout: MainLayout, auth: true },
      component: () => import("../views/Record.vue"),
    },
    {
      path: "/register",
      name: "register",
      meta: { layout: EmptyLayout },
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: { layout: EmptyLayout },
      component: () => import("../views/Login.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser
  const requireAuth = to.matched.some(record => record.meta.auth)

  if(requireAuth && !currentUser) {
    next('/login?message=login')
  } else {
    next()
  }
});

export default router;
