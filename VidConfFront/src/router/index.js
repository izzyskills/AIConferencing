import { createRouter, createWebHistory } from "vue-router";
import SignupView from "../views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import AboutView from "@/views/AboutView.vue";
import DashboardView from "@/views/DashboardView.vue";
import LandingView from "@/views/LandingView.vue";
import NotFound from "@/views/NotFound.vue";
import { useAuth } from "@/composables/useauth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
    },
    {
      path: "/dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth();
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isLoggedIn.value
  ) {
    next({
      name: "login",
      query: { from: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
