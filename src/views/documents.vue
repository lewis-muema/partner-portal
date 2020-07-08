<template>
  <div>
    <div class="stats--component">
      <div class="rider--stats-menu">
        <div class="secondary-inner">
          <div class="secnav-container rider--stats-section">
            <span class="secnav-page" :class="activeTab === 'drivingLicense' ? 'active' : ''" @click="activeTab = 'drivingLicense'">Driving License</span>
            <span class="secnav-page" :class="activeTab === 'insurance' ? 'active' : ''" @click="activeTab = 'insurance'">Insurance</span>
            <span class="secnav-page" :class="activeTab === 'bikeStatus' ? 'active' : ''" @click="activeTab = 'bikeStatus'">Bike status</span>
            <span class="secnav-page" :class="activeTab === 'refunds' ? 'active' : ''" @click="activeTab = 'refunds'">Refunds</span>
          </div>
        </div>
      </div>
    </div>
    <drivingLicense v-if="activeTab === 'drivingLicense'" />
    <insurance v-if="activeTab === 'insurance'" />
    <bikeStatus v-if="activeTab === 'bikeStatus'" />
    <refunds v-if="activeTab === 'refunds'" />
  </div>
</template>

<script>
import drivingLicense from './drivingLicense.vue';
import insurance from './insurance.vue';
import bikeStatus from './bikeStatus.vue';
import refunds from './refunds.vue';

export default {
  name: 'Documents',
  components: {
    drivingLicense,
    insurance,
    bikeStatus,
    refunds,
  },
  data() {
    return {
      activeTab: 'drivingLicense',
    };
  },
  methods: {
    showActiveLicense() {
      if (this.$route.path === '/drivingLicense') {
        return 'active';
      }
    },
    showActiveInsurance() {
      if (this.$route.path === '/insurance') {
        return 'active';
      }
    },
    showActiveBikeStatus() {
      if (this.$route.path === '/bikeStatus') {
        return 'active';
      }
    },
    showActiveRefunds() {
      if (this.$route.path === '/refunds') {
        return 'active';
      }
    },
  },
};
</script>

<style>
@import '../assets/css/performance.css?v=1';
</style>
