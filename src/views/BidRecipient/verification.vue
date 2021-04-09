<template>
  <div class="verification">
    <div class="verification__backIcon">
      <a href="/login"><i class="far fa-arrow-alt-circle-left fa-4x light"></i> </a>
    </div>
    <div class="verificationContent">
      <h1 class="verificationContent__heading">{{ $t('signup.verification') }}</h1>
      <p class="verificationContent__description">{{ $t('signup.for_security') }}</p>
      <form class="verificationForm">
        <label class="verificationForm__label">{{ $t('signup.enter_verification_code') }}</label>
        <input class="verificationForm__input" type="number" :placeholder="$t('signup.enter_code')" v-model="code" />
        <span v-show="info" class="info">Invalid code, please confirm and try again</span>
        <button class="verificationForm__btn" @click.prevent="verifyCode">{{ $t('signup.verify_code') }}</button>
      </form>
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import notify from '../../components/notification';

export default {
  components: {
    notify,
  },
  data() {
    return {
      code: '',
      info: false,
    };
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    async verifyCode() {
      if (this.code.length < 4) {
        this.info = true;
        setTimeout(() => {
          this.info = false;
        }, 3000);
      } else {
        const payload = {
          request_id: localStorage.recipientRequestId,
          code: this.code,
        };
        axios
          .post('https://auth.sendyit.com/v1/check_verification', payload)
          .then(res => {
            if (res.data.status) {
              this.notify(3, 1, 'Verified successfully');
              this.$router.push('/login');
            } else {
              this.notify(3, 1, response.data.message);
            }
          })
          .catch(error => {
            this.notify(3, 0, 'Verification code Error , Unable to connect to the server . Please try again');
            resolve(error);
          });
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.verification__backIcon {
  position: relative;
  bottom: 80px;
  cursor: pointer;
}
a {
  color: rgba(0, 0, 0, 0.8);
}
.verificationContent__heading {
  font-weight: 600;
  font-size: 40px;
  letter-spacing: 0.25px;
}
.verificationContent__description {
  font-size: 18px;
  line-height: 23px;
  color: rgba(0, 0, 0, 0.6);
  padding: 20px 0px;
}
.verificationForm {
  width: 100%;
}
.verificationForm__label {
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
}
.verificationForm__input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  margin: 6px 0px 8px 0px;
  border: 1px solid rgba(0, 0, 0, 0.6);
}
.verificationForm__btn {
  background: #ea7125;
  color: #fff;
  padding: 14px 0px;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  margin: 26px 0px 10px 0px;
}
.info {
  font-size: 14px;
  color: #ea7125;
  padding: 10px 0px;
  line-height: 0;
}
@media only screen and (max-width: 700px) {
  .verification__backIcon {
    position: relative;
    bottom: 50px;
    cursor: pointer;
  }
}
</style>
