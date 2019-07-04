<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      date: localStorage.expiryDate,
    };
  },
  computed: {},
  created() {
    if (this.date === undefined || new Date() > new Date(this.date) || localStorage.token === undefined || localStorage.sessionData === undefined) {
      this.$router.push({ path: '/login' });
    }
  },
  methods: {},
};
</script>

<style>
</style>
