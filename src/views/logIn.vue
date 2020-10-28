<template>
  <div>
    <div class="login__log-cont" v-if="state === 'login'">
      <div class="login__log-panel">
        <p class="login__header-text">Log in to Sendy</p>
        <div class="control-group">
          <div class="login__element">
            <vue-tel-input v-model="tel" v-bind="bindProps" class="login__phone-input" @validate="Valid"></vue-tel-input>
          </div>
          <div class="login__element">
            <input class="login__password-input" type="password" name="password" id="password" placeholder="Password" required v-model="password" />
          </div>
          <div id="loggin_error" class="error">{{ loginError }}</div>
          <div class="login__element">
            <button class="form-control login__btn" type="submit" value="Log in" id="login" @click="postLogin">Log In</button>
          </div>
          <div class="login__inst">
            <a href="#" @click="forgotPwd()" class="login__forgotPass">Forgot Password?</a>
          </div>
          <div class="login__inst">
            Don't have an account?
            <a href="#" @click="redirect()" class="login__sign-up">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
    <div class="login__log-cont" v-if="state === 'reset'">
      <div class="login__log-panel">
        <p class="login__header-text">Reset Password</p>
        <div id="reset_error" class="error">{{ loginError }}</div>
        <div class="control-group">
          <div class="login__element">
            <vue-tel-input v-model="tel" v-bind="bindProps" class="login__phone-input" @validate="Valid"></vue-tel-input>
          </div>
          <div class="login__element">
            <button class="form-control reset__btn" type="submit" value="Reset Password" id="reset" @click="postForgot">Reset Password</button>
          </div>
          <a href="#" @click="forgotPwd()" class="login__forgotPass">Sign In</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTelInput from 'vue-tel-input';
import $ from 'jquery';
import axios from 'axios';

export default {
  title: 'Partner Portal - Log In',
  components: {
    VueTelInput,
  },
  data() {
    return {
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: 'Enter a phone number',
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['KE', 'UG', 'TZ'],
        onlyCountries: [],
        ignoredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 20,
        wrapperClasses: '',
        inputClasses: '',
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
        validCharactersOnly: true,
      },
      phoneValidity: false,
      baseURL: '',
      onboardingPortal: '',
      notificationName: '',
      notificationType: '',
      error: '',
    };
  },
  mounted() {
    this.baseURL = window.location.origin;
    this.onboardingPortal = process.env.ONBOARDING_PORTAL;
    $('p').css({ 'font-size': '13px' });
    $('input').css({ width: '293px' });
    if (localStorage.expiryDate) {
      axios
        .post(`${process.env.VUE_APP_AUTH}logout`, { refresh_token: localStorage.refreshToken })
        .then(response => {
          localStorage.removeItem('expiryDate');
          localStorage.removeItem('sessionData');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        });
    }
  },
  methods: {
    /* eslint-disable */
    Valid: function({ number, isValid, country }) {
      this.phoneValidity = isValid;
      if (number) {
        if (isValid) {
          $('.tel-input').css({ 'border-color': 'rgb(34, 255, 112)', 'box-shadow': '0px 1px 5px 1px #00ff5a' });
        } else {
          $('.tel-input').css({ 'border-color': 'rgb(255, 160, 160)', 'box-shadow': 'rgba(255, 0, 0, 0.58) 0px 1px 5px 1px' });
        }
      }
    },
    /* eslint-enable */
    forgotPwd() {
      if (this.state === 'login') {
        this.state = 'reset';
        this.loginError = '';
      } else {
        this.state = 'login';
        this.loginError = '';
      }
    },
    redirect() {
      window.location.href = process.env.ONBOARDING_PORTAL;
    },
    fetchSignatureStatus(phoneNo) {
      const payload = {
        phone_no: phoneNo,
        is_owner: true,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/management/get_partner_details`, payload)
        .then(response => {
          if (!response.data.documents.signature) {
            this.$router.push({ path: '/signature' });
          } else {
            if (localStorage.externalURL) {
              const URL = localStorage.externalURL;
              localStorage.removeItem('externalURL');
              this.$router.push({ path: URL });
            } else {
              this.$router.push({ path: '/' });
            }
          }
        })
        .catch(error => {
          if (localStorage.externalURL) {
            const URL = localStorage.externalURL;
            localStorage.removeItem('externalURL');
            this.$router.push({ path: URL });
          } else {
            this.$router.push({ path: '/' });
          }
        });
    },
    postForgot() {
      // eslint-disable-next-line quotes
      this.handleButton(`<div class='loading-spinner'></div> Please Wait`);
      this.tel = this.tel.replace(/ /g, '');
      const payload = {
        phone: this.tel,
      };
      axios.post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/account`, payload).then(response => {
        if (response.data.status) {
          this.handleButton('Reset Password');
          this.error(response.data.message, 7000);
        } else {
          this.handleButton('Reset Password');
          this.error('Please try again', 7000);
        }
      }).catch(error => {
        this.handleButton('Reset Password');
        this.error(error.response.data.message, 7000);
      });
    },
    postLogin() {
      // eslint-disable-next-line quotes
      this.handleButton(`<div class='loading-spinner'></div> Please Wait`);
      this.tel = this.tel.replace(/ /g, '');
      const payload = JSON.stringify({
        phone: this.tel,
        password: sha1(this.password),
      });
      axios.post(`${process.env.VUE_APP_AUTH}rideradmin/login`, payload).then(response => {
        if (response.status === 200) {
          this.handleResponse(response);
        } else {
          this.handleButton('LOG IN');
          this.error('Please try again', 7000);
        }
      });
      parsedData.payload.super_user = false;
      sessionData = JSON.stringify(parsedData);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3);
      localStorage.expiryDate = expiry;
      localStorage.sessionData = sessionData;
      this.fetchSignatureStatus(parsedData.payload.phone);
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
        this.$apm.setUserContext({
          owner_id: parsedData.payload.id,
          username: parsedData.payload.name,
          email: parsedData.payload.email,
          phone: parsedData.payload.phone,
        });
        parsedData.payload.super_user = false;
        sessionData = JSON.stringify(parsedData);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3);
        localStorage.expiryDate = expiry;
        localStorage.sessionData = sessionData;
        this.TrackLogin(parsedData.payload);
        this.fetchSignatureStatus(parsedData.payload.phone);
      } else {
        this.handleButton('LOG IN');
        this.error('Sorry, your details did not match!', 7000);
      }
    },
    signInError(error) {
      this.notificationName = 'message-box-up';
      this.notificationType = 'failed';
      if (error.status) {
        this.error = 'Please try again';
      } else {
        this.error = 'Sorry, your details did not match!';
      }
      setTimeout(() => {
        this.notificationName = 'message-box-down';
      }, 3000);
    },
  },
};
</script>

<style>
.tel-input {
  width: 293px;
}
.tel-input .dropdown {
  padding: 0 !important;
}
.tel-input .dropdown .selection {
  padding: 0 !important;
}
.login__phone-input .dropdown, .login__phone-input .dropdown .selection {
  padding: 0px !important;
}
.login__phone-input .dropdown .selection {
  margin-left: 15px;
}
</style>
