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
    console.log(process.env);
    if (this.date === undefined || new Date() > new Date(this.date) || localStorage.token === undefined || localStorage.sessionData === undefined) {
      this.$router.push({ path: '/' });
    }
  },
  methods: {},
};
</script>

<style>
</style>
