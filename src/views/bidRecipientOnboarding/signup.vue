<template>
  <div class="signup">
    <notify />

    <h1 class="signup__heading">{{ $t('signup.join') }} {{ recipient.company_name }}</h1>
    <div class="recipient">
      <p class="recipient__title">{{ $t('signup.name') }}</p>
      <p class="recipient__details">{{ recipient.name }}</p>
      <p class="recipient__title">{{ $t('signup.phone_number') }}</p>
      <p class="recipient__details">{{ recipient.phone }}</p>
      <p class="recipient__title">{{ $t('signup.email_address') }}</p>
      <p class="recipient__details">{{ recipient.email }}</p>
    </div>
    <form class="password">
      <div class="password__label">
        <label class="password__labelText">{{ $t('signup.password') }}</label>
        <i @mouseover.self="setInfo" class="fas fa-info-circle fa-lg password__labelIcon"></i>
        <span class="information" v-show="info"> {{ $t('signup.password_sent_invite') }}</span>
      </div>
      <div class="password__input" v-if="showPassword">
        <input class="password__inputBox" type="text" v-model="password" :placeholder="$t('signup.enter_password')" />
        <i @click="showPassword = !showPassword" class="fas fa-eye-slash fa-lg password__inputIcon"></i>
      </div>
      <div class="password__input" v-else>
        <input class="password__inputBox" type="password" v-model="password" :placeholder="$t('signup.enter_password')" />
        <i @click="showPassword = !showPassword" class="fas fa-eye fa-lg password__inputIcon"></i>
      </div>
      <span v-show="passwordInfo" class="infoPassword">Invalid code, please confirm and try again</span>
      <button class="password__btn" @click.prevent="verifyPassword">{{ $t('signup.sign_up') }}</button>
      <p class="password__login">
        {{ $t('signup.have_account') }} <a href="/login">{{ $t('signup.login_here') }}</a>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import notify from '../../components/notification';

export default {
  components: { notify },
  props: ['recipient'],
  data() {
    return {
      showPassword: false,
      passwordValue: ' ',
      error: false,
      info: false,
      passwordInfo: false,
      password: '',
      auth: process.env.VUE_APP_AUTH,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
    };
  },

  methods: {
    setInfo() {
      this.info = true;
      setTimeout(() => {
        this.info = false;
      }, 3000);
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    async verifyPassword() {
      if (this.password.length < 4) {
        this.passwordInfo = true;
        setTimeout(() => {
          this.passwordInfo = false;
        }, 3000);
      } else {
        const payload = {
          uuid: this.recipient.uuid,
          password: this.password,
        };
        axios
          .post(`${this.auth}partner-api/parcel/partner-user/verify?authkey=${process.env.BIDDING_API_KEY}`, payload)
          .then(res => {
            if (res.status === 200) {
              this.verificationCode();
              this.notify(3, 1, 'Password confirmed successfully');
              this.$store.commit('setNotificationRecipientPhone', this.recipient.phone);
              this.$store.commit('setNotificationRecipientCode', this.password);
            } else {
              this.notify(3, 1, res.data.message);
            }
          })
          .catch(err => {
            this.notify(3, 0, 'Check password and try again');
            resolve(err);
          });
      }
    },
    async verificationCode() {
      const payload = {
        number: this.recipient.phone,
      };
      axios
        .post('https://auth.sendyit.com/v1/request_verification', payload)
        .then(res => {
          if (res.data.status === true) {
            this.notify(3, 1, 'Verification code has been sent to your phone');
            localStorage.setItem('recipientRequestId', res.data.request_id);
            this.$router.push('verification');
          } else {
            this.notify(3, 1, res.data.message);
          }
        })
        .catch(error => {
          this.notify(3, 0, 'Phone Verification Error , Unable to connect to the server . Please try again after 15 minutes');
          this.$router.push('/login');
          resolve(error);
        });
    },
  },
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.signup__heading {
  font-weight: 600;
  font-size: 36px;
  padding: 0px 0px 14px 0px;
}
.recipient {
  margin: 10px 0px;
}
.recipient__title {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  background: 0, 0, 0, 0.6;
}
.recipient__details {
  font-weight: 600;
  font-size: 20px;
  color: #303133;
  padding: 8px 0px;
}
.password__label {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px 0px;
}
.password__labelText {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  padding-right: 20px;
}
.password__labelIcon {
  color: rgba(0, 0, 0, 0.4);
  padding-right: 4px;
}
.information {
  position: absolute;
  color: #ea7125;
  margin: 20px 0px 20px 122px;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0px 2px 23px rgba(0, 0, 0, 0.17);
  font-weight: 500;
  font-size: 14px;
}
.password__inputBox {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  margin: 10px 0px;
  border: 1px solid rgba(0, 0, 0, 0.6);
}
.password__inputIcon {
  margin-left: -30px;
  color: #909399;
}
.password__btn {
  background: #ea7125;
  color: #fff;
  padding: 10px 0px;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  margin: 10px 0px;
}
.password__login {
  text-align: center;
  font-size: 16px;
  padding: 10px 0px;
}
.password__login a {
  color: #ea7125;
}
.infoPassword {
  font-size: 14px;
  color: #ea7125;
  padding: 10px 0px;
  line-height: 0;
}
@media only screen and (max-width: 700px) {
  .signup__heading {
    font-weight: 600;
    font-size: 30px;
    padding: 0px 0px 10px 0px;
  }
}
</style>
