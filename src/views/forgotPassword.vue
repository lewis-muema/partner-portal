<template>
  <div class="login__log-cont">
    <div class="login__log-panel">
      <p class="login__header-text">{{ $t('forgotPassword.reset_password') }}</p>
      <div id="reset_error" class="error">{{ loginError }}</div>
      <div class="control-group">
        <div class="login__element">
          <vue-tel-input v-model="tel" v-bind="bindProps" class="forgot--password-input" @validate="Valid"></vue-tel-input>
        </div>
        <div class="login__element">
          <button class="reset__btn form-control" type="submit" value="Reset Password" id="reset" @click="postForgot"> {{ $t('forgotPassword.reset_password') }}</button>
        </div>
        <a href="#" @click="$router.push('/login')" class="login__forgotPass"> {{ $t('forgotPassword.sign_in') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueTelInput from 'vue-tel-input';
import $ from 'jquery';

export default {
  title: 'Partner Portal - Log In',
  components: {
    VueTelInput,
  },
  data() {
    return {
      loginError: '',
      tel: '',
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('forgotPassword.enter_phone'),
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
    };
  },
  methods: {
    /* eslint-disable */
    Valid: function({ number, isValid, country }) {
      this.phoneValidity = isValid;
      if (number) {
        if (isValid) {
          $('.forgot--password-input').css({ 'border-color': 'rgb(34, 255, 112)', 'box-shadow': '0px 1px 5px 1px #00ff5a' });
        } else {
          $('.forgot--password-input').css({ 'border-color': 'rgb(255, 160, 160)', 'box-shadow': 'rgba(255, 0, 0, 0.58) 0px 1px 5px 1px' });
        }
      }
    },
    /* eslint-enable */
    postForgot() {
      // eslint-disable-next-line quotes
      this.handleButton(`<div class='loading-spinner'></div> ${this.$t('forgotPassword.please_wait')}`);
      this.tel = this.tel.replace(/ /g, '');
      const payload = {
        phone: this.tel,
      };
      axios.post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/account`, payload).then(response => {
        if (response.data.status) {
          this.handleButton(this.$t('forgotPassword.reset_password'));
          this.error(response.data.message, 7000);
        } else {
          this.handleButton(this.$t('forgotPassword.reset_password'));
          this.error(this.$t('forgotPassword.please_try_again'), 7000);
        }
      }).catch(error => {
        this.handleButton(this.$t('forgotPassword.reset_password'));
        this.error(error.response.data.message, 7000);
      });
    },
    handleButton(data) {
      $('.reset__btn').html(data);
    },
    error(errorStatement, timeout) {
      this.loginError = errorStatement;
      setTimeout(() => {
        this.loginError = '';
      }, timeout);
    },
  },
};
</script>

<style>
.forgot--password-input .dropdown {
  padding: 0 !important;
}
.forgot--password-input .dropdown .selection {
  padding: 0 !important;
  margin-left: 10px;
}
</style>
