<template>
  <div :class="orders.length > 0 ? 'place-request-container' : ''">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="orders__list-toprow table-head">
      <div class="orders__col-head pickup">{{ $t('placeRequest.pickup_location') }}</div>
      <div class="orders__col-head destination">{{ $t('placeRequest.destination') }}</div>
      <div class="orders__col-head distance">{{ $t('placeRequest.distance') }}</div>
      <div class="orders__col-head pick-date">{{ $t('placeRequest.pickup_date') }}</div>
      <div class="orders__col-head orderNo">{{ $t('placeRequest.order_number') }}</div>
      <div class="orders__col-head truck">{{ $t('placeRequest.truck') }}</div>
      <div class="orders__col-head orderNo">{{ $t('placeRequest.price') }}</div>
      <div class="orders__col-head price-align">{{ $t('placeRequest.vat') }}</div>
      <div class="orders__col-head center-action">{{ $t('placeRequest.action') }}</div>
    </div>
    <div :class="orders.length === 0 ? 'container-height-override' : ''" v-loading="loadingStatus">
      <div v-for="(order, index) in orders" :key="index">
      <div
        class="orders__list-row"
        @click="toggle(index)"
      >
        <div class="orders__list-col pickup">
          <p class="orders__mobile-col">{{ $t('placeRequest.pickup') }}</p>
          <p
            class="row1"
            @mouseover="showFromTooltip(index)"
            @mouseout="hideFromTooltip(index)"
          >{{ shortFromName(index) }}</p>
          <span
            :class="`tooltiptext sp${index}`"
          >{{ order.order_details.pick_up }}</span>
        </div>
        <div class="orders__list-col destination">
          <p class="orders__mobile-col">{{ $t('placeRequest.destination_capital') }}</p>
          <p
            class="row2"
            @mouseover="showToTooltip(index)"
            @mouseout="hideToTooltip(index)"
          >{{ shortToName(index) }}</p>
          <span
            :class="`tooltiptext sps${index}`"
          >{{ order.order_details.destination }}</span>
        </div>
        <div class="orders__list-col distance">
          <p class="orders__mobile-col">{{ $t('placeRequest.distance') }}</p>
          <p class="orders__mobile-col--distance">{{ formatDistance(index) }} km</p>
        </div>
        <div class="orders__list-col pick-date">
          <p class="orders__mobile-col">{{ $t('placeRequest.pick_up_date') }}</p>
          <p>{{ timeFormat(index) }}</p>
        </div>
        <div class="orders__list-col orderNo">
          <p class="orders__mobile-col">{{ $t('placeRequest.order_number') }}</p>
          <p>{{ order.order_details.order_no }}</p>
        </div>
        <div class="orders__list-col truck">
          <p class="orders__mobile-col">{{ $t('placeRequest.vendor') }}</p>
          <p class="row3">{{ order.order_details.vendor }}</p>
        </div>

        <div class="orders__list-col orderNo">
          <p class="orders__mobile-col">{{ $t('placeRequest.amount') }}</p>
          <p>{{ order.order_details.currency }} {{ currencyFormat(index) }}</p>
        </div>
        <div class="orders__list-col price-align">
          <p class="orders__mobile-col">{{ $t('placeRequest.vat') }}</p>
          <p>{{ order.order_details.currency }} {{ order.order_details.vat ? order.order_details.vat : 0 }}</p>
        </div>
        <div class="orders__list-col center-action uppercase">
          <span>
            <p class="orders__confirm-icon in-transitButton orders__buttons">{{ $t('placeRequest.in_transit') }}</p>
          </span>
          <span>
            <i class="material-icons icon arrow in-transitButton" v-if="opened.includes(index)">keyboard_arrow_down</i>
            <i class="material-icons icon arrow in-transitButton" v-if="!opened.includes(index)">keyboard_arrow_right</i>
          </span>
        </div>
      </div>
      <div v-if="opened.includes(index)">
        <div class="place-request-inputs-container">
          <div class="place-request-inputs-header">
            {{ $t('placeRequest.maximum_of') }} {{ order.order_details.currency }} {{ parseFloat(order.max_advance).toFixed(2) }}
          </div>
          <div>
            {{ $t('placeRequest.total_amount') }} <br />
            <el-input
              type="text"
              class="place-request-inputs"
              v-model="amount"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
            >
              <template class="pricing-prepend" slot="prepend">
                {{ order.order_details.currency }}
              </template>
            </el-input>
          </div>
          <div>
            {{ $t('placeRequest.choose_fueling_station') }}<br />
            <el-select
              class="place-request-inputs"
              v-model="station"
              name="" id="fuel-station"
            >
              <el-option
                :value="station.station_name"
                v-for="(station, index) in stations"
                :key="index"
                :label="station.station_name"
              >{{ station.station_name }}</el-option>
            </el-select>
          </div>
          <div>
           {{ $t('placeRequest.station_address') }}<br />
            <el-select
              class="place-request-inputs"
              v-model="address"
              name=""
              id="station-address"
            >
              <el-option
                :value="address.id"
                v-for="(address, index) in addresses"
                :key="index"
                :label="address.name"
              >{{ address.name }}</el-option>
            </el-select>
          </div>
          <div>
            {{ $t('placeRequest.fuel_type') }} <br />
            <el-select
              class="place-request-inputs"
              v-model="fuel"
              name=""
              id="fuel-type"
            >
              <el-option
                :value="fuel.id"
                v-for="(fuel, index) in fuel_types"
                :key="index"
                :label="fuel.name"
              >{{ fuel.name }}</el-option>
            </el-select>
          </div>
          <div class="place-request-button-container">
            <button :class="submitStatus && !loading ? 'fuel-request-reason-button-active' : 'fuel-request-reason-button-inactive'" class="place-request-button" v-loading="loading" @click="submitFuelAdvance(index)">Confirm request</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="orders.length === 0 && !loadingStatus" class="no-requests-tab">
      {{ $t('placeRequest.no_requests') }}
    </div>
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import timezone from '../../../../mixins/timezone';
import notify from '../../../../components/notification.vue';
import errorHandler from '../../../../components/errorHandler.vue';
import verifier from '../../../../components/verifier.vue';

