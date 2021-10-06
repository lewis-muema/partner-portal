<template>
  <div class="verify_msg">
    <div class="verification">
      <img class="banner-img" src="https://images.sendyit.com/partner_portal/images/details_banner.svg" alt="" />
      <div v-if="showSuccess">
        <h2 class="verification-header">{{ $t('emailVerification.congratulations') }} 🎉</h2>
        <p class="verification-heading">{{ $t('emailVerification.successful_verify') }}</p>
      </div>
      <div v-else>
        <h2 class="verification-header">{{ $t('emailVerification.verified_head') }} 🎉</h2>
        <p class="verification-heading">{{ $t('emailVerification.verified_msg') }}</p>
      </div>
      <p class="verification-msg">{{ $t('emailVerification.proceed') }}</p>
      <div class="mobile-icons">
        <a class="icon" href="https://play.google.com/store/apps/details?id=com.sendyit.freight"> <img class="store-logo" src="https://images.sendyit.com/partner_portal/images/google_play.svg" alt="" /> </a>
        <a class="icon" href="https://apps.apple.com/ke/app/sendy-freight/id1558197723"> <img class="store-logo" src="https://images.sendyit.com/partner_portal/images/app_store.svg" alt="" /> </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showSuccess: false,
      alreadyVerified: false,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-language': this.$route.query.locale === undefined || this.$route.query.locale.length < 1 ? 'en-KE' : this.$route.query.locale,
        },
      },
    };
  },
  mounted() {
    this.verifyEmail();
  },
  methods: {
    verifyEmail() {
      const payload = JSON.stringify({
        token: this.$route.query.token,
      });
      axios
        .post(`${process.env.VUE_APP_AUTH}freight-transporter-service/onboarding/transporter/verify/email`, payload, this.config)
        .then(res => {
          if (res) {
            this.showSuccess = true;
          }
        })
        .catch(err => {
          this.showSuccess = false;
        });
    },
  },
};
</script>

<style scoped>
.verification {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: auto;
  text-align: center;
}
.verification-heading {
  font-size: 16px;
  color: #333333;
}
.verification-msg {
  font-size: 15px;
  max-width: 400px;
}
.mobile-icons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20%;
  margin: auto;
  padding: 20px 0px;
}
.icon {
  padding: 0px 10px;
}
.store-logo {
  height: 60px;
}
.banner-img {
  width: 23%;
  min-width: 250px;
}
.err_msg {
  margin-bottom: 80px;
}
@-moz-document url-prefix() {
  .store-logo {
    max-width: 150px;
  }
}
</style>
