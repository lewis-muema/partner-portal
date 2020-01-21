<template>
  <div>
    <sendy-auth-basic @authenticated="signIn" @error="signInError" :form-header="`Login to sendy`" username-placeholder="Enter Phone Number" :password-placeholder="`Password`" :button-text="`SUBMIT`" :username="`phone`" :encrypt="true" :theme="`orange`" :reset-link="`${baseURL}/forgotpassword#`" :register-link="onboardingPortal">
      <template v-slot="{ props }">
        <vue-tel-input v-bind="bindProps" class="tel-input" v-model="props.username" @validate="Valid"></vue-tel-input>
      </template>
    </sendy-auth-basic>
    <div :class="`${notificationName} notifier ${notificationType}`">
      <p class="message">{{ error }}</p>
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
    signIn(data) {
      const refreshToken = data.token.refresh_token;
      const accessToken = data.token.access_token;
      const dataToken = accessToken.split('.')[1];
      let sessionData = Base64.decode(dataToken);
      localStorage.token = accessToken;
      localStorage.refreshToken = refreshToken;
      const parsedData = JSON.parse(sessionData);
      parsedData.payload.super_user = false;
      sessionData = JSON.stringify(parsedData);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3);
      localStorage.expiryDate = expiry;
      localStorage.sessionData = sessionData;
      this.$router.push({ path: '/' });
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
</style>
