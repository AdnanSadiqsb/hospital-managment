import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Projects from "@/views/Projects.vue";
import Managers from "@/views/Managers.vue";
// import Tables from "@/views/Tables.vue";
// import Billing from "@/views/Billing.vue";
import VirtualReality from "@/views/VirtualReality.vue";
import Profile from "@/views/Profile.vue";
import Rtl from "@/views/Rtl.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import Workers from "@/views/Workers.vue";
import Doctors from "@/views/Doctors.vue";
import Patients from "@/views/Patients.vue";

const routes = [
  {
    path: "/",
    name: "/",
    component: SignIn,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    // path: "/tables",
    // name: "Tables",
    // component: Tables,

    path: "/projects",
    name: "Projects",
    component: Projects,
  },
  {
    // path: "/billing",
    // name: "Billing",
    // component: Billing,
    path: "/mangers",
    name: "Mangers",
    component: Managers,
  },
  {
    path: "/doctors",
    name: "Doctors",
    component: Doctors,
  },
  {
    path: "/patients",
    name: "Patients",
    component: Patients,
  },
  {
    // path: "/billing",
    // name: "Billing",
    // component: Billing,
    path: "/OPD",
    name: "OPD",
    component: Workers,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/rtl-page",
    name: "Rtl",
    component: Rtl,
  },
  {
    path: "/sign-in",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "Sign Up",
    component: SignUp,
  },
];

const router = createRouter({
  // eslint-disable-next-line no-undef
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
