<template>
  <div>
    <div
      class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
      id="sidenav-collapse-main"
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <sidenav-collapse navText="Doctors" :to="{ name: 'Doctors' }">
            <template #icon>
              <office />
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item">
          <sidenav-collapse navText="Patients" :to="{ name: 'Patients' }">
            <template #icon>
              <credit-card />
            </template>
          </sidenav-collapse>
        </li>

        <li class="nav-item">
          <sidenav-collapse navText="OPD" :to="{ name: 'OPD' }">
            <template #icon>
              <credit-card />
            </template>
          </sidenav-collapse>
        </li>

        <li class="nav-item">
          <sidenav-collapse navText="Tests" :to="{ name: 'Tests' }">
            <template #icon>
              <box3d />
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item">
          <sidenav-collapse
            navText="Lab Invoices"
            :to="{ name: 'lab-invoices' }"
          >
            <template #icon>
              <settings />
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item">
          <sidenav-collapse
            navText="Generate Reports"
            :to="{ name: 'Reports' }"
          >
            <template #icon>
              <settings />
            </template>
          </sidenav-collapse>
        </li>
        <!-- <li class="mt-3 nav-item">
          <h6
            class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
            :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'"
          >
            PAGES
          </h6>
        </li> -->
        <!-- <li class="nav-item">
          <sidenav-collapse navText="Profile" :to="{ name: 'Profile' }">
            <template #icon>
              <customer-support />
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item">
          <sidenav-collapse navText="Sign In" :to="{ name: 'Sign In' }">
            <template #icon>
              <document />
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item">
          <sidenav-collapse navText="Sign Up" :to="{ name: 'Sign Up' }">
            <template #icon>
              <spaceship />
            </template>
          </sidenav-collapse>
        </li> -->
        <li class="nav-item">
          <div @click="handleLogout" class="nav-link" v-bind="$attrs">
            <div
              class="text-center bg-white shadow icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center"
              :class="this.$store.state.isRTL ? ' ms-2' : 'me-2'"
            >
              <template>
                <spaceship />
              </template>
            </div>
            <span
              class="nav-link-text"
              :class="this.$store.state.isRTL ? ' me-1' : 'ms-1'"
              >Logout</span
            >
          </div>
        </li>
      </ul>
    </div>
    <!-- <div class="pt-3 mx-3 mt-3 sidenav-footer">
      <sidenav-card
        :class="cardBg"
        textPrimary="Need Help?"
        textSecondary="Please check our docs"
        route="https://www.creative-tim.com/learning-lab/vue/overview/soft-ui-dashboard/"
        label="Documentation"
        icon="ni ni-diamond"
      />
      <a
        class="btn bg-gradient-success mt-4 w-100"
        href="https://www.creative-tim.com/product/vue-soft-ui-dashboard-pro?ref=vsud"
        type="button"
        >Upgrade to pro</a
      >
    </div> -->
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
// import SidenavCard from "./SidenavCard.vue";
// import Shop from "../../components/Icon/Shop.vue";
import Office from "../../components/Icon/Office.vue";
import CreditCard from "../../components/Icon/CreditCard.vue";
// import Box3d from "../../components/Icon/Box3d.vue";
import CustomerSupport from "../../components/Icon/CustomerSupport.vue";
import Document from "../../components/Icon/Document.vue";
import Spaceship from "../../components/Icon/Spaceship.vue";
// import Settings from "../../components/Icon/Settings.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
  },
  data() {
    return {
      title: "Soft UI Dashboard PRO",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  components: {
    SidenavCollapse,
    // SidenavCard,
    // Shop,
    Office,
    CreditCard,
    // Box3d,
    // CustomerSupport,
    // Document,
    Spaceship,
    // Settings,
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    handleLogout() {
      this.$store.commit("logout");
      this.$router.push("/");
      this.$notify({
        type: "error",
        title: "Logged out!",
        text: "Thanks for working with use!",
      });
    },
  },
};
</script>
