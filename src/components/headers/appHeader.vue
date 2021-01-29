<template>
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="header">
      <div class="header-primary">
        <div class="primary-inner">
          <div class="inner-left">
            <img class="logo-icon" src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" @click="location.href = 'https://sendyit.com/'" />
            <div class="inner-left-toggles" v-if="$store.getters.getFreightStatus === 2">
              <span class="inner-left-toggle-links" :class="getFlow === 'logistics' ? 'inner-left-toggle-links-active' : 'inner-left-toggle-links-inactive'" @click="setFlow('logistics')">TRANSPORTATION</span>
              <span class="inner-left-toggle-links" :class="getFlow === 'freight' ? 'inner-left-toggle-links-active' : 'inner-left-toggle-links-inactive'" @click="setFlow('freight')">FREIGHT</span>
            </div>
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
      <div class="header-secondary" id="header-secondary" v-if="!showDocumentsPath && getFlow === 'logistics'">
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
      <div class="header-secondary header-secondary-freight" id="header-secondary" v-if="getFlow === 'freight'">
        <div class="secondary-inner">
          <div class="secnav-container">
            <router-link to="/freight/dashboard" class="secnav-page" :class="showActiveFreightDashboard()">Activity Log</router-link>
            <router-link to="/freight/orders" class="secnav-page" :class="showActiveFreightOrders()">Orders</router-link>
            <router-link to="/freight/preferences" class="secnav-page" :class="showActiveFreightPreferences()">Preferences</router-link>
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
import errorHandler from '../errorHandler';

export default {
  components: {
    surveyFooter,
    errorHandler,
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
      errorObj: '',
      flow: 'logistics',
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
    getFlow() {
      return this.$store.getters.getFlow;
    },
  },
  watch: {
    $route(to, from) {
      this.checkFlow(to.path);
    },
    getFlow(val) {
      this.routeFlow(val);
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.$store.commit('setSessionInfo', JSON.parse(localStorage.sessionData).payload);
      this.$store.commit('setOwnerId', JSON.parse(localStorage.sessionData).payload.id);
      this.getFreightStatus();
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
    checkFlow(route) {
      if (route.includes('freight') && this.$store.getters.getFreightStatus === 2) {
        this.setFlow('freight');
      } else {
        this.setFlow('logistics');
      }
    },
    routeFlow(val) {
      if (val === 'logistics') {
        if (this.$route.path.includes('freight')) {
          this.$router.push({ path: '/' });
        }
      } else {
        if (!this.$route.path.includes('freight')) {
          this.$router.push({ path: '/freight/orders' });
        }
      }
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
    showActiveFreightDashboard() {
      if (this.$route.path === '/freight/dashboard') {
        return 'active';
      }
    },
    showActiveFreightOrders() {
      if (this.$route.path.includes('/freight/orders')) {
        return 'active';
      }
    },
    showActiveFreightPreferences() {
      if (this.$route.path === '/freight/preferences') {
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
          this.errorObj = error.response;
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
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    getFreightStatus() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      return new Promise((resolve, reject) => {
        axios
            .get(`${process.env.ADONIS_PARTNER_API}parcel/owner/freight-status/${sessionInfo.id}`, this.config)
            .then(response => {
              this.$store.commit('setFreightStatus', response.data.freightStatus);
              this.checkFlow(this.$route.path);
              this.routeFlow(this.getFlow);
            resolve(response);
            })
            .catch(error => {
              this.$store.commit('setFreightStatus', '');
              this.errorObj = error.response;
            resolve(error);
            });
        });
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
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    setFlow(value) {
      this.$store.commit('setFlow', value);
    },
  },
};
</script>

<style></style>
