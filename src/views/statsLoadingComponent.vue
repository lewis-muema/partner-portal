<template lang="html">
  <div>
    <div class="daily--stats--loading-title">
      {{ stats_loading_title }}
    </div>
    <div class="daily--stats-loader" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'statsLoadingComponent',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    stats_loading_title() {
      return 'Fetching Daily Rider Statistics';
    },
  },
  methods: {},
};
</script>

<style>
@import '../assets/css/performance_section.css';
</style>
