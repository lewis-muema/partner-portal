<template>
  <div>
    <div class="login__log-cont" v-if="state === 'login'">
      <div class="login__log-panel">
        <p class="login__header-text">Request Log In</p>
        <div class="control-group">
          <div class="login__element">
            <input
              class="login__password-input"
              type="user"
              name="user"
              id="user"
              placeholder="Enter User Email"
              required
              v-model="user"
            />
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
          <div class="login__element">
            <vue-tel-input
              v-model="ownerPhone"
              v-bind="bindProps"
              class="login__phone-input"
              @validate="Valid"
            ></vue-tel-input>
          </div>
          <div id="loggin_error" class="error">{{ loginError }}</div>
          <div class="login__element">
            <button
              class="form-control login__btn"
              type="submit"
              value="Log in"
              id="login"
              @click="submit()"
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
    <div class="login__log-cont" v-if="state === 'verify'">
      <div class="login__log-panel">
        <p class="login__header-text">Sign In</p>
        <p>For your security, Sendy wants to make sure it's really you. We will send a message with your verification code</p>
        <div id="reset_error" class="error">{{ loginError }}</div>
        <div class="control-group">
          <div class="login__element">
            <input
              class="login__password-input"
              type="password"
              name="code"
              id="code"
              placeholder="Authentication Code"
              required
              v-model="code"
            />
          </div>
          <div class="login__element">
            <button
              class="form-control reset__btn"
              type="submit"
              value="Reset Password"
              id="reset"
              @click="sendVerification()"
            >Sign In</button>
          </div>
          <div class>
            <p @click="verifyCode()" class="external-login__back-button">BACK</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import Mixpanel from 'mixpanel';
import { Base64 } from 'js-base64';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

const mixpanel = Mixpanel.init('b36c8592008057290bf5e1186135ca2f');

export default {
  components: {
    VueTelInput,
  },
  title: 'Partner Portal - External Log In',
  data() {
    return {
      state: 'login',
      user: '',
      password: '',
      ownerPhone: '',
      code: '',
      requestId: '',
      env: '',
      phoneValidity: false,
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: 'Enter owner phone number',
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
    if (process.env.VUE_APP_AUTH.includes('test')) {
      this.env = 'test';
    } else {
      this.env = '';
    }
    if (localStorage.externalRequestId) {
      this.requestId = localStorage.externalRequestId;
      this.verifyCode();
    } else if (localStorage.expiryDate) {
      localStorage.removeItem('expiryDate');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('token');
    }
  },
  methods: {
    /* eslint-disable */
    Valid: function({ number, isValid, country }) {
      this.phoneValidity = isValid;
      if (this.ownerPhone) {
        if (isValid) {
          $('.login__phone-input').css({ 'border-color': 'rgb(34, 255, 112)', 'box-shadow': '0px 1px 5px 1px #00ff5a' });
        } else {
          $('.login__phone-input').css({ 'border-color': 'rgb(255, 160, 160)', 'box-shadow': 'rgba(255, 0, 0, 0.58) 0px 1px 5px 1px' });
        }
      }
    },
    /* eslint-enable */
    verifyCode() {
      if (this.state === 'login') {
        this.state = 'verify';
        this.loginError = '';
      } else {
        this.state = 'login';
        this.loginError = '';
      }
    },
    submit() {
      this.ownerPhone = this.ownerPhone.replace(/ /g, '');
      const userPayload = JSON.stringify({
        user_email: this.user,
        password: this.password,
        owner_phone: this.ownerPhone,
      });
      if (this.user && this.password && this.phoneValidity) {
        this.handleButton("<div class='loading-spinner'></div> Please Wait");
        axios
          .post(`${process.env.VUE_APP_AUTH}rideradmin/external_login`, userPayload, { headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.handleResponse(response);
          })
          .catch(error => {
            this.handleButton('SUBMIT');
            this.error('Please try again', 3000);
          });
      } else {
        this.error('Please enter all details', 3000);
      }
    },
    handleResponse(response) {
      const refreshToken = response.data.refresh_token;
      const accessToken = response.data.access_token;
      if (accessToken !== undefined && refreshToken !== undefined) {
        const dataToken = accessToken.split('.')[1];
        let sessionData = Base64.decode(dataToken);
        localStorage.token = accessToken;
        localStorage.refreshToken = refreshToken;
        const parsedData = JSON.parse(sessionData).payload;
        let phone = parsedData.admin_phone;
        if (phone.substr(0, 2) === '07') {
          phone = phone.replace(phone.substr(0, 2), '+2547');
        }
        if (phone.substr(0, 1) === '7') {
          phone = phone.replace(phone.substr(0, 1), '+2547');
        }
        if (phone.substr(0, 3) === '254' || phone.substr(0, 3) === '256') {
          phone = `+${phone}`;
        }
        if (localStorage.externalRequestId) {
          this.verifyCode();
          this.error('Please verify the code you recieved previously', 3000);
        } else {
          this.verifyPhone(phone);
        }
        parsedData.payload = parsedData.payload[0];
        parsedData.payload.super_user = true;
        sessionData = JSON.stringify(parsedData);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3);
        localStorage.expiryDate = expiry;
        localStorage.sessionData = sessionData;
        this.TrackLogin(parsedData.payload);
      } else {
        this.handleButton('SUBMIT');
        this.error(response.data.message, 7000);
      }
    },
    verifyPhone(phone) {
      const payload = JSON.stringify({
        phone_no: phone,
      });
      axios
        .post(`https://api${this.env}.sendyit.com/parcel/index.php/api/v10/verify_phone`, payload)
        .then(response => {
          this.handleButton('SUBMIT');
          if (response.data.status) {
            this.verifyCode();
            this.requestId = response.data.request_id;
            localStorage.externalRequestId = response.data.request_id;
          } else {
            if (this.requestId) {
              this.verifyCode();
            } else {
              this.error('Please wait for 15 minutes and try again', 3000);
            }
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.error(error.response, 3000);
        });
    },
    sendVerification() {
      if (this.code) {
        const payload = JSON.stringify({
          code: this.code,
          request_id: this.requestId,
        });
        this.handleButton("<div class='loading-spinner spinner-position'></div> Signing in");
        axios
          .post(`https://api${this.env}.sendyit.com/parcel/index.php/api/v10/check_verification/`, payload)
          .then(response => {
            this.handleButton('SIGN IN');
            if (response.data.status) {
              localStorage.removeItem('externalRequestId');
              this.$router.push({ path: '/' });
            } else {
              this.error(response.data.message, 5000);
              setTimeout(() => {
                if (response.data.message === 'A wrong code was provided too many times. Workflow terminated') {
                  localStorage.removeItem('externalRequestId');
                  this.verifyCode();
                }
              }, 5000);
            }
          })
          .catch(error => {
            this.handleButton('SIGN IN');
            this.errorObj = error.response;
            this.error(error.response, 3000);
          });
      } else {
        this.error('Invalid code', 3000);
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
</style>
