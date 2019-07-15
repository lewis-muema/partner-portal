<template></template>

<script>
export default {
  props: ['error'],
  data() {
    return {};
  },
  created() {
    if (this.error.status === 403) {
      this.$router.push({ path: '/login' });
    }
  },
};
</script>

<style>
</style>
