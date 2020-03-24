<template>
  <div>
    <div class="driverRequest__request-outer" v-if="message">
      <div class>
        <div class="driverRequest__request-text">
          <span class="driverRequest__toCap">{{ message }}</span>
        </div>
        <div
          class="driverRequest__request-options"
          v-if="responseStatus && allocationStatus === 1"
        >
          <div class="driverRequest__request-radio">
            <input type="radio" name="choice" value="1" v-model="statValue" id="req-accept" />
            <span>Accept</span>
          </div>
          <div class="driverRequest__request-radio">
            <input type="radio" name="choice" value="2" v-model="statValue" id="req-reject" />
            <span>Reject</span>
          </div>
        </div>
        <div
          class="driverRequest__request-submit"
          v-if="responseStatus && allocationStatus === 1"
        >
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
import $ from 'jquery';
import axios from 'axios';

export default {
  title: 'Driver Request',
  data() {
    return {
      token: '',
      message: '',
      allocationType: '',
      allocationStatus: '',
      responseStatus: false,
      detailsStatus: '',
      statValue: false,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
    };
  },
  created() {
    this.fetchDriverRequest();
  },
  methods: {
    fetchDriverRequest() {
      if (this.$route.params.token !== undefined) {
        const payload = JSON.stringify({
          token: this.$route.params.token,
        });
        axios.post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/allocation_details`, payload, this.config).then(response => {
          if (response.data.status) {
            this.responseStatus = true;
            this.allocationType = response.data.data.allocation_details[0].allocation_type;
            this.allocationStatus = response.data.data.allocation_details[0].allocation_status;
            this.token = response.data.data.allocation_details[0].token;
            if (this.allocationStatus === 1) {
              let vehicleModel = '';
              let vehicleRegistration = '';
              if (response.data.data.vehicle_details.model) {
                vehicleModel = response.data.data.vehicle_details.model;
              }
              if (response.data.data.vehicle_details.registration_no) {
                vehicleRegistration = response.data.data.vehicle_details.registration_no;
              }
              this.message = `${response.data.data.owner_details.name} has invited you to drive their ${vehicleModel} : ${vehicleRegistration} on Sendy`;
            } else if (this.allocationStatus === 2) {
              this.message = 'Rider invite accepted';
            } else if (this.allocationStatus === 3) {
              this.message = 'Rider invite rejected';
            }
          } else {
            this.message = response.data.msg;
          }
        }).catch((err) => {
          this.message = err.response.data.message;
        });
      } else {
        this.message = 'The link is invalid, Please ask the owner to re-invite you';
      }
    },
    submitResponse() {
      const stat = this.statValue;
      const payload = JSON.stringify({
        token: this.token,
        status: parseInt(stat, 10),
      });
      axios.post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/process_rider_invite`, payload, this.config).then(response => {
        this.message = response.data.message;
        this.responseStatus = false;
        if (this.allocationType === 3) {
          setTimeout(() => {
            window.location.href = process.env.ONBOARDING_PORTAL;
          }, 3000);
        }
      }).catch(error => {
        this.message = error.response.data.message;
        this.responseStatus = false;
      });
    },
  },
};
</script>

<style>
</style>
