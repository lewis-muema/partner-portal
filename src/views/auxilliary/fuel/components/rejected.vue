<template>
  <div class="declined-requests-containers" v-loading="loadingStatus">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="declined-requests-tabs"
    >
      <div class="declined-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="declined-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="declined-requests-driver-photo"
        />
        <div class="declined-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="pending-requests-driver-name">
          {{ order.driver_details.vehicle_no }}
        </div>
        <div class="declined-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="declined-requests-actions">
        <div class="declined-requests-actions-menu">
          <div
            class="declined-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'details'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'details')"
          >
            {{ $t('fuelPending.details') }}
          </div>
          <div
            class="declined-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'reason' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'reason')"
          >
            {{ $t('fuelPending.reason') }}
          </div>
        </div>
        <div class="declined-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="declined-requests-actions-table-header">
              <div class="declined-requests-standard-column-adv">DD/TT</div>
              <div class="declined-requests-large-column-adv">{{ $t('fuelPending.order') }}</div>
              <div class="declined-requests-standard-column-adv">{{ $t('fuelPending.amount') }}</div>
              <div class="declined-requests-standard-column-adv">{{ $t('fuelPending.station') }}</div>
              <div class="declined-requests-standard-column-adv">{{ $t('fuelPending.fuel_type') }}</div>
              <div class="declined-requests-standard-column-adv">
                {{ $t('fuelPending.order_type') }}
              </div>
              <div class="declined-requests-standard-column-adv">
                {{ $t('fuelPending.percentage') }}
              </div>
            </div>
            <div class="declined-requests-actions-table-body">
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ dateFormat(order) }}
              </div>
              <div class="declined-requests-large-column-adv">
                <div class="declined-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="declined-requests-pickup">
                  <div class="declined-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="declined-requests-destination">
                  <div class="declined-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'reason'"
            class="declined-requests-owner-container"
          >
            <div class="declined-requests-owner-sections">
              <div class="declined-requests-owner-details">
                <span class="declined-requests-owner-label" v-if="order.owner_details.reason">{{
                  order.owner_details.reason
                }}</span>
                <span class="declined-requests-owner-label" v-else-if="order.admin_details.reason">
                  {{ order.admin_details.reason }}
                </span>
                <span v-else>
                  {{ $t('fuelPending.no_reason_given') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="orders.length === 0 && !loadingStatus" class="no-requests-tab">
      {{ $t('fuelPending.no_requests') }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import errorHandler from '../../../../components/errorHandler.vue';
import verifier from '../../../../components/verifier.vue';

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
          'Accept-Language': localStorage.getItem('language'),
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
    dateFormat(order) {
      if (order.owner_details.owner_approval_date) {
        return moment(order.owner_details.owner_approval_date).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      }
      return moment(order.request_details.date_time).format(
        'YYYY-MM-DD HH:mm:ss',
      );
    },
    getFuelAdvances() {
      return new Promise((resolve, reject) => {
        const oldOrders = this.orders;
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-advances?owner_id=${this.sessionInfo.id}&declined=1`, this.config)
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
