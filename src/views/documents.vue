<template>
  <div>
    <div class="stats--component">
      <div class="rider--stats-menu">
        <div class="secondary-inner">
          <div class="secnav-container rider--stats-section">
            <span class="secnav-page" :class="activeTab === 'drivingLicense' ? 'active' : ''" @click="activeTab = 'drivingLicense'">Driving License</span>
            <span class="secnav-page" :class="activeTab === 'insurance' ? 'active' : ''" @click="activeTab = 'insurance'">Insurance</span>
            <span v-if="bikeRidersStatus" class="secnav-page" :class="activeTab === 'bikeStatus' ? 'active' : ''" @click="activeTab = 'bikeStatus'">Bike status</span>
            <span v-if="bikeRidersStatus" class="secnav-page" :class="activeTab === 'cbdStatus' ? 'active' : ''" @click="activeTab = 'cbdStatus'">Bike CBD License</span>
            <span class="secnav-page" :class="activeTab === 'refunds' ? 'active' : ''" @click="activeTab = 'refunds'">Refunds</span>
          </div>
        </div>
      </div>
    </div>
    <drivingLicense v-if="activeTab === 'drivingLicense'" :key="componentKey" />
    <insurance v-if="activeTab === 'insurance'" :key="componentKey" />
    <bikeStatus v-if="activeTab === 'bikeStatus'" :key="componentKey" />
    <cbdStatus v-if="activeTab === 'cbdStatus'" :key="componentKey" />
    <refunds v-if="activeTab === 'refunds'" :key="componentKey" />
  </div>
</template>

<script>
import axios from 'axios';
import drivingLicense from './drivingLicense.vue';
import insurance from './insurance.vue';
import bikeStatus from './bikeStatus.vue';
import cbdStatus from './cbdStatus.vue';
import refunds from './refunds.vue';

export default {
  name: 'Documents',
  components: {
    drivingLicense,
    insurance,
    bikeStatus,
    cbdStatus,
    refunds,
  },
  data() {
    return {
      activeTab: 'drivingLicense',
      componentKey: 0,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      bikeRidersStatus: false,
    };
  },
  watch: {
    activeTab(session) {
      this.componentKey += 1;
    },
  },
  created() {
    this.componentKey += 1;
    this.fetchDrivers();
  },
  methods: {
    fetchDrivers() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        owner_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
        .then(res => {
          const data = res.data.riders;
          const riderArray = data.filter(obj => obj.vendor_type === 1);
          if (riderArray.length > 0) {
            this.bikeRidersStatus = true;
          } else {
            this.bikeRidersStatus = false;
          }
        })
        .catch(error => {
          this.bikeRidersStatus = false;
        });
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance.css?v=1';
</style>
