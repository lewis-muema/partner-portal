<template lang="html">
  <div>
    <div class="daily--stats--loading-title">
      {{ stats_loading_title }}
    </div>
    <div class="daily--stats-loader" />
  </div>
</template>

<script>

export default {
  name: 'statsLoadingComponent',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    stats_loading_title() {
      return this.$t('statement.fetching_daily_stats');
    },
  },
  methods: {},
};
</script>

<style>
@import '../assets/css/performance_section.css';
</style>
