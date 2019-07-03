<template>
  <div>
    <div class="header-primary">
      <div class="primary-inner">
        <div class="inner-left">
          <img
            class="icon"
            src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png"
            @click="location.href='https://sendyit.com/';"
          >
        </div>
        <div class="inner-right">
          <div class="navitem">
            <div class="dropdown" @focus="toggleDropdown" @focusout="toggleDropUp" tabindex="-1">
              <span class="menu-head">
                Menu
                <i class="material-icons icon">arrow_drop_down</i>
              </span>
              <div
                class="dropdown-menu dropdown-menu-right"
                v-if="dropdown"
                @mouseover="timeout = 1000"
                @mouseleave="timeout = 0"
              >
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

                <router-link to="/pending" class="dropdown-link">
                  <p
                    class="dropdown-item"
                    href="http://support.sendyit.com/collection/1-sendy-partner-training-manual"
                  >Support</p>
                </router-link>
                <hr>
                <router-link to="/" class="dropdown-link">
                  <p class="dropdown-item">Sign Out</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="header-secondary" id="header-secondary">
      <div class="secondary-inner">
        <div class="secnav-container">
          <router-link to="/dashboard" class="secnav-page" :class="showActiveDashboard()">Dashboard</router-link>
          <router-link to="/pending" class="secnav-page" :class="showActivePending()">Available</router-link>
          <router-link to="/quotes" class="secnav-page" :class="showActiveQuotes()">My Quotes</router-link>
          <router-link to="/orders" class="secnav-page" :class="showActiveOrders()">My Orders</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdown: false,
      timeout: 0,
    };
  },
  computed: {},
  created() {},
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
      if (this.$route.path === '/pending') {
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
  },
};
</script>

<style>
</style>
