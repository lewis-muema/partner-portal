<template>
  <div>
    <div class="header">
      <div class="header-primary">
        <div class="primary-inner">
          <div class="inner-left">
            <img class="logo-icon" src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" @click="location.href = 'https://sendyit.com/'" />
          </div>
          <div class="inner-right">
            <div class="navitem">
              <div class="dropdown" @focus="toggleDropdown" @focusout="toggleDropUp" tabindex="-1">
                <span class="menu-head">
                  Menu
                  <i class="material-icons icon">arrow_drop_down</i>
                </span>
                <div class="dropdown-menu dropdown-menu-right" v-if="dropdown" @mouseover="timeout = 1000" @mouseleave="timeout = 0">
                  <router-link to="/vehicles" class="dropdown-link">
                    <p class="dropdown-item">Vehicles</p>
                  </router-link>
                  <router-link to="/tracking" class="dropdown-link">
                    <p class="dropdown-item">Tracking</p>
                  </router-link>
                  <router-link to="/statement" class="dropdown-link">
                    <p class="dropdown-item">Statement</p>
                  </router-link>
                  <router-link to="/banks" class="dropdown-link">
                    <p class="dropdown-item">Banks</p>
                  </router-link>
                  <router-link to="/loans" class="dropdown-link">
                    <p class="dropdown-item">Loans</p>
                  </router-link>
                  <router-link to="/savings" class="dropdown-link">
                    <p class="dropdown-item">Savings</p>
                  </router-link>
                  <router-link to="/documents" class="dropdown-link">
                    <p class="dropdown-item">Documents</p>
                  </router-link>

                  <router-link v-if="show_performance" to="/performance" class="dropdown-link">
                    <p class="dropdown-item">Performance</p>
                  </router-link>
                  <div @click="trainingRedirect()" class="dropdown-link">
                    <p class="dropdown-item">Support</p>
                  </div>
                  <hr />
                  <router-link to="/external_login" class="dropdown-link" v-if="super_user">
                    <p class="dropdown-item">Sign Out</p>
                  </router-link>
                  <router-link to="/login" class="dropdown-link" v-else>
                    <p class="dropdown-item">Sign Out</p>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-secondary" id="header-secondary" v-if="!showDocumentsPath">
        <div class="secondary-inner">
          <div class="secnav-container">
            <router-link to="/dashboard" class="secnav-page" :class="showActiveDashboard()">Dashboard</router-link>
            <router-link to="/" class="secnav-page" :class="showActivePending()">Available</router-link>
            <router-link to="/quotes" class="secnav-page" :class="showActiveQuotes()">My Quotes</router-link>
            <router-link to="/orders" class="secnav-page" :class="showActiveOrders()">My Orders</router-link>
          </div>
          <div class="secnav-container">
            <router-link to="/auxilliary" class="secnav-page" :class="showAuxilliaryServices()">Auxiliary Services</router-link>
          </div>
        </div>
      </div>
    </div>
    <surveyFooter v-if="this.nps_eligibility" />
  </div>
</template>
<script>
import axios from 'axios';
import surveyFooter from './footer.vue';

export default {
  components: {
    surveyFooter,
  },
  data() {
    return {
      dropdown: false,
      timeout: 0,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      performance_status: false,
      super_user: false,
      nps_eligibility: null,
      show_performance: false,
    };
  },
  computed: {
    showDocumentsPath() {
      let state = false;
      if (this.$route.path === '/documents') {
        state = true;
      }
      return state;
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.$store.commit('setSessionInfo', JSON.parse(localStorage.sessionData).payload);
      this.$store.commit('setOwnerId', JSON.parse(localStorage.sessionData).payload.id);
      this.fetchBikeDrivers();
      this.npsEligibility();
      this.super_user = JSON.parse(localStorage.sessionData).payload.super_user;
      this.checkPerformanceStatus();
    }
  },
  methods: {
    toggleDropUp() {
      setTimeout(() => {
        this.dropdown = false;
      }, this.timeout);
    },
    toggleDropdown() {
      this.dropdown = true;
    },
    toggle() {
      if (this.dropdown) {
        this.dropdown = false;
      } else {
        this.dropdown = true;
      }
    },
    showActiveDashboard() {
      if (this.$route.path === '/dashboard') {
        return 'active';
      }
    },
    showActivePending() {
      if (this.$route.path === '/') {
        return 'active';
      }
    },
    showActiveQuotes() {
      if (this.$route.path === '/quotes') {
        return 'active';
      }
    },
    showActiveOrders() {
      if (this.$route.path === '/orders') {
        return 'active';
      }
    },
    showAuxilliaryServices() {
      if (this.$route.path === '/auxilliary') {
        return 'active';
      }
    },
    trainingRedirect() {
      window.open('http://support.sendyit.com/collection/1-sendy-partner-training-manual', '_blank');
    },

    fetchBikeDrivers() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        owner_id: sessionInfo.id,
        vendor_type: 1,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
        .then(res => {
          this.performance_status = true;
          this.$store.commit('setBikeAvailability', true);
          this.$store.commit('setBikeRiders', res.data.riders);
        })
        .catch(error => {
          this.$store.commit('setBikeAvailability', false);
          this.$store.commit('setBikeRiders', []);
          this.performance_status = false;
        });
    },
    npsEligibility() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const userPayload = {
        respondent_type: 'owner',
        respondent_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.ADONIS_PRIVATE_API}nps/verify`, userPayload, this.config)
        .then(res => {
          this.nps_eligibility = res.data.valid;
        })
        .catch(error => error);
    },
    checkPerformanceStatus() {
      this.show_performance = false;
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const userPayload = {
        owner_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/performance_status`, userPayload, this.config)
        .then(res => {
          this.show_performance = res.data.performance_status;
        })
        .catch(error => error);
    },
  },
};
</script>

<style></style>