let timer = '';

export default {
  components: {
    notify,
    errorHandler,
    verifier,
  },
  mixins: [timezone],
  data() {
    return {
      orders: [],
      stations: [],
      fuel_types: [],
      auth: process.env.VUE_APP_AUTH,
      loadingStatus: false,
      fuel: '',
      station: '',
      addresses: [],
      address: '',
      opened: [],
      amount: '',
      rowIndex: '',
      loading: false,
      sessionInfo: '',
      errorObj: '',
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
  computed: {
    submitStatus() {
      if (this.fuel && this.station && this.address && parseInt(this.amount, 10) > 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    station(val) {
      if (val !== '') {
        this.getStationAddresses(val);
      }
    },
    amount(val) {
      this.amount = parseFloat(val) > parseFloat(this.orders[this.rowIndex].max_advance) ? this.orders[this.rowIndex].max_advance : val;
      if (
        val.toString().split('.').length > 2
        || (val.toString().split('.').length === 2
          && val.toString().split('.')[1].length >= 2)
      ) {
        const formatted = parseFloat(val).toFixed(2);
        this.amount = formatted;
      }
    },
    pollActive(val) {
      if (val) {
        this.poll();
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.loadingStatus = true;
      this.getFuelStations();
      this.getFuelTypes();
      this.getLegibleOrders();
      this.pollActive = true;
    }
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    toggle(id) {
      this.rowIndex = id;
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.splice(index, 1); // this allows you to open only one tab at a time.
        this.opened.push(id);
        this.fuel = '';
        this.station = '';
        this.amount = '';
        this.address = '';
      }
    },
    getStationAddresses(station) {
      this.addresses = this.stations.find(stn => (
          stn.station_name === station
        )).station_addresses;
    },
    showFromTooltip(id) {
      const tooltiprow = document.querySelector(`.sp${id}`);
      tooltiprow.style.display = 'block';
    },
    hideFromTooltip(id) {
      const tooltiprow = document.querySelector(`.sp${id}`);
      tooltiprow.style.display = 'none';
    },
    showToTooltip(id) {
      const tooltiprow = document.querySelector(`.sps${id}`);
      tooltiprow.style.display = 'block';
    },
    hideToTooltip(id) {
      const tooltiprow = document.querySelector(`.sps${id}`);
      tooltiprow.style.display = 'none';
    },
    shortFromName(id) {
      if (this.orders[id].order_details.pick_up.indexOf(',') > -1) {
        const name = this.orders[id].order_details.pick_up.substr(0, this.orders[id].order_details.pick_up.indexOf(','));
        if (name.length > 20) {
          return `${name.slice(0, 20)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id].order_details.pick_up.length > 20) {
          return `${this.orders[id].order_details.pick_up.slice(0, 20)}. . `;
        } else {
          return this.orders[id].order_details.pick_up;
        }
      }
    },
    shortToName(id) {
      if (this.orders[id].order_details.destination.indexOf(',') > -1) {
        const name = this.orders[id].order_details.destination.substr(0, this.orders[id].order_details.destination.indexOf(','));
        if (name.length > 20) {
          return `${name.slice(0, 20)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id].order_details.destination.length > 20) {
          return `${this.orders[id].order_details.destination.slice(0, 20)}. . `;
        } else {
          return this.orders[id].order_details.destination;
        }
      }
    },
    formatDistance(id) {
      const distance = this.orders[id].order_details.distance.toString();
      const num = distance.replace(/\D+$/g, '');
      return Math.round(num);
    },
    timeFormat(id) {
      const orderTime = this.orders[id].order_details.pickup_date;
      return this.formatedTime(orderTime);
    },
    currencyFormat(id) {
      const amount = this.orders[id].order_details.price.toString();
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
    },
    getFuelStations() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-stations?country_code=${this.sessionInfo.country_code.toLowerCase()}`, this.config)
            .then(response => {
              if (response.status === 200) {
                this.stations = response.data.data;
              }
            resolve(response);
            })
            .catch(error => {
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    getFuelTypes() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-types`, this.config)
            .then(response => {
              if (response.status === 200) {
                this.fuel_types = response.data.data;
              }
            resolve(response);
            })
            .catch(error => {
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    getLegibleOrders() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/legible-orders/${this.sessionInfo.id}`, this.config)
            .then(response => {
              this.loadingStatus = false;
              if (response.status === 200) {
                const legibleOrders = [];
                response.data.data.forEach(row => {
                  if (parseFloat(row.max_advance) > 0) {
                    legibleOrders.push(row);
                  }
                });
                this.orders = legibleOrders;
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
          this.getLegibleOrders();
          this.poll();
        }, 60000);
      }
    },
    submitFuelAdvance(id) {
      return new Promise((resolve, reject) => {
        const payload = {
          order_no: this.orders[id].order_details.order_no,
          fuel_station_id: this.address,
          account_type_id: 5,
          fuel_type: this.fuel,
          amount: parseFloat(this.amount),
        };
        this.loading = true;
        axios
            .post(`${this.auth}adonis/aux/fuel/fuel-advance`, payload, this.config)
            .then(response => {
              this.loading = false;
              if (response.status === 200) {
                this.notify(3, 1, response.data.message);
                this.fuel = '';
                this.station = '';
                this.amount = '';
                this.address = '';
              }
            resolve(response);
            })
            .catch(error => {
              this.loading = false;
              this.notify(3, 0, error.response.data.message);
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
  },
};
</script>

<style>

</style>
