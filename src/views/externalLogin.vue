<template>
  <div>
    <div class="login__log-cont" v-if="state === 'login'">
      <div class="login__log-panel">
        <p class="login__header-text">{{ $t('externalLogin.request_log_in') }}</p>
        <div class="control-group">
          <div class="login__element">
            <input
              class="login__password-input"
              type="user"
              name="user"
              id="user"
              :placeholder="$t('externalLogin.enter_user_email')"
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
              :placeholder="$t('externalLogin.password')"
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
              :value="$t('externalLogin.log_in')"
              id="login"
              @click="submit()"
            >{{ $t('externalLogin.submit') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="login__log-cont" v-if="state === 'verify'">
      <div class="login__log-panel">
        <p class="login__header-text">{{ $t('externalLogin.sign_in') }}</p>
        <p>{{ $t('externalLogin.for_your_security') }}</p>
        <div id="reset_error" class="error">{{ loginError }}</div>
        <div class="control-group">
          <div class="login__element">
            <input
              class="login__password-input"
              type="password"
              name="code"
              id="code"
              :placeholder="$t('externalLogin.authentication_code')"
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
            > {{ $t('externalLogin.sign_in') }}</button>
          </div>
          <div class>
            <p @click="verifyCode()" class="external-login__back-button">{{ $t('externalLogin.back') }}</p>
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
import moment from 'moment';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

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
      userPhone: '',
      phoneValidity: false,
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('externalLogin.enter_owner_phone'),
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
        this.handleButton(`<div class='loading-spinner'></div> ${this.$t('externalLogin.please_wait')}`);
        axios
          .post(`${process.env.VUE_APP_AUTH}rideradmin/external_login`, userPayload, { headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.handleResponse(response);
          })
          .catch(error => {
            this.handleButton(this.$t('externalLogin.submit'));
            this.error(this.$t('externalLogin.please_try_again'), 3000);
          });
      } else {
        this.error(this.$t('externalLogin.please_enter_all'), 3000);
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
        this.userPhone = phone;
        if (localStorage.externalRequestId) {
          this.verifyCode();
          this.error(this.$t('externalLogin.please_verify_code'), 3000);
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
      } else {
        this.handleButton(this.$t('externalLogin.submit'));
        this.error(response.data.message, 7000);
      }
    },
    verifyPhone(phone) {
      const payload = JSON.stringify({
        phone_no: phone,
      });
      axios
        .post(process.env.VERIFY_PHONE, payload)
        .then(response => {
          this.handleButton(this.$t('externalLogin.submit'));
          if (response.data.status) {
            this.verifyCode();
            this.requestId = response.data.request_id;
            localStorage.externalRequestId = response.data.request_id;
          } else {
            if (this.requestId) {
              this.verifyCode();
            } else {
              this.error(this.$t('externalLogin.please_wait_for_15min'), 3000);
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
        this.handleButton(`<div class='loading-spinner spinner-position'></div> ${this.$t('externalLogin.signing_in')}`);
        axios
          .post(process.env.CHECK_VERIFICATION, payload)
          .then(response => {
            this.handleButton(this.$t('externalLogin.sign_in'));
            if (response.data.status) {
              localStorage.removeItem('externalRequestId');
              this.TrackLogin('Track By-Pass Login', {
                'Super user email': this.user,
                'Super user phone': this.userPhone,
                'Owner account': this.ownerPhone,
                Time: moment().format('YYYY-MM-DD HH:mm:ss a'),
              });
              this.$router.push({ path: '/' });
            } else {
              this.error(response.data.message, 5000);
              setTimeout(() => {
                if (response.data.message === this.$t('externalLogin.wrong_code')) {
                  localStorage.removeItem('externalRequestId');
                  this.verifyCode();
                }
              }, 5000);
            }
          })
          .catch(error => {
            this.handleButton(this.$t('externalLogin.sign_in'));
            this.errorObj = error.response;
            this.error(error.response, 3000);
          });
      } else {
        this.error(this.$t('externalLogin.invalid_code'), 3000);
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
    TrackLogin(name, body) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track(name, body);
      }
    },
  },
};
</script>

<style>
</style>
