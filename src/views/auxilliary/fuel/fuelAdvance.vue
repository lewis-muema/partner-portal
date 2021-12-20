<template>
  <div class="fuel-advance-container">
    <div class="fuel-advance-heading">{{ $t('fuelAdvance.fuel_advance') }}</div>
    <div class="fuel-advance-menu">
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'pending' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'pending'">{{ $t('fuelAdvance.pending') }}</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'approved' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'approved'">{{ $t('fuelAdvance.approved') }}</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'rejected' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'rejected'">{{ $t('fuelAdvance.rejected') }}</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'placerequest' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'placerequest'">{{ $t('fuelAdvance.place_request') }}</div>
    </div>
    <div class="fuel-advance-components">
      <Pending v-if="activeTab === 'pending'" />
      <Approved v-if="activeTab === 'approved'" />
      <Rejected v-if="activeTab === 'rejected'" />
      <PlaceRequest v-if="activeTab === 'placerequest'" />
    </div>
  </div>
</template>

<script>
import Pending from './components/pending.vue';
import Approved from './components/approved.vue';
import Rejected from './components/rejected.vue';
import PlaceRequest from './components/placeRequest.vue';


export default {
  components: {
    Pending,
    Approved,
    Rejected,
    PlaceRequest,
  },
  data() {
    return {
      activeTab: 'pending',
    };
  },
};
</script>

<style>

</style>
