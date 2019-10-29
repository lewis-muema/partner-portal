<template>
  <div>
    <div class="login__log-cont" v-if="state === 'login'">
      <div class="login__log-panel">
        <p class="login__header-text">Log in to Sendy</p>
        <div class="control-group">
          <div class="login__element">
            <vue-tel-input
              v-model="tel"
              v-bind="bindProps"
              class="login__phone-input"
              @input="validatePhone()"
            ></vue-tel-input>
          </div>
          <div class="login__element">
            <input
              class="login__password-input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              v-model="password"
            />
          </div>
          <div id="loggin_error" class="error">{{ loginError }}</div>
          <div class="login__element">
            <button
              class="form-control login__btn"
              type="submit"
              value="Log in"
              id="login"
              @click="postLogin"
            >Log In</button>
          </div>
          <div class="login__inst">
            <a href="#" @click="forgotPwd();" class="login__forgotPass">Forgot Password?</a>
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
        <p class="login__header-text">Set Password</p>
        <div id="reset_error" class="error">{{ loginError }}</div>
        <div class="control-group">
          <div class="login__element">
            <vue-tel-input v-model="tel" v-bind="bindProps"></vue-tel-input>
          </div>
          <div class="login__element">
            <button
              class="form-control reset__btn"
              type="submit"
              value="Reset Password"
              id="reset"
              @click="postForgot"
            >Set Password</button>
          </div>
          <a href="#" @click="forgotPwd();" class="login__forgotPass">Sign In</a>
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

const mixpanel = Mixpanel.init('b36c8592008057290bf5e1186135ca2f');

export default {
  title: 'Partner Portal - Log In',
  components: {
    VueTelInput,
  },
  data() {
    return {
      state: 'login',
      tel: '',
      password: '',
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
      localStorage.removeItem('expiryDate');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('token');
    }
  },
  methods: {
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
      if (process.env.VUE_APP_AUTH.includes('test')) {
        window.location.href = 'https://partnertest.sendyit.com/onboarding_portal/#/';
      } else {
        window.location.href = 'https://partner.sendyit.com/onboarding_portal/#/';
      }
    },
    validatePhone() {
      setTimeout(() => {
        this.tel = this.tel.toString().replace(/[^0-9+]/g, '');
      }, 0);
    },
    postForgot() {
      // eslint-disable-next-line quotes
      this.handleButton(`<div class='loading-spinner'></div> Please Wait`);
      this.tel = this.tel.replace(/ /g, '');
      const payload = JSON.stringify({
        phone: this.tel,
      });
      axios.post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/account`, payload).then(response => {
        if (response.status === 200) {
          this.handleButton('SET PASSWORD');
          this.error(response.data.msg, 7000);
        } else {
          this.handleButton('SET PASSWORD');
          this.error('Please try again', 7000);
        }
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
        const sessionData = Base64.decode(dataToken);
        localStorage.token = accessToken;
        localStorage.refreshToken = refreshToken;
        const parsedData = JSON.parse(sessionData);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3);
        localStorage.expiryDate = expiry;
        localStorage.sessionData = sessionData;
        this.TrackLogin(parsedData.payload);
        this.$router.push({ path: '/' });
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
      if (process.env.VUE_APP_AUTH !== undefined && !process.env.VUE_APP_AUTH.includes('test')) {
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
p {
  font-size: 24px;
  color: #666;
}
a,
a:hover {
  color: #f57f20;
}
</style>
