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
import Mixpanel from 'mixpanel';
import notify from '../../components/notification';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  components: {
    notify,
  },
  props: ['recipient'],
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
            if (res.data.status === true) {
              this.notify(3, 1, 'Phone verification was successful! You will be automatically logged in your account ...');
              this.handleUserStatusUpdate();
            } else {
              this.notify(3, 0, res.data.message);
            }
          })
          .catch(error => {
            this.notify(3, 0, error.response.data.message);
          });
      }
    },
    handleUserStatusUpdate() {
      const payload = {
        uuid: this.recipient.uuid,
        password: this.$store.getters.getNotificationRecipientCode,
        status: 2,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner-api/parcel/partner-user/verify?authkey=${process.env.BIDDING_API_KEY}`, payload)
        .then(res => {
          if (res.status === 200) {
             this.handleUserLogin();
          } else {
            this.notify(3, 0, res.data.message);
          }
        })
        .catch(err => {
          this.notify(3, 0, 'Check password and try again');
          resolve(err);
        });
    },
    handleUserLogin() {
      const tel = this.$store.getters.getNotificationRecipientPhone.replace(/ /g, '');
      const payload = {
        phone: tel,
        password: this.$store.getters.getNotificationRecipientCode,
      };
      axios.post(`${process.env.VUE_APP_AUTH}partner-api/parcel/partner-user/login`, payload).then(response => {
        if (response.status === 200) {
          this.handleResponse(response);
        } else {
          this.notify(3, 0, 'Automatic login failed , you will be directed to the login page');
          setTimeout(() => {
            this.$router.push('/login');
          }, 4000);
        }
      });
    },
    handleResponse(response) {
      const refreshToken = response.data.refresh_token;
      const accessToken = response.data.access_token;
      if (accessToken !== undefined && refreshToken !== undefined) {
        const dataToken = accessToken.split('.')[1];
        let sessionData = Base64.decode(dataToken);
        localStorage.token = accessToken;
        localStorage.refreshToken = refreshToken;
        const parsedData = JSON.parse(sessionData);
        if (this.$apm) {
          this.$apm.setUserContext({
            owner_id: parsedData.payload.id,
            partner_user_id: parsedData.payload.partner_user_id,
            username: parsedData.payload.name,
            email: parsedData.payload.email,
            phone: parsedData.payload.phone,
          });
        }
        parsedData.payload.super_user = false;
        sessionData = JSON.stringify(parsedData);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3);
        localStorage.expiryDate = expiry;
        localStorage.sessionData = sessionData;
        this.trackLogin(parsedData.payload);
        setTimeout(() => {
          this.$router.push({ path: '/freight/orders' });
        }, 4000);
      } else {
        this.notify(3, 0, 'Automatic login failed , you will be directed to the login page');
        setTimeout(() => {
          this.$router.push('/login');
        }, 4000);
      }
    },
    trackLogin(response) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Login Web', {
          Name: response.name,
          Phone: response.phone,
          Id_no: response.id_no,
          email: response.email,
          Owner_id: response.id,
          Country: response.country_code,
          Currency: response.default_currency,
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
