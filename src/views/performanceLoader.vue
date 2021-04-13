<template>
  <div>
    <riderPerformanceHeader />
    <div class="stats--component">
      <div class="rider--stats-menu">
        <div class="secondary-inner">
          <div class="secnav-container rider--stats-section">
            <router-link to="/performance" class="secnav-page" :class="showActiveDashboard()">{{ $t('perfomance.today') }} </router-link>
          </div>
        </div>
      </div>
    </div>

    <riderTodayStats />
  </div>
</template>

<script>
import riderTodayStats from './riderTodayStats.vue';
import riderPerformanceHeader from './riderPerformanceHeader.vue';

export default {
  name: 'PerformanceLoader',
  components: { riderPerformanceHeader, riderTodayStats },
  data() {
    return {};
  },
  methods: {
    showActiveDashboard() {
      if (this.$route.path === '/performance') {
        return 'active';
      }
    },
  },
};
</script>

<style>
@import '../assets/css/performance.css';
</style>
