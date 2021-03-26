<template>
  <div>
    <div class="login-outer-content">
      <div class="">
        <owners-banner-component />
      </div>
      <div class="login-group-card">
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
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import axios from 'axios';
import sha1 from 'js-sha1';
import Mixpanel from 'mixpanel';
import { Base64 } from 'js-base64';
import ownersBannerComponent from './ownersBannerComponent.vue';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  title: 'Partner Portal - Log In',
  components: {
    VueTelInput,
    ownersBannerComponent,
  },
  data() {
    return {
      state: 'login',
      tel: '',
      password: '',
      phoneValidity: false,
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
      loginError: '',
    };
  },
  computed: {
    displayNo() {
      return this.tel;
    },
  },
  created() {
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
      if (this.tel) {
        if (isValid) {
          $('.login__phone-input').css({ 'border-color': 'rgb(34, 255, 112)', 'box-shadow': '0px 1px 5px 1px #00ff5a' });
        } else {
          $('.login__phone-input').css({ 'border-color': 'rgb(255, 160, 160)', 'box-shadow': 'rgba(255, 0, 0, 0.58) 0px 1px 5px 1px' });
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
        this.TrackLogin(parsedData.payload);
        this.fetchSignatureStatus(parsedData.payload.phone);
      } else {
        this.handleButton('LOG IN');
        this.error('Sorry, your details did not match!', 7000);
      }
    },
    handleButton(data) {
      if (this.state === 'login') {
        $('.login__btn').html(data);
      } else {
        $('.reset__btn').html(data);
      }
    },
    error(errorStatement, timeout) {
      this.loginError = errorStatement;
      setTimeout(() => {
        this.loginError = '';
      }, timeout);
    },
    TrackLogin(response) {
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

<style>
@media (max-width: 1036px) {
  .login-outer-content , .login-group-card {
    display: contents !important;
  }
}
p {
  font-size: 24px;
  color: #666;
}
a,
a:hover {
  color: #EE7D00;
}
.login__phone-input .dropdown, .login__phone-input .dropdown .selection {
  padding: 0px !important;
}
.login__phone-input .dropdown .selection {
  margin-left: 15px;
}
.login-group-card{
  -webkit-box-flex: 2;
  flex: 1;
  padding-right: 1%;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  margin-left: 13%;
}
.login-outer-content
{
  display: flex;
  flex-direction: row !important;
}
</style>
