<template></template>

<script>
import axios from 'axios';

export default {
  props: ['error'],
  data() {
    return {};
  },
  created() {
    if (this.error.status === 403) {
      axios
        .post(`${process.env.VUE_APP_AUTH}token`, { access_token: localStorage.token, refresh_token: localStorage.refreshToken })
        .then(response => {
          if (response.status === 200) {
            localStorage.token = response.data;
             this.$router.go();
          } else {
            this.$router.push({ path: '/login' });
          }
        }).catch(error => {
          this.$router.push({ path: '/login' });
        });
    }
  },
};
</script>

<style>
</style>
