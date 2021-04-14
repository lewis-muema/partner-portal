<template>
  <div class="landingPage">
    <div class="landing-svg">
      <img src="https://images.sendyit.com/partner_portal/images/owners_banner.svg" alt="" />
    </div>
    <div class="landingPage__content">
      <div v-if="this.$route.fullPath === '/recipient/verification'">
        <Verification :recipient="recipient" />
      </div>
      <div v-else>
        <Signup :recipient="recipient" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Signup from './signup.vue';
import Verification from './verification.vue';

export default {
  components: {
    Signup,
    Verification,
  },
  data() {
    return {
      recipient: [],
      signup: false,
      auth: process.env.VUE_APP_AUTH,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      status: '',
    };
  },
  mounted() {
    this.getToken();
  },
  methods: {
    async getToken() {
      axios.get(`${this.auth}partner-api/parcel/partner-user/${this.$route.params.recipient_id}?authkey=${process.env.BIDDING_API_KEY}`).then(res => {
        if (res.data.status === 1) {
          this.signup = true;
          this.recipient = res.data;
        } else {
          this.$router.push('/login');
        }
      });
    },
  },
};
</script>

<style>
.landingPage {
  width: 80%;
  margin: 50px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 50px 0px;
}
.landingPage__content {
  width: 40%;
  margin: auto;
}
@media only screen and (max-width: 1040px) {
  .landing-svg {
    display: none;
  }
  .landingPage__content {
    width: 80%;
    margin: auto;
  }
}
@media only screen and (max-width: 700px) {
  .landingPage {
    margin: 20px auto;
    width: 90%;
  }
  .landingPage__content {
    width: 90%;
    margin: auto;
  }
}
</style>
