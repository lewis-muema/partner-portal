<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="pending-tab">
      <div class="truckflow__container-tab">
        <div class="truckflow__container-outer">
          <div class="truckflow__container-search">
            <span class="container__search-input">
              <input
                type="text"
                class="container__search-element"
                id="inp"
                :placeholder="$t('availableOrders.enter_pickup')"
                @input="filterPickup()"
                @keyup.delete="refresh()"
              />
            </span>
            <span class="container__search-input">
              <input
                type="text"
                class="container__search-element"
                id="dst"
                :placeholder="$t('availableOrders.enter_destination')"
                @input="filterDest()"
                @keyup.delete="refresh()"
              />
            </span>
            <span class="container__search-select">
              <select name class="container__search-element select-font" @change="filterVendor()" id="vend" :disabled="!refreshStatus">
                <option value selected> {{ $t('availableOrders.select_truck_type') }} </option>
                <option value="Pick up"> {{ $t('availableOrders.pick_up') }} </option>
                <option value="Van"> {{ $t('availableOrders.van') }} </option>
                <option value="3T Truck">3 {{ $t('availableOrders.tonne_truck') }} </option>
                <option value="5T Truck">5 {{ $t('availableOrders.tonne_truck') }} </option>
                <option value="10T Truck">10 {{ $t('availableOrders.tonne_truck') }}</option>
                <option value="14T Truck">14 {{ $t('availableOrders.tonne_truck') }}</option>
                <option value="20T Truck">20 {{ $t('availableOrders.tonne_truck') }}</option>
                <option value="28T Truck">28 {{ $t('availableOrders.tonne_truck') }}</option>
                <option value="Freight"> {{ $t('availableOrders.freight_truck') }} </option>
              </select>
            </span>
          </div>
          <div class="bids">
            <div id="orders__list-table" class="orders__list-table">
              <div class="orders__list-toprow table-head">
                <div class="orders__col-head pickup">  {{ $t('availableOrders.pickup_location') }} </div>
                <div class="orders__col-head load"> {{ $t('availableOrders.type_of_load') }} </div>
                <div class="orders__col-head destination"> {{ $t('availableOrders.destination') }} </div>
                <div class="orders__col-head distance"> {{ $t('availableOrders.distance') }} </div>
                <div class="orders__col-head pick-date"> {{ $t('availableOrders.pickup_date') }}</div>
                <div class="orders__col-head truck"> {{ $t('availableOrders.truck') }} </div>
                <div class="orders__col-head orderNo"> {{ $t('availableOrders.order_number') }} </div>
                <div class="orders__col-head price-align"> {{ $t('availableOrders.price') }} </div>
                <div class="orders__col-head price-align"> {{ $t('availableOrders.vat') }} </div>
                <div class="orders__col-head bid-in"></div>
                <div class="orders__col-head center-action"> {{ $t('availableOrders.actions') }} </div>
              </div>
              <div class="loading" v-if="loadingStatus"></div>
              <div class="no-records" v-if="!loadingStatus && orders.length === 0">
                <p class="no-records-par"> {{ $t('availableOrders.no_orders') }} </p>
              </div>
              <template v-for="order in orders">
                <div
                  class="orders__list-row"
                  @click="toggle(order.id)"
                  :class="{ opened: opened.includes(order.id) }"
                  v-if="showParentOrdercard(order.id)"
                  :key="order.id"
                >
                  <div class="orders__list-col pickup">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.pickup') }} </p>
                    <p
                      class="row1"
                      @mouseover="showFromTooltip(order.id)"
                      @mouseout="hideFromTooltip(order.id)"
                    >{{ shortFromName(order.id) }}</p>
                    <span
                      :class="`tooltiptext sp${order.id}`"
                    >{{ order.from_name }}, {{ order.start_address }}</span>
                  </div>
                  <div class="orders__list-col load">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.load') }} </p>
                    <p>N/A</p>
                  </div>
                  <div class="orders__list-col destination">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.destination_capital') }}</p>
                    <p
                      class="row2"
                      @mouseover="showToTooltip(order.id)"
                      @mouseout="hideToTooltip(order.id)"
                    >{{ shortToName(order.id) }}</p>
                    <span
                      :class="`tooltiptext sps${order.id}`"
                    >{{ order.to_name }}, {{ order.end_address }}</span>
                  </div>
                  <div class="orders__list-col distance">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.distance') }} </p>
                    <p class="orders__mobile-col--distance">{{ formatDistance(order.id) }} km</p>
                  </div>
                  <div class="orders__list-col pick-date">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.date') }} </p>
                    <p>{{ timeFormat(order.id) }}</p>
                  </div>
                  <div class="orders__list-col truck">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.truck') }} </p>
                    <p class="row3">{{ order.vendorname }}</p>
                  </div>
                  <div class="orders__list-col orderNo">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.order_number') }} </p>
                    <p>{{ order.orderNo }}</p>
                  </div>
                  <div class="orders__list-col price-align">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.price_capital') }} </p>
                    <p
                      v-if="order.bid_status === 0"
                      class="right-align"
                    >{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                    <p
                      v-if="order.bid_status === 1"
                      class="right-align"
                    >{{ order.currency }} {{ bidcurrencyFormat(order.id) }}</p>
                  </div>
                  <div class="orders__list-col price-align">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.vat') }} </p>
                    <p>{{ order.currency }} {{ vatCurrencyFormat(order.id) }}</p>
                  </div>
                  <div class="orders__list-col bid-in">
                    <div :class="`progress-circle small p${timebar(order.id)}`">
                      <div class="td-1">
                        <p class="timePrefix mini">{{ timebarPrefix(order.id) }}</p>
                        <p class="timeSuffix">{{ timebarSuffix(order.id) }}</p>
                      </div>
                      <div class="left-half-clipper">
                        <div class="first50-bar"></div>
                        <div class="value-bar"></div>
                      </div>
                    </div>
                  </div>
                  <div class="orders__list-col center-action uppercase">
                    <p class="orders__mobile-col"> {{ $t('availableOrders.action') }} </p>
                    <button
                      class="orders__confirm-icon button-menu"
                      v-if="order.confirmed === 0 && order.bid_status === 0"
                    > {{ $t('availableOrders.confirm_order') }} </button>
                    <button
                      class="orders__sendquote-icon button-menu"
                      v-if="order.bidPlaced === 0 && order.bid_status === 1 && !opened.includes(order.id)"
                    > {{ $t('availableOrders.send_quote') }} </button>
                    <button
                      class="orders__bidplaced-icon button-menu"
                      v-if="order.bid_status === 1 && order.bidPlaced === 1"
                    > {{ $t('availableOrders.bid_placed') }} </button>
                    <button
                      class="orders__hidedetails-icon button-menu"
                      v-if="order.bidPlaced === 0 && order.bid_status === 1 && opened.includes(order.id)"
                    > {{ $t('availableOrders.hide_details') }}</button>
                    <button
                      class="orders__confirmed-icon button-menu"
                      v-if="order.confirmed === 1"
                    >{{ $t('availableOrders.confirmed') }} </button>
                  </div>
                </div>
                <div
                  v-if="opened.includes(order.id)"
                  :class="`row- ${order.id}`"
                  :key="order.orderNo"
                >
                  <div colspan="8" class="expanded-row">
                    <div class="map-details--go-back" @click="toggle(order.id)">
                      <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
                      <span class="map-details-go-back--span"> {{ $t('availableOrders.back') }} </span>
                    </div>
                    <div class="map__column">
                      <img :src="createStaticMapUrl(order)" class="map" />
                      <div class="map__details-row">
                        <div class="map__details-col">
                          <p class="map__details-pickup heading uppercase"> {{ $t('availableOrders.pickup_location') }} </p>
                          <p class="map__details-pickup par">{{ order.from_name }}</p>
                          <p class="map__details-date heading uppercase"> {{ $t('availableOrders.date_and_time') }}</p>
                          <p class="map__details-date par">{{ timeFormat(order.id) }}</p>
                          <p class="map__details-date heading uppercase"> {{ $t('availableOrders.order_type') }} </p>
                          <p class="map__details-date par capitalize-text" >{{ order.order_type.replace(/_/g, " ") }}</p>
                        </div>
                        <div class="map__details-col">
                          <p class="map__details-dest heading uppercase"> {{ $t('availableOrders.destination') }} </p>
                          <p class="map__details-dest par">{{ order.to_name }}</p>
                          <p class="map__details-distance heading uppercase"> {{ $t('availableOrders.distance') }} </p>
                          <p class="map__details-distance par">{{ order.distance }} km</p>
                        </div>
                      </div>
                    </div>
                    <div class="order__column">
                      <p class="order__weight heading uppercase"> {{ $t('availableOrders.weight_of_orders') }}</p>
                      <p class="order__weight par" v-if="!weight"> {{ $t('availableOrders.not_applicable') }} </p>
                      <p class="order__weight par" v-else>{{ weight }}</p>
                      <p class="order__loader heading uppercase"> {{ $t('availableOrders.loader_needed') }} </p>
                      <p class="order__loader par" v-if="!loaders"> {{ $t('availableOrders.not_applicable') }} </p>
                      <p class="order__loader par" v-else>{{ loaders }}</p>
                      <p class="order__loadtype heading uppercase"> {{ $t('availableOrders.type_of_load') }} </p>
                      <p class="order__loadtype par" v-if="!load"> {{ $t('availableOrders.not_applicable') }} </p>
                      <p class="order__loadtype par" v-else>{{ load }}</p>
                      <p class="order__notes heading uppercase"> {{ $t('availableOrders.notes') }}</p>
                      <p class="order__notes par">{{ orderNotes(order.id) }}</p>
                      <p class="order__notes heading uppercase"> {{ $t('availableOrders.truck') }} </p>
                      <p
                        class="order__notes par"
                      >{{ order.vendorname }}{{ carrierType(order.carrier_type) }}</p>
                    </div>
                    <div class="order__column">
                      <p
                        class="order__amount heading uppercase"
                        v-if="order.bid_status === 0"
                      > {{ $t('availableOrders.amount') }} </p>
                      <p
                        class="order__amount par"
                        v-if="order.bid_status === 0"
                      >{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                      <div v-if="order.confirmed === 0 && order.bidPlaced === 0">
                        <div class="order__bidtimer-duration" v-if="order.bid_status === 1">
                          <span class="order__price-estimate">
                            <p
                              class="order__amount heading uppercase"
                            > {{ $t('availableOrders.minimum_amount_client_to_pay') }} </p>
                            <p
                              class="order__estimate-amount par"
                            >{{ order.currency }} {{ bidcurrencyFormat(order.id) }}</p>
                          </span>
                          <span class="order__price-estimate">
                            <div :class="`progress-circle large p${timebar(order.id)}`">
                              <div class="td-1">
                                <p class="timePrefix">{{ timebarPrefix(order.id) }}</p>
                                <p class="timeSuffix">{{ timebarSuffix(order.id) }}</p>
                              </div>
                              <div class="left-half-clipper">
                                <div class="first50-bar"></div>
                                <div class="value-bar"></div>
                              </div>
                            </div>
                          </span>
                        </div>
                        <div class="order__quote-amount" v-if="order.bid_status === 1">
                          <p class="order__amount heading uppercase"> {{ $t('availableOrders.your_quote') }}</p>
                          <input
                            type="text"
                            class="input orders__bid-input"
                            :placeholder="$t('availableOrders.enter_quote_amount')"
                            @input="confirm(order.id)"
                            v-model="quoteAmount"
                          />
                        </div>
                        <p
                          class="orders__assigndriver heading uppercase"
                        > {{ $t('availableOrders.select_driver_to_assign_order') }} </p>
                        <select
                          class="orders__assigndriver-input par"
                          v-if="!addDriverStatus"
                          v-model="count1"
                          @change="driverSelector(order.id)"
                        >
                          <option class selected value="null"> {{ $t('availableOrders.select_a_driver') }}</option>
                          <option
                            class
                            v-for="rider in riders"
                            :value="rider.count"
                            :key="rider.count"
                          >{{ rider.f_name }} {{ rider.s_name }}</option>
                        </select>
                        <select
                          class="orders__assigndriver-input disabled par"
                          v-if="addDriverStatus"
                          @click="setDriverStatus()"
                          readonly
                        >
                          <option class value selected> {{ $t('availableOrders.select_a_driver') }}  </option>
                        </select>
                        <div class="center-action center-action--lower force-leftalign">
                          <button
                            class="orders__disabled-button"
                            v-if="order.confirmed === 0 && order.bid_status === 0 && buttonDisabledStatus === 0"
                            disabled
                          > {{ $t('availableOrders.confirm_order') }} </button>
                          <button
                            class="orders__confirm-button"
                            @click="sendPayload(order.id)"
                            v-if="order.confirmed === 0 && order.bid_status === 0 && buttonDisabledStatus === 1"
                          >{{ confirmButtonState }}</button>
                          <button
                            class="orders__disabled-button"
                            v-if="order.confirmed === 0 && order.bid_status === 1 && buttonDisabledStatus === 0"
                            disabled
                          > {{ $t('availableOrders.send_quotes') }} </button>
                          <button
                            class="orders__sendquote-button"
                            @click="sendBid(order.id)"
                            v-if="order.confirmed === 0 && order.bid_status === 1 && buttonDisabledStatus === 1"
                          >{{ sendQuoteButtonState }}</button>
                        </div>
                      </div>
                      <div class="center-action center-action--lower force-leftalign">
                        <button
                          class="orders__confirmed-button"
                          v-if="order.confirmed === 1"
                        > {{ $t('availableOrders.confirmed') }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <notify />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import { constants } from 'crypto';
import axios from 'axios';
import moment from 'moment';
import Mixpanel from 'mixpanel';
import notify from '../components/notification';
import timezone from '../mixins/timezone';
import errorHandler from '../components/errorHandler';
import verifier from '../components/verifier';
// import truckValidationMixin from '../mixins/truckValidationMixin';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);
let interval = '';
export default {
  title: 'Partner Portal - Available Orders',
  components: {
    verifier,
    // VueTelInput,
    errorHandler,
    notify,
  },
  mixins: [timezone],
  data() {
    return {
      allVehicles: '',
      auth: process.env.VUE_APP_AUTH,
      opened: [],
      show: false,
      orders: [],
      riders: [],
      vehicles: [],
      addDriverStatus: false,
      addVehicleStatus: false,
      orderNo: null,
      count: null,
      count1: null,
      regNo: null,
      insuNo: null,
      box: '0',
      vendorType: null,
      ownerId: null,
      closed: null,
      driverName: null,
      driverPhone: null,
      riderId: null,
      vehicleId: null,
      ownerPhone: null,
      DL: null,
      ID: null,
      refrigirated: null,
      partnerVendor: null,
      message: null,
      error: null,
      load: null,
      loaders: null,
      notes: null,
      weight: null,
      regOk: null,
      insuOk: null,
      driverNameOk: null,
      IDOk: null,
      DLOk: null,
      drivePhoneOk: null,
      newVehicle: false,
      newRider: false,
      vehiclePayload: [],
      riderPayload: [],
      pick: [],
      confirmButtonState: this.$t('availableOrders.confirm_order'),
      sendQuoteButtonState: this.$t('availableOrders.send_quote'),
      getRiderz: 0,
      getVehiclez: 0,
      quoteAmount: null,
      buttonDisabledStatus: 0,
      responseCount: 0,
      notificationName: '',
      loadingStatus: true,
      fetchOrderStatus: false,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('availableOrders.driver_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['KE', 'UG', 'TZ'],
        onlyCountries: [],
        ignoredCountries: [],
        autocomplete: 'off',
        name: 'phone',
        maxLen: 14,
        wrapperClasses: '',
        inputClasses: '',
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      errorObj: '',
      vehicleCounter: '',
      orderCount: 0,
      refreshStatus: false,
    };
  },
  computed: {},
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchOwnerDrivers().then(res1 => {
        this.fetchOwnerVehicles().then(res2 => {
          this.getOrders();
        });
      });
    }
  },
  beforeDestroy() {
    clearInterval(interval); // stop the interval
  },
  destroyed() {
    if (localStorage.token && !['orders', 'pending', 'quotes'].includes(this.$route.name) && this.sessionInfo.super_user) {
      this.$router.push('/');
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    setDriverStatus() {
      this.addDriverStatus = false;
    },
    setVehicleStatus() {
      this.addVehicleStatus = false;
    },
    regcounter(id) {
      this.regOk = id;
    },
    carrierType(id) {
      if (id === 0) {
        return ', Open';
      } else if (id === 1) {
        return ', Closed';
      } else if (id === 2) {
        return '';
      }
    },
    fetchOwnerDrivers() {
      return new Promise((resolve, reject) => {
        const riders = [];
        const riderPayload = {
          owner_id: this.sessionInfo.id,
        };
        const parsedData = JSON.parse(localStorage.sessionData);
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
          .then(res => {
            res.data.riders.forEach((row, i) => {
              riders.push(row);
            });
            parsedData.payload.riders = riders;
            localStorage.sessionData = JSON.stringify(parsedData);
            resolve(res);
          })
          .catch(error => {
            parsedData.payload.riders = [];
            localStorage.sessionData = JSON.stringify(parsedData);
            resolve(error);
          });
      });
    },
    fetchOwnerVehicles() {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        axios
          .post(`${this.auth}partner/v1/partner_portal/vehicles`, payload, this.config)
          .then(response => {
            this.allVehicles = response.data.vehicles;
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    displayVehicles(id) {
      if (parseInt(this.vehicles[id].vendor_type, 10) === 25) {
        return `(${this.vehicles[id].load_capacity} Tonnes)`;
      } else if (this.vehicles[id].make !== null && this.vehicles[id].make !== '') {
        return `(${this.vehicles[id].make} ${this.vehicles[id].model})`;
      } else {
        return '';
      }
    },
    createStaticMapUrl(path) {
      const google_key = process.env.GOOGLE_API_KEY;
      const from_cordinates = path.from;
      const to_cordinates = path.to;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=500x200&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
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
    orderNotes(id) {
      if (this.orders[id - 1].orderNotes && this.orders[id - 1].orderNotes !== 'none') {
        return this.orders[id - 1].orderNotes.slice(7, 10000);
      } else {
        return 'No notes';
      }
    },
    timer(id) {
      const orderTime = this.orders[id - 1].orderTime;
      return this.formatedTimer(orderTime);
    },
    timebar(id) {
      const timer1 = this.timer(id);
      if (timer1.includes('ago')) {
        return '';
      } else {
        const timer2 = timer1.slice(3, 20);
        const timevalue = parseInt(timer2.split(' ')[0], 10);
        if (timevalue > 30) {
          return `${timevalue} over50`;
        } else {
          return timevalue;
        }
      }
    },
    timebarPrefix(id) {
      const timer1 = this.timer(id);
      if (timer1.includes('ago')) {
        return '';
      } else if (timer1.includes('in a')) {
        return 1;
      } else {
        const timer2 = timer1.slice(3, 20);
        return parseInt(timer2.split(' ')[0], 10);
      }
    },
    timebarSuffix(id) {
      const timer1 = this.timer(id);
      if (timer1.includes('ago')) {
        return '';
      } else {
        const timer2 = timer1.slice(3, 20);
        return `${timer2.split(' ')[1]} left`;
      }
    },
    timeFormat(id) {
      const orderTime = this.orders[id - 1].orderTime;
      return this.formatedTime(orderTime);
    },
    vatCurrencyFormat(id) {
      if (this.orders[id - 1].vat_amount) {
        const amount = this.orders[id - 1].vat_amount;
        return amount
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
          .split('.')[0];
      } else {
        return 0;
      }
    },
    currencyFormat(id) {
      const amount = this.orders[id - 1].takeHome;
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
    },
    bidcurrencyFormat(id) {
      if (this.orders[id - 1].min_amount) {
        const amount = this.orders[id - 1].min_amount;
        return amount
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
          .split('.')[0];
      } else {
        return 0;
      }
    },
    formatDistance(id) {
      const distance = this.orders[id - 1].distance;
      return Math.round(distance);
    },
    shortFromName(id) {
      if (this.orders[id - 1].from_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].from_name.substr(0, this.orders[id - 1].from_name.indexOf(','));
        if (name.length > 20) {
          return `${name.slice(0, 20)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].from_name.length > 20) {
          return `${this.orders[id - 1].from_name.slice(0, 20)}. . `;
        } else {
          return this.orders[id - 1].from_name;
        }
      }
    },
    shortToName(id) {
      if (this.orders[id - 1].to_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].to_name.substr(0, this.orders[id - 1].to_name.indexOf(','));
        if (name.length > 20) {
          return `${name.slice(0, 20)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].to_name.length > 20) {
          return `${this.orders[id - 1].to_name.slice(0, 20)}. . `;
        } else {
          return this.orders[id - 1].to_name;
        }
      }
    },
    toggle(id) {
      this.getRiderz = 0;
      this.riders = [];
      this.getRiders(id);
      this.getVehiclez = 0;
      this.vehicles = [];
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.splice(index, 1); // this allows you to open only one tab at a time.
        this.opened.push(id);
      }
      this.addDriverStatus = false;
      this.addVehicleStatus = false;
      this.count = null;
      this.count1 = null;
      this.quoteAmount = null;
      this.driverSelector(id);
      this.vendorType = this.orders[id - 1].vendor_type;
      this.ownerId = this.sessionInfo.id;
      this.closed = this.orders[id - 1].carrier_type;
      this.orderNo = this.orders[id - 1].order_no;
      this.newRider = false;
      this.newVehicle = false;
      this.partnerVendor = null;
      if (this.orders[id - 1].package_details) {
        this.weight = this.orders[id - 1].package_details.load_weight ? `${this.orders[id - 1].package_details.load_weight} ${this.orders[id - 1].package_details.load_units}` : 'No weight provided';
        this.loaders = this.orders[id - 1].package_details.no_of_loaders ? this.orders[id - 1].package_details.no_of_loaders : 'N/A';
        this.load = this.orders[id - 1].package_details.delivery_item ? this.orders[id - 1].package_details.delivery_item : 'N/A';
      } else {
        this.weight = null;
        this.loaders = null;
        this.load = null;
        this.notes = null;
      }
    },
    confirm(id) {
      if (this.orders[id - 1].bid_status === 1) {
        // if the order bidding
        if (this.quoteAmount >= this.orders[id - 1].min_amount) {
          this.buttonDisabledStatus = 1;
        } else {
          this.buttonDisabledStatus = 0;
        }
      } else {
        if (this.riderId) {
          this.buttonDisabledStatus = 1;
        } else {
          this.buttonDisabledStatus = 0;
        }
      }
    },
    sendPayload(id) {
      this.confirmButtonState = this.$t('availableOrders.confirming_order');
      const index = this.count1;
      const payload = JSON.stringify({
        sim_card_sn: this.riders[index].password,
        rider_phone: this.riders[index].phone_no,
        order_no: this.orders[id - 1].orderNo,
        version_code: 19999,
      });
      axios
        .post(`${this.auth}/orders/rider_app_confirm_surge`, payload, this.config)
        .then(response => {
          this.notify(3, 1, response.data.reason);
          this.opened = [];
          this.orders = [];
          this.TrackOrderConfirmation(payload);
          clearInterval(interval); // stop the interval
          this.loadingStatus = true;
          this.getOrders();
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.confirmButtonState = this.$t('availableOrders.confirm_order');
            this.notify(3, 0, `${error.response.data.reason}`);
          }
        });
    },
    sendBid(id) {
      this.sendQuoteButtonState = this.$t('availableOrders.sending_quote');
      const vehicleIndex = this.riders[this.count1].vehicle_no;
      const payload = JSON.stringify({
        vehicle_details: {
          new_vehicle: this.newVehicle,
          vehicle_id: this.allVehicles[vehicleIndex].vehicle.id,
          owner_id: this.sessionInfo.id,
        },
        rider_details: {
          new_rider: this.newRider,
          rider_id: this.riders[this.count1].rider_id,
          vendor_type: this.allVehicles[vehicleIndex].vendor_type,
          owner_id: this.sessionInfo.id,
        },
        bid_details: {
          order_no: this.orders[id - 1].orderNo,
          amount: this.quoteAmount,
          owner_id: this.sessionInfo.id,
          rider_id: this.riders[this.count1].rider_id,
        },
      });
      axios
        .post(`${this.auth}v1/place_order_bid/`, payload, this.config)
        .then(response => {
          this.sendQuoteButtonState = this.$t('availableOrders.adjust_quote');
          if (response.data.status) {
            this.notify(3, 1, response.data.message);
            this.opened = [];
            this.orders = [];
            this.trackSendBid(payload);
            clearInterval(interval); // stop the interval
            this.loadingStatus = true;
            this.getOrders();
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.sendQuoteButtonState = this.$t('availableOrders.adjust_quote');
            this.notify(3, 1, `${error.response.data.message}`);
          }
        });
    },
    driverSelector(id) {
      const q = this.count1;
      if (this.count1 === null || this.count1 === 'null') {
        this.regNo = null;
        this.insuNo = null;
        this.driverName = null;
        this.driverPhone = '';
        this.riderId = null;
        this.refrigirated = null;
      } else {
        this.driverName = `${this.riders[q].f_name} ${this.riders[q].s_name}`;
        this.driverPhone = this.riders[q].phone_no;
        this.riderId = this.riders[q].rider_id;
      }
      setTimeout(() => {
        this.confirm(id);
      }, 200);
    },
    isMobile() {
      let check = false;
      (a => {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    showParentOrdercard(order_id) {
      return !(this.opened.includes(order_id) && this.isMobile());
    },
    filterPickup() {
      const input = document.getElementById('inp').value.toLowerCase();
      document.querySelectorAll('.row1').forEach(row1 => {
        const classer = row1.parentNode;
        const searched = row1.innerHTML.toLowerCase();
        if (searched.indexOf(input) > -1) {
          const emptyVal = 0;
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    filterDest() {
      const input1 = document.getElementById('dst').value.toLowerCase();
      document.querySelectorAll('.row2').forEach(row2 => {
        const classer = row2.parentNode;
        const searched = row2.innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          const emptyVal = 0;
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    filterVendor() {
      this.refresh();
      const input1 = document.getElementById('vend').value.toLowerCase();
      document.querySelectorAll('.row3').forEach(row3 => {
        const classer = row3.parentNode;
        const searched = row3.innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          const nothing = 0;
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    refresh() {
      document.querySelectorAll('.orders__list-row').forEach(row => {
        row.style.display = 'grid';
      });
      const inputInp = document.getElementById('inp').value.toLowerCase();
      const inputDst = document.getElementById('dst').value.toLowerCase();
      const inputVend = document.getElementById('vend').value.toLowerCase();
      document.querySelectorAll('.row1').forEach((row1, i) => {
        const classer = row1.parentNode;
        const searchedInp = row1.innerHTML.toLowerCase();
        const searchedDst = document.querySelectorAll('.row2')[i].innerHTML.toLowerCase();
        const searchedVend = document.querySelectorAll('.row3')[i].innerHTML.toLowerCase();
        if (searchedInp.indexOf(inputInp) > -1 && searchedDst.indexOf(inputDst) > -1 && searchedVend.indexOf(inputVend) > -1) {
          const emptyVal = 0;
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    getRiders(id) {
      this.allVehicles.forEach((row, v) => {
        if (row.rider) {
          if (this.orders[id - 1].eligible_partners.includes(row.rider.rider_id)) {
            row.rider.count = this.riders.length;
            row.rider.vehicle_no = v;
            this.riders.push(row.rider);
          }
        }
      });
    },
    refreshOrders() {
      interval = setInterval(() => {
        let order = '';
        let openid = '';
        if (this.opened[0]) {
          openid = this.opened[0];
          order = this.orders[openid - 1].orderNo;
        }
        this.ownerPhone = this.sessionInfo.phone;
        axios
          .get(`${this.auth}partner-api/parcel/available_orders/${this.sessionInfo.id}`, this.config)
          .then(response => {
            const unescaped = response.data;
            this.orders = [];
            unescaped.reverse().forEach((row, i) => {
              this.orders.push(this.populateOrders(row, i));
              if (order === row.orderno) {
                this.opened = [];
                this.opened.push(i + 1);
              }
            });
          })
          .catch(error => {
            this.errorObj = error.response;
            this.orders = [];
            this.opened = [];
          });
      }, 60000);
    },
    getOrders() {
      this.ownerPhone = this.sessionInfo.phone;
      axios
        .get(`${this.auth}partner-api/parcel/available_orders/${this.sessionInfo.id}`, this.config)
        .then(response => {
          const unescaped = response.data;
          unescaped.reverse().forEach((row, i) => {
            this.orders.push(this.populateOrders(row, i));
            this.loadingStatus = false;
          });
          if (this.$route.path === '/') {
            this.refreshOrders();
            this.refreshStatus = true;
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.orders = [];
          this.opened = [];
          if (this.$route.path === '/') {
            this.refreshOrders();
            this.refreshStatus = true;
          }
          if (error.response) {
            this.loadingStatus = false;
          }
        });
    },
    populateOrders(row, i) {
      const orderno = row.order_no;
      const time = row.date_time;
      const fromcity = row.from_city;
      const variance = row.price_variance;
      const tocity = row.to_city;
      const vendorname = row.vendor_disp_name;
      const fixedcost = row.fixed_cost;
      const takehome = row.take_home;
      const orderDetails = row.order_details.values;
      if (row.order_notes.length > 0) {
        orderDetails.orderNotes = row.order_notes[0].msg;
      }
      if (row.customer_min_amount) {
        orderDetails.bid_status = 1;
        orderDetails.min_amount = row.min_take_home;
      } else {
        orderDetails.bid_status = 0;
      }
      orderDetails.id = i + 1;
      orderDetails.currency = row.order_currency;
      orderDetails.fixedCost = fixedcost;
      orderDetails.vendorname = vendorname;
      orderDetails.fromCity = fromcity;
      orderDetails.toCity = tocity;
      orderDetails.bidPlaced = 0;
      orderDetails.confirmed = 0;
      orderDetails.orderTime = time;
      orderDetails.takeHome = takehome;
      orderDetails.orderNo = orderno;
      orderDetails.vat_amount = row.vat_amount;
      orderDetails.eligible_partners = row.eligible_partners;
      orderDetails.distance = orderDetails.distance_read;
      orderDetails.order_type = row.order_details.dedicated_order_details ? row.order_details.dedicated_order_details.order_type_tag : 'normal_order';
      return orderDetails;
    },
    TrackOrderConfirmation(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Order Confirmation Web', JSON.parse(payload));
      }
    },
    trackSendBid(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Order Bidding Web', JSON.parse(payload));
      }
    },
  },
};
</script>

<style>
p {
  font-size: 13px;
  color: #666;
}
a {
  color: rgb(154, 172, 192);
}

.validation-error--message {
  color: #EE7D00;
}
.capitalize-text {
  text-transform: capitalize;
}
</style>
