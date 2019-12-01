<template>
  <div class="login__log-cont">
    <div class="login__log-panel">
      <p class="login__header-text">Set Password</p>
      <div id="reset_error" class="error">{{ loginError }}</div>
      <div class="control-group">
        <div class="login__element">
          <vue-tel-input
            v-model="tel"
            v-bind="bindProps"
            class="forgot--password-input"
            @validate="Valid"
          ></vue-tel-input>
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
        <a href="#" @click="$router.push('/login')" class="login__forgotPass">Sign In</a>
      </div>
    </div>
  </div>
</template>

<script>
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
      $('.reset__btn').html(`<div class='loading-spinner'></div> Please Wait`);
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
  },
};
</script>

<style>
</style>
