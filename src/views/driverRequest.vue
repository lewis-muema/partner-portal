<template>
  <div>
    <Header />
    <div class="driverRequest__request-outer" v-if="message">
      <div class>
        <div class="driverRequest__request-text">
          <span class="driverRequest__toCap">{{ message }}</span>
        </div>
        <div class="driverRequest__request-options" v-if="responseStatus">
          <div class="driverRequest__request-radio">
            <input type="radio" name="choice" value="1" id="req-accept" />
            <span>Accept</span>
          </div>
          <div class="driverRequest__request-radio">
            <input type="radio" name="choice" value="2" id="req-reject" />
            <span>Reject</span>
          </div>
        </div>
        <div class="driverRequest__request-submit" v-if="responseStatus">
          <button
            type="button"
            name="button"
            class="btn btn-primary"
            @click="submitResponse();"
            v-if="allocationType !== 3"
          >Submit</button>
          <button
            type="button"
            name="button"
            class="btn btn-primary"
            @click="submitResponse();"
            v-else
          >Sign up with Sendy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/headers/logInHeader';

const axios = require('axios');

export default {
  components: {
    Header,
  },
  data() {
    return {
      token: '',
      message: '',
      allocationType: '',
      responseStatus: false,
      detailsStatus: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
    };
  },
  created() {
    if (this.$route.params.token !== undefined) {
      const payload = JSON.stringify({
        token: this.$route.params.token,
      });
      axios.post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/allocation_details`, payload, this.config).then(response => {
        if (response.data.status) {
          this.responseStatus = true;
          this.allocationType = response.data.msg.allocation_details.allocation_type;
          this.token = response.data.msg.allocation_details.token;
          let vehicleModel = '';
          let vehicleRegistration = '';
          if (response.data.msg.vehicle_details.model) {
            vehicleModel = response.data.msg.vehicle_details.model;
          }
          if (response.data.msg.vehicle_details.registration_no) {
            vehicleRegistration = response.data.msg.vehicle_details.registration_no;
          }
          this.message = `${response.data.msg.owner_details.name} has invited you to drive their ${vehicleModel} : ${vehicleRegistration} on Sendy`;
        } else {
          this.message = response.data.msg;
        }
      });
    } else {
      this.message = 'The link is invalid, Please ask the owner to re-invite you';
    }
  },
  methods: {
    submitResponse() {
      const stat = $('input[name=choice]:checked').val();
      const payload = JSON.stringify({
        token: this.token,
        status: stat,
      });
      axios.post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/process_rider_invite`, payload, this.config).then(response => {
        this.message = response.data.msg;
        this.responseStatus = false;
        if (this.allocationType === 3) {
          setTimeout(() => {
            if (process.env.VUE_APP_AUTH.includes('test')) {
              window.location.href = 'https://partnertest.sendyit.com/onboarding_portal/#/';
            } else {
              window.location.href = 'https://partner.sendyit.com/onboarding_portal/#/';
            }
          }, 3000);
        }
      });
    },
  },
};
</script>

<style>
</style>
