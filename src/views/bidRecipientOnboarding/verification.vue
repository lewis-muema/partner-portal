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
      <modal name="verification-modal" class="verification-modal" :click-to-close="false" transition="slide" :height="600" :pivot-y="0.45" :pivot-x="0.5">
        <div class="app_modal">
          <div class="modal-head">
            <h3 class="app_modal-heading-text">A better experience for you!</h3>
            <i class="fas fa-times  fa-2x modal-icon" @click="handleUserStatusUpdate"></i>
          </div>
          <img class="modal-banner" src="https://images.sendyit.com/partner_portal/images/details_banner.svg" alt="" />
          <div class="modal-store">
            <a :href="link" @click="viewApps(1)" class="modal-app-links"> <img class="modal-img-store" src="https://images.sendyit.com/partner_portal/images/app_store.svg" alt="" /> </a>
            <a :href="link" @click="viewApps(2)" class="modal-app-links"> <img class="modal-img-store" src="https://images.sendyit.com/partner_portal/images/google_play.svg" alt="" /> </a>
          </div>
        </div>
        <p class="app_modal-downlaod">Download the Sendy Freight app to have the best experience on your phone.</p>
      </modal>
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
      link: '',
    };
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    show() {
      this.$modal.show('verification-modal');
    },
    hide() {
      this.$modal.hide('verification-modal');
    },
    viewApps(i) {
      if (i === 1) {
        this.link = 'https://apps.apple.com/ke/app/sendy-freight/id1558197723';
      } else if (i === 2) {
        this.link = 'https://play.google.com/store/apps/details?id=com.sendyit.freight';
      }
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
              this.show();
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
      this.hide();
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
  width: 100%;
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

.app_modal {
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 20px 30px 20px;
}
.app-modal-heading {
  font-size: 20px;
  font-weight: 900;
}
.modal-icon {
  justify-self: end;
}
.app_modal-downlaod {
  font-size: 17px;
  text-align: center;
  padding: 0px 30px;
}
.modal-banner {
  width: 60%;
  margin: auto;
  padding: 20px 0px;
}
.modal-img-store {
  margin: auto;
  padding: 30px 0px;
}
.modal-store {
  display: flex;
  flex-direction: row-row;
  justify-content: space-evenly;
}
.modal-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
}
.modal-icon {
  color: rgb(111, 108, 108);
}
.app_modal-heading-text {
  width: 90%;
}

@media only screen and (max-width: 700px) {
  .verification__backIcon {
    position: relative;
    bottom: 50px;
    cursor: pointer;
  }
  .app_modal {
    padding: 10px 10px;
    width: 100%;
  }
  .app-modal-heading {
    font-size: 10px;
  }
  .modal-head {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    text-align: center;
  }
  .modal-icon {
    align-self: flex-end;
    padding: 10px 0px;
  }
}
</style>
