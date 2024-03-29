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
        placeholder: this.$t('authLogin.enter_phone_no'),
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
    signIn(data) {
      const refreshToken = data.token.refresh_token;
      const accessToken = data.token.access_token;
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
      this.fetchSignatureStatus(parsedData.payload.phone);
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
    signInError(error) {
      this.notificationName = 'message-box-up';
      this.notificationType = 'failed';
      if (error.status) {
        this.error = this.$t('authLogin.please_try_again');
      } else {
        this.error = this.$t('authLogin.details_not_match');
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
</style>
