<template>
  <div class="approved-requests-containers" v-loading="loadingStatus">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="approved-requests-tabs"
    >
      <div class="approved-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="approved-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="approved-requests-driver-photo"
        />
        <div class="approved-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="pending-requests-driver-name">
          {{ order.driver_details.vehicle_no }}
        </div>
        <div class="approved-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="approved-requests-actions">
        <div class="approved-requests-actions-menu">
          <div
            class="approved-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'details'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'details')"
          >
            Details
          </div>
        </div>
        <div class="approved-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="approved-requests-actions-table-header">
              <div class="approved-requests-standard-column-adv">Date</div>
              <div class="approved-requests-large-column-adv">Order</div>
              <div class="approved-requests-standard-column-adv">Amount</div>
              <div class="approved-requests-standard-column-adv">Station</div>
              <div class="approved-requests-standard-column-adv">Fuel type</div>
              <div class="approved-requests-standard-column-adv">
                Order type
              </div>
              <div class="approved-requests-standard-column-adv">
                Percentage
              </div>
            </div>
            <div class="approved-requests-actions-table-body">
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ dateFormat(order.owner_details.owner_approval_date) }}
              </div>
              <div class="approved-requests-large-column-adv">
                <div class="approved-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="approved-requests-pickup">
                  <div class="approved-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="approved-requests-destination">
                  <div class="approved-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="orders.length === 0 && !loadingStatus" class="no-requests-tab">
      There are no requests
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import errorHandler from '../../../../components/errorHandler';
import verifier from '../../../../components/verifier';

let timer = '';

export default {
  components: {
    errorHandler,
    verifier,
  },
  data() {
    return {
      orders: [],
      loadingStatus: false,
      auth: process.env.VUE_APP_AUTH,
      errorObj: '',
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      pollActive: false,
    };
  },
  watch: {
    orders: {
      handler(val) {
        // console.log(val);
      },
      deep: true,
    },
    pollActive(val) {
      if (val) {
        this.poll();
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.loadingStatus = true;
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.getFuelAdvances();
      this.pollActive = true;
    }
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  methods: {
    changeTab(index, data) {
      this.orders[index].activeMenuTab = data;
    },
    thousandsSeparator(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    getFuelAdvances() {
      return new Promise((resolve, reject) => {
        const oldOrders = this.orders;
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-advances?owner_id=${this.sessionInfo.owner_id}&approved=1`, this.config)
            .then(response => {
              if (response.status === 200) {
                const rawData = response.data.data;
                rawData.forEach((row, i) => {
                  row.activeMenuTab = oldOrders.length > 0 && oldOrders.length > i ? oldOrders[i].activeMenuTab : 'details';
                  row.request_details.order_type = row.request_details.order_type.charAt(0).toUpperCase() + row.request_details.order_type.slice(1).split('_')[0];
                });
                this.loadingStatus = false;
                this.orders = rawData;
              }
            resolve(response);
            })
            .catch(error => {
              this.loadingStatus = false;
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    poll() {
      if (this.pollActive) {
        timer = setTimeout(() => {
          this.getFuelAdvances();
          this.poll();
        }, 60000);
      }
    },
  },
};
</script>

<style></style>
