<template>
  <div class="fuel-advance-container">
    <div class="fuel-advance-heading">Fuel Advance</div>
    <div class="fuel-advance-menu">
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'pending' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'pending'">Pending</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'approved' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'approved'">Approved</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'rejected' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'rejected'">Rejected</div>
      <div class="fuel-advance-menu-tabs" :class="activeTab === 'placerequest' ? 'fuel-advance-menu-tabs-active' : ''" @click="activeTab = 'placerequest'">Place Request</div>
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
import Pending from './components/pending';
import Approved from './components/approved';
import Rejected from './components/rejected';
import PlaceRequest from './components/placeRequest';


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
