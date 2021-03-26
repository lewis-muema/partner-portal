<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab">
      <div class="truckflow__container-outer">
        <div class="truckflow__container-search">
          <span class="container__search-input">
            <input
              type="text"
              class="container__search-element"
              id="inp"
              :placeholder="$t('pending.enter_pickup')"
              @input="filterPickup()"
              @keyup.delete="refresh()"
            />
          </span>
          <span class="container__search-input">
            <input
              type="text"
              class="container__search-element"
              id="dst"
              :placeholder="$t('pending.enter_destination')"
              @input="filterDest()"
              @keyup.delete="refresh()"
            />
          </span>
          <span class="container__search-select">
            <select
              name
              class="container__search-element select-font"
              @change="filterVendor()"
              id="vend"
            >
              <option value selected>{{ $t('pending.select_type_truck') }}</option>
              <option value="3T Truck">3 {{ $t('pending.tonne_truck') }}</option>
              <option value="5T Truck">5 {{ $t('pending.tonne_truck') }}</option>
              <option value="10T Truck">10 {{ $t('pending.tonne_truck') }}</option>
              <option value="14T Truck">14 {{ $t('pending.tonne_truck') }}</option>
              <option value="20T Truck">20 {{ $t('pending.tonne_truck') }}</option>
              <option value="28T Truck">28 {{ $t('pending.tonne_truck') }}</option>
            </select>
          </span>
          <span class="container__search-select" v-if="ordercount.length > 0">
            <select
              name
              class="container__search-element select-font"
              @change="definePayload()"
              v-model="orderRange"
            >
              <option :value="order" v-for="order in ordercount" :key="order">{{ order }}</option>
            </select>
          </span>
        </div>
        <select
          name
          class="order-range"
          @change="definePayload()"
          v-model="orderRange"
          v-if="ordercount.length > 0"
        >
          <option :value="order" v-for="order in ordercount" :key="order">{{ order }}</option>
        </select>
        <div class="bids">
          <div id="orders__list-table" class="orders__list-table">
            <div class="orders__list-toprow table-head">
              <div class="orders__col-head pickup uppercase">{{ $t('pending.pickup_location') }}</div>
              <div class="orders__col-head load uppercase">{{ $t('pending.type_of_load') }}</div>
              <div class="orders__col-head destination uppercase">{{ $t('pending.destination') }}</div>
              <div class="orders__col-head distance uppercase">{{ $t('pending.distance') }}</div>
              <div class="orders__col-head pick-date uppercase">{{ $t('pending.pickup_date') }}</div>
              <div class="orders__col-head truck uppercase">{{ $t('pending.truck') }}</div>
              <div class="orders__col-head orderNo">{{ $t('pending.order_number') }}r</div>
              <div class="orders__col-head price-align uppercase">{{ $t('pending.quotation') }}</div>
              <div class="orders__col-head bid-in uppercase"></div>
              <div class="orders__col-head center-action uppercase">{{ $t('pending.action') }}</div>
            </div>
            <div class="loading" v-if="loadingStatus"></div>
            <div class="no-records" v-if="!loadingStatus && orders.length === 0">
              <p class="no-records-par">{{ $t('pending.no_orders') }}</p>
            </div>
            <template v-for="order in orders.slice().reverse()">
              <div
                class="orders__list-row"
                @click="toggle(order.id)"
                :class="{ opened: opened.includes(order.id) }"
                v-if="showParentOrdercard(order.id)"
                :key="order.id"
              >
                <div class="orders__list-col pickup">
                  <p class="orders__mobile-col">{{ $t('pending.pickup') }}</p>
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
                  <p class="orders__mobile-col">{{ $t('pending.load') }}</p>
                  <p>N/A</p>
                </div>
                <div class="orders__list-col destination">
                  <p class="orders__mobile-col">{{ $t('pending.destination_capital') }}</p>
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
                  <p class="orders__mobile-col">{{ $t('pending.distance') }}</p>
                  <p class="orders__mobile-col--distance">{{ formatDistance(order.id) }} km</p>
                </div>
                <div class="orders__list-col pick-date">
                  <p class="orders__mobile-col">{{ $t('pending.date') }}</p>
                  <p>{{ timeFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col truck">
                  <p class="orders__mobile-col">{{ $t('pending.truck') }}</p>
                  <p class="row3">{{ order.vendorname }}</p>
                </div>
                <div class="orders__list-col orderNo">
                  <p class="orders__mobile-col">{{ $t('pending.order_number') }}</p>
                  <p>{{ order.orderNo }}</p>
                </div>
                <div class="orders__list-col price-align">
                  <p class="orders__mobile-col">{{ $t('pending.price_capital') }}</p>
                  <p class="right-align">{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col bid-in"></div>
                <div class="orders__list-col center-action">
                  <P class="orders__mobile-col uppercase">{{ $t('pending.action') }}</P>
                  <button
                    class="orders__sendquote-icon button-menu uppercase"
                    v-if="order.bidPlaced === 0 && !opened.includes(order.id) && order.confirmStatus === 0 && order.orderStatus === 1"
                  >{{ $t('pending.adjust_quote') }}</button>
                  <button
                    class="orders__hidedetails-icon button-menu uppercase"
                    v-if="order.bidPlaced === 0 && opened.includes(order.id) && order.confirmStatus === 0 && order.orderStatus === 1"
                  > {{ $t('pending.hide_details') }}</button>
                  <button
                    class="orders__bidplaced-icon button-menu uppercase"
                    v-if="order.bidPlaced === 1 && order.confirmStatus === 0 && order.orderStatus === 1"
                  > {{ $t('pending.bid_updated') }}</button>
                  <button
                    class="confirmed-for-others-button-menu button-menu uppercase"
                    v-if="order.confirmStatus === 1 && order.orderStatus === 1 && order.awardStatus === 0"
                  > {{ $t('pending.not_awarded') }}</button>
                  <button
                    class="cancelled-button-menu button-menu uppercase"
                    v-if="order.orderStatus === 2 || order.orderStatus === 0"
                  >{{ $t('pending.cancelled') }}</button>
                  <button
                    class="awarded-to-you-button-menu button-menu uppercase"
                    v-if="order.confirmStatus === 1 && order.orderStatus === 1 && order.awardStatus === 1"
                  >{{ $t('pending.awarded') }}</button>
                </div>
              </div>
              <div
                v-if="opened.includes(order.id)"
                :class="`open-row row-${order.id}`"
                :key="order.orderNo"
              >
                <div class="blinder" v-if="cancelStatus">
                  <div class="confirm-cancel">
                    <p class="cancel-par">{{ $t('pending.sure_cancel_quote') }}</p>
                    <button class="yes uppercase" @click="cancelQuote(order.id)">{{ $t('pending.yes_cancel_quote') }}</button>
                    <button class="no uppercase" @click="cancelStatus = false">{{ $t('pending.no') }}</button>
                  </div>
                </div>
                <div class="expanded-row">
                  <div class="map-details--go-back" @click="toggle(order.id)">
                    <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
                    <span class="map-details-go-back--span">{{ $t('pending.back') }}</span>
                  </div>
                  <div class="map__column">
                    <img :src="createStaticMapUrl(order)" class="map" />
                    <div class="map__details-row">
                      <div class="map__details-col">
                        <p class="map__details-pickup heading uppercase">{{ $t('pending.pickup_location') }}</p>
                        <p class="map__details-pickup par">{{ order.from_name }}</p>
                        <p class="map__details-date heading uppercase">{{ $t('pending.date_and_time') }}</p>
                        <p class="map__details-date par">{{ timeFormat(order.id) }}</p>
                      </div>
                      <div class="map__details-col">
                        <p class="map__details-dest heading uppercase">{{ $t('pending.destination') }}</p>
                        <p class="map__details-dest par">{{ order.to_name }}</p>
                        <p class="map__details-distance heading uppercase">{{ $t('pending.distance') }}</p>
                        <p class="map__details-distance par">{{ order.distance }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="order__column">
                    <p class="order__weight heading uppercase">{{ $t('pending.approximate_weight_order') }}</p>
                    <p class="order__weight par" v-if="!weight">{{ $t('pending.not_applicable') }}</p>
                    <p class="order__weight par" v-else>{{ weight }}</p>
                    <p class="order__loader heading uppercase">l{{ $t('pending.loader_needed') }}</p>
                    <p class="order__loader par" v-if="!loaders">{{ $t('pending.not_applicable') }}</p>
                    <p class="order__loader par" v-else>{{ loaders }}</p>
                    <p class="order__loadtype heading uppercase">{{ $t('pending.type_of_load') }}</p>
                    <p class="order__loadtype par" v-if="!load">{{ $t('pending.not_applicable') }}</p>
                    <p class="order__loadtype par" v-else>{{ load }}</p>
                    <p class="order__notes heading uppercase">{{ $t('pending.notes') }}</p>
                    <p class="order__notes par">{{ orderNotes(order.id) }}</p>
                  </div>
                  <div class="order__column">
                    <p class="order__amount heading uppercase" v-if="order.bid_status === 0">{{ $t('pending.amount_small') }}</p>
                    <p
                      class="order__amount par"
                      v-if="order.bid_status === 0"
                    >{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                    <div v-if="order.confirmed === 0 && order.bidPlaced === 0">
                      <div class="order__bidtimer-duration" v-if="order.bid_status === 1">
                        <span class="order__price-estimate">
                          <p
                            class="order__amount heading uppercase"
                          >{{ $t('pending.minimum_amount') }}</p>
                          <p
                            class="order__estimate-amount par"
                          >{{ order.currency }} {{ bidcurrencyFormat(order.id) }}</p>
                        </span>
                        <span class="order__price-estimate"></span>
                      </div>
                      <div v-if="order.confirmStatus === 0 && order.orderStatus === 1">
                        <div class="order__quote-amount">
                          <p class="order__amount heading uppercase">{{ $t('pending.your_quote') }}</p>
                          <input
                            type="text"
                            class="input orders__bid-input"
                            placeholder="$t('pending.enter_quote_amount')"
                            @input="confirm(order.id)"
                            v-model="quoteAmount"
                          />
                        </div>
                        <p
                          class="orders__bidvehicle-type heading uppercase"
                        >{{ $t('pending.select_vehicle_to_service') }}</p>
                        <select
                          class="orders__bidvehicle-type-input par"
                          v-if="!addVehicleStatus"
                          v-model="count"
                          @change="vehicleSelector(order.id)"
                        >
                          <option class selected value="null">{{ $t('pending.select_vehicle') }}</option>
                          <option class v-for="vehicle in vehicles" :value="vehicle.count" :key="vehicle.count">{{ vehicle.registration_no }} {{ displayVehicles(vehicle.count) }}</option>
                        </select>
                        <select
                          class="orders__bidvehicle-type-input disabled par"
                          v-if="addVehicleStatus"
                          @click="setVehicleStatus()"
                          readonly
                        >
                          <option class value selected>{{ $t('pending.select_vehicle') }}</option>
                        </select>
                        <p class="orders__addvehicle link" @click="toggleVehicle(order.id)">
                          <i class="material-icons icon-padded" v-if="!addVehicleStatus">{{ $t('pending.add') }}</i>
                          <i class="material-icons icon-padded" v-if="addVehicleStatus">{{ $t('pending.remove') }}</i>&nbsp;&nbsp;{{ $t('pending.add_vehicle') }}
                        </p>
                        <div class="orders__adddriver-form" v-if="addVehicleStatus">
                          <input
                            type="text"
                            class="input orders__bid-input"
                            :placeholder="$t('pending.enter_reg_no')"
                            v-model="regNo"
                            @input="addRegNo(order.id)"
                          />
                          <input
                            type="text"
                            class="input orders__bid-input"
                            :placeholder="$t('pending.enter_insurance_number')"
                            v-model="insuNo"
                            @input="addInsuNo(order.id)"
                          />
                        </div>
                        <p
                          class="orders__assigndriver heading uppercase"
                        >{{ $t('pending.select_driver_to_assign') }}</p>
                        <select
                          class="orders__assigndriver-input par"
                          v-if="!addDriverStatus"
                          v-model="count1"
                          @change="driverSelector(order.id)"
                        >
                          <option class selected value="null">{{ $t('pending.select_driver') }}</option>
                          <option
                            class
                            v-for="rider in riders"
                            :value="rider.count"
                            :key="rider.count"
                          >{{ rider.rider_name }}</option>
                        </select>
                        <select
                          class="orders__assigndriver-input disabled par"
                          v-if="addDriverStatus"
                          @click="setDriverStatus()"
                          readonly
                        >
                          <option class value selected>{{ $t('pending.select_driver') }}</option>
                        </select>
                        <p class="orders__add-driver link" @click="toggleDriver()">
                          <i class="material-icons icon-padded" v-if="!addDriverStatus">{{ $t('pending.add') }}</i>
                          <i class="material-icons icon-padded" v-if="addDriverStatus">{{ $t('pending.remove') }}</i>&nbsp;&nbsp;{{ $t('pending.add_driver') }}
                        </p>
                        <div class="orders__addvehicle-form" v-if="addDriverStatus">
                          <input
                            type="text"
                            class="input orders__bid-input"
                            :placeholder="$t('pending.enter_name')"
                            v-model="driverName"
                            @input="addDriverName(order.id)"
                          />
                          <input
                            type="text"
                            class="input orders__bid-input"
                            :placeholder="$t('pending.id_number')"
                            v-model="ID"
                            @input="addId(order.id)"
                          />
                          <vue-tel-input
                            v-model="driverPhone"
                            v-bind="bindProps"
                            class="input orders__bid-input"
                            id="phone"
                            @input="addPhone(order.id)"
                          ></vue-tel-input>
                        </div>
                        <div class="center-action center-action--lower force-leftalign">
                          <button
                            class="orders__disabled-button uppercase"
                            v-if="order.confirmed === 0 && order.bid_status === 1 && buttonDisabledStatus === 0"
                            disabled
                          >{{ $t('pending.adjust_quotes') }}</button>
                          <button
                            class="orders__sendquote-button uppercase"
                            @click="sendBid(order.id)"
                            v-if="order.confirmed === 0 && order.bid_status === 1 && buttonDisabledStatus === 1"
                          >{{ sendQuoteButtonState }}</button>
                        </div>
                        <p class="cancel-quote" @click="cancelStatus = true">{{ $t('pending.or_cancel_quote') }}</p>
                      </div>
                    </div>
                    <div class="center-action center-action--lower force-leftalign">
                      <button
                        class="orders__confirmed-button uppercase"
                        v-if="order.confirmed === 1"
                      >{{ $t('pending.confirmed') }}</button>
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
</template>

<script>
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import axios from 'axios';
import moment from 'moment';
import Mixpanel from 'mixpanel';
import timezone from '../mixins/timezone';
import notify from '../components/notification';
import errorHandler from '../components/errorHandler';
import verifier from '../components/verifier';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);
let interval = '';
export default {
  title: 'Partner Portal - My Quotes',
  components: {
    verifier,
    errorHandler,
    VueTelInput,
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
      responseNo: 0,
      confirmButtonState: this.$t('pending.confirm_quote'),
      sendQuoteButtonState: this.$t('pending.ajust_quote'),
      getRiderz: 0,
      getVehiclez: 0,
      quoteAmount: null,
      buttonDisabledStatus: 0,
      notificationName: 'message-box-up',
      cancelStatus: false,
      loadingStatus: true,
      bikesOnly: true,
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
        placeholder: this.$t('pending.driver_phone_number'),
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
      ordercount: [],
      orderRange: '0 - 100',
    };
  },
  computed: {},
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.definePayload();
    }
  },
  beforeDestroy() {
    clearInterval(interval); // stop the interval
  },
  destroyed() {
    if (localStorage.token && !['orders', 'pending', 'quotes'].includes(this.$route.name) && this.sessionInfo.super_user) {
      this.$router.push('/quotes');
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
    addRegNo(id) {
      if (this.regNo.charAt(0) === ' ') {
        this.regNo = this.regNo.replace(/^\s+|\s+$/g, '');
      } else if (this.regNo.charAt(0).match(/[^A-Z]/g)) {
        this.regNo = this.regNo.toUpperCase();
        this.regNo = this.regNo.replace(/[^A-Z]/g, '');
      } else if (this.regNo.charAt(1).match(/[^A-Z]/g)) {
        this.regNo = this.regNo.toUpperCase();
        this.regNo = this.regNo.replace(/[^A-Z]/g, '');
      } else if (this.regNo.charAt(2).match(/[^A-Z]/g)) {
        this.regNo = this.regNo.toUpperCase();
        this.regNo = this.regNo.replace(/[^A-Z]/g, '');
        this.regNo = `${this.regNo} `;
      }
      this.confirm(id);
    },
    addInsuNo(id) {
      if (this.insuNo.charAt(0) === ' ') {
        this.insuNo = this.insuNo.replace(/^\s+|\s+$/g, '');
      } else if (this.insuNo.charAt(0).match(/[^A-Z]/g)) {
        this.insuNo = this.insuNo.toUpperCase();
        this.insuNo = this.insuNo.replace(/[^A-Z]/g, '');
      }
      this.confirm(id);
    },
    addDriverName(id) {
      if (this.driverName.charAt(0) === ' ') {
        this.driverName = this.driverName.replace(/^\s+|\s+$/g, '');
      }
      this.confirm(id);
    },
    addId(id) {
      this.confirm(id);
    },
    addPhone(id) {
      this.driverPhone = this.driverPhone.toString().replace(/[^0-9+]/g, '');
      setTimeout(() => {
        this.confirm(id);
      }, 200);
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
      if (this.orders[id - 1].orderNotes) {
        return this.orders[id - 1].orderNotes.slice(7, 10000);
      } else {
        return this.$t('pending.no_notes');
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
        return timer2.split(' ')[1];
      }
    },
    minBid(id) {
      return id.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },
    maxBid(id) {
      return id.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },
    timeFormat(id) {
      const orderTime = this.orders[id - 1].orderTime;
      return this.formatedTime(orderTime);
    },
    currencyFormat(id) {
      const amount = this.orders[id - 1].bidAmount;
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
      const num = distance.replace(/\D+$/g, '');
      return Math.round(num);
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
    vehicleName(id) {
      return this.vehicles[id].vendor_disp_name;
    },
    autoSelectVehicles(id) {
      const vId = this.orders[id - 1].assignedVehicle;
      const filterObj1 = this.vehicles.filter(e => e.vehicle_id === vId);
      if (filterObj1.length > 0) {
        this.count = filterObj1[0].count;
      } else {
        this.count = null;
      }
      this.vehicleSelector(id);
    },
    autoSelectRiders(id) {
      const rId = this.orders[id - 1].assignedRider;
      const filterObj = this.riders.filter(e => e.rider_id === rId);
      if (filterObj.length > 0) {
        this.count1 = filterObj[0].count;
      } else {
        this.count1 = null;
      }
      this.driverSelector(id);
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.splice(index, 1); // this allows you to open only one tab at a time.
        this.opened.push(id);
      }
      this.buttonDisabledStatus = 0;
      this.quoteAmount = this.orders[id - 1].bidAmount;
      this.cancelStatus = false;
      this.addDriverStatus = false;
      this.addVehicleStatus = false;
      if (this.opened.length !== 0) {
        this.count = null;
        this.count1 = null;
        this.riders = [];
        this.vehicles = [];
        this.getVehiclez = 0;
        this.getRiderz = 0;
        this.getVehicles(id).then(response => {
          this.getRiders(id);
        });
      }
      this.vendorType = this.orders[id - 1].vendor_type;
      this.ownerId = this.sessionInfo.id;
      this.closed = this.orders[id - 1].carrier_type;
      this.orderNo = this.orders[id - 1].order_no;
      this.newRider = false;
      this.newVehicle = false;

      if (this.orders[id - 1].package_details) {
        if (this.orders[id - 1].package_details.load_weight) {
          this.weight = `${this.orders[id - 1].package_details.load_weight} ${this.orders[id - 1].package_details.load_units}`;
        } else {
          this.weight = this.$t('pending.no_weight_provided');
        }
        if (this.orders[id - 1].package_details.no_of_loaders) {
          this.loaders = this.orders[id - 1].package_details.no_of_loaders;
        } else {
          this.loaders = 'N/A';
        }
        if (this.orders[id - 1].package_details.delivery_item) {
          this.load = this.orders[id - 1].package_details.delivery_item;
        } else {
          this.load = 'N/A';
        }
      } else {
        this.weight = null;
        this.loaders = null;
        this.load = null;
      }
    },
    toggleVehicle(id) {
      this.count = null;
      this.regNo = null;
      this.insuNo = null;
      this.vehicleId = null;
      this.buttonDisabledStatus = 0;
      if (!this.addVehicleStatus) {
        this.addVehicleStatus = true;
        this.newVehicle = true;
      } else {
        this.addVehicleStatus = false;
        this.newVehicle = false;
      }
    },
    toggleDriver() {
      this.count1 = null;
      this.driverName = null;
      this.driverPhone = '';
      this.riderId = null;
      this.DL = null;
      this.ID = '';
      this.buttonDisabledStatus = 0;
      if (!this.addDriverStatus) {
        this.addDriverStatus = true;
        this.newRider = true;
      } else {
        this.addDriverStatus = false;
        this.newRider = false;
      }
    },
    confirm(id) {
      if (!this.addDriverStatus && !this.addVehicleStatus) {
        if (this.detailsCheckForSelectingDriversAndSelectingVehicles()) {
          if (this.orders[id - 1].bid_status === 1) {
            // if the order bidding
            if (this.quoteAmount >= this.orders[id - 1].min_amount) {
              this.buttonDisabledStatus = 1;
            } else {
              this.buttonDisabledStatus = 0;
            }
          } else {
            this.buttonDisabledStatus = 1;
          }
        } else {
          this.buttonDisabledStatus = 0;
        }
      } else if (!this.addDriverStatus && this.addVehicleStatus) {
        if (this.detailsCheckForSelectingDriversAndAddingVehicles()) {
          if (this.orders[id - 1].bid_status === 1) {
            // if the order bidding
            if (this.quoteAmount >= this.orders[id - 1].min_amount) {
              this.buttonDisabledStatus = 1;
            } else {
              this.buttonDisabledStatus = 0;
            }
          } else {
            this.buttonDisabledStatus = 1;
          }
        } else {
          this.buttonDisabledStatus = 0;
        }
      } else if (this.addDriverStatus && this.addVehicleStatus) {
        if (this.detailsCheckForAddingDriversAndAddingVehicles()) {
          if (this.orders[id - 1].bid_status === 1) {
            // if the order bidding
            if (this.quoteAmount >= this.orders[id - 1].min_amount) {
              this.buttonDisabledStatus = 1;
            } else {
              this.buttonDisabledStatus = 0;
            }
          } else {
            this.buttonDisabledStatus = 1;
          }
        } else {
          this.buttonDisabledStatus = 0;
        }
      } else if (this.addDriverStatus && !this.addVehicleStatus) {
        if (this.detailsCheckForAddingDriverSAndSelectingVehicles()) {
          if (this.orders[id - 1].bid_status === 1) {
            // if the order bidding
            if (this.quoteAmount >= this.orders[id - 1].min_amount) {
              this.buttonDisabledStatus = 1;
            } else {
              this.buttonDisabledStatus = 0;
            }
          } else {
            this.buttonDisabledStatus = 1;
          }
        } else {
          this.buttonDisabledStatus = 0;
        }
      }
    },
    detailsCheckForSelectingDriversAndSelectingVehicles() {
      if (this.ownerId && this.vehicleId && !this.newVehicle && this.driverPhone && this.orderNo && !this.newRider && this.riderId && this.partnerVendor) {
        return true;
      } else {
        return false;
      }
    },
    detailsCheckForSelectingDriversAndAddingVehicles() {
      if (this.ownerId && !this.newRider && this.driverPhone && this.orderNo && this.regNo && this.box && this.vendorType && this.insuNo && this.newVehicle) {
        return true;
      } else {
        return false;
      }
    },
    detailsCheckForAddingDriversAndAddingVehicles() {
      if (this.newRider && this.ID.length > 0 && this.ownerPhone && this.driverPhone.toString().length >= 10 && this.driverName && (this.driverPhone.startsWith('+') || this.driverPhone.startsWith('7')) && this.insuNo && this.vendorType && this.box && this.regNo && this.ownerId && this.newVehicle && this.orderNo) {
        return true;
      } else {
        return false;
      }
    },
    detailsCheckForAddingDriverSAndSelectingVehicles() {
      if (this.vehicleId && this.ID.length > 0 && this.newRider && this.ownerPhone && this.driverPhone.toString().length >= 10 && (this.driverPhone.startsWith('+') || this.driverPhone.startsWith('7')) && this.driverName && this.vendorType && this.box && this.ownerId && this.vehicleId && !this.newVehicle && this.orderNo && this.partnerVendor) {
        return true;
      } else {
        return false;
      }
    },
    sendBid(id) {
      this.sendQuoteButtonState = this.$t('pending.sending_quote');
      const newVehiclePayload = {
        registration_no: this.regNo,
        box: this.box,
        vendor_type: this.vendorType.toString(),
        owner_id: this.ownerId.toString(),
        closed: '1',
        insurance_no: this.insuNo,
        new_vehicle: this.newVehicle,
      };
      const existingVehiclePayload = {
        new_vehicle: this.newVehicle,
        vehicle_id: this.vehicleId,
        owner_id: this.ownerId.toString(),
      };
      const newRiderPayload = {
        registration_no: this.regNo,
        box: this.box,
        vendor_type: this.vendorType.toString(),
        real_owner_id: this.ownerId.toString(),
        closed: '1',
        driver_name: this.driverName,
        phone_no: this.driverPhone,
        vendor_id: parseInt(this.vendorType, 10),
        owner_phone: `+${this.ownerPhone.toString()}`,
        dl_no: this.driverPhone,
        id_no: this.ID,
        refrigerated: 0,
        new_rider: this.newRider,
      };
      const existingRiderPayload = {
        new_rider: this.newRider,
        rider_id: this.riderId,
        vendor_type: this.vendorType.toString(),
        owner_id: this.ownerId.toString(),
      };
      if (this.newVehicle) {
        this.vehiclePayload.shift();
        this.vehiclePayload.push(newVehiclePayload);
      } else {
        this.vehiclePayload.splice(0, 1);
        this.vehiclePayload.push(existingVehiclePayload);
      }
      if (this.newRider) {
        this.riderPayload.shift();
        this.riderPayload.push(newRiderPayload);
      } else {
        this.riderPayload.shift();
        this.riderPayload.push(existingRiderPayload);
      }
      const payload = JSON.stringify({
        order_bid_id: this.orders[id - 1].bidId,
        vehicle_details: this.vehiclePayload[0],
        rider_details: this.riderPayload[0],
        bid_details: {
          order_no: this.orderNo,
          amount: this.quoteAmount,
          owner_id: this.ownerId,
          rider_id: this.riderId,
        },
      });

      axios
        .post(`${this.auth}v1/update_order_bid/`, payload, this.config)
        .then(response => {
          this.sendQuoteButtonState = this.$t('pending.ajust_quote');
          if (response.data.status) {
            this.notify(3, 1, response.data.message);
            this.opened = [];
            this.orders = [];
            this.responseNo = 0;
            this.trackUpdateBid(payload);
            clearInterval(interval); // stop the interval
            this.definePayload();
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.sendQuoteButtonState = this.$t('pending.ajust_quote');
            this.notify(3, 0, `${error.response.data.message}`);
          }
        });
    },
    cancelQuote(id) {
      const cancelbidpayload = JSON.stringify({
        order_bid_id: this.orders[id - 1].bidId,
      });
      axios
        .post(`${this.auth}v1/cancel_order_bid/`, cancelbidpayload, this.config)
        .then(response => {
          this.sendQuoteButtonState = this.$t('pending.ajust_quote');
          if (response.data.status) {
            this.notify(3, 1, response.data.message);
            this.opened = [];
            this.orders = [];
            this.responseNo = 0;
            this.trackCancelBid(cancelbidpayload);
            clearInterval(interval); // stop the interval
            this.definePayload();
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.sendQuoteButtonState = this.$t('pending.ajust_quote');
            this.notify(3, 0, `${error.response.data.message}`);
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
        this.driverName = this.riders[q].rider_name;
        this.driverPhone = this.riders[q].phone_no;
        this.riderId = this.riders[q].rider_id;
      }
      setTimeout(() => {
        this.confirm(id);
      }, 200);
    },
    vehicleSelector(id) {
      const q = this.count;
      if (this.count === null || this.count === 'null') {
        this.regNo = null;
        this.insuNo = null;
        this.refrigirated = null;
        this.vehicleId = null;
      } else {
        this.regNo = this.vehicles[q].registration_no;
        this.insuNo = this.vehicles[q].insurance_no;
        this.vehicleId = this.vehicles[q].vehicle_id;
        this.refrigirated = this.vehicles[q].refrigerated;
        this.partnerVendor = parseInt(this.vehicles[q].vendor_type, 10);
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
      return new Promise((resolve, reject) => {
        const riderload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });

        axios
          .post(`${this.auth}partner/v1/partner_portal/available_riders`, riderload, this.config)
          .then(response => {
            const unescaped = response.data;
            unescaped.available_riders.forEach((row, v) => {
              row.count = v;
              this.riders.push(row);
            });
            if (this.riders.length !== 0) {
              this.autoSelectRiders(id);
            }
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    getVehicles(id) {
      return new Promise((resolve, reject) => {
        const vehicleload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        axios
          .post(`${this.auth}partner/v1/partner_portal/available_vehicles`, vehicleload, this.config)
          .then(response => {
            const unescaped = response.data;
            let counter = -1;
            unescaped.available_vehicles.forEach((row, v) => {
              if ([20, 25].includes(this.orders[id - 1].vendor_type) && [20, 25].includes(row.vendor_type)) {
                counter += 1;
                row.count = counter;
                this.vehicles.push(row);
              } else if (row.vendor_type === this.orders[id - 1].vendor_type) {
                counter += 1;
                row.count = counter;
                this.vehicles.push(row);
              }
            });
            if (this.vehicles.length !== 0) {
              this.autoSelectVehicles(id);
            }
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
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
        const payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          to_date: moment().format('YYYY-MM-DD HH:mm:ss'),
          from_date: '2019-02-09 00:00:00',
        });
        axios
          .post(`${this.auth}v1/list_owner_bids/`, payload, this.config)
          .then(response => {
            const unescaped = response.data;
            let allDetails = '';
            if (unescaped.status) {
              this.orders = [];
              unescaped.data.forEach((row, i) => {
                allDetails = this.populateOrders(row, i);
                if (allDetails) {
                  if (order === allDetails.orderno) {
                    this.opened = [];
                    this.opened.push(i + 1);
                  }
                  this.orders.push(allDetails);
                }
              });
            }
          })
          .catch(error => {
            this.errorObj = error.response;
            // this.loadingStatus = false;
          });
      }, 60000);
    },
    definePayload() {
      clearInterval(interval);
      this.orders = [];
      const payload = {
        owner_id: this.sessionInfo.id,
        to_date: moment().format('YYYY-MM-DD'),
        from_date: '2014-02-09',
        limit: `${this.orderRange.split(' ')[0]}, ${100}`,
      };
      const vendfilter = document.getElementById('vend');
      if (vendfilter) {
        vendfilter.value = '';
      }
      this.getOrders(payload);
    },
    getOrders(ordpaylaod) {
      this.loadingStatus = true;
      this.ownerPhone = this.sessionInfo.phone;
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
        to_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        from_date: '2019-02-09 00:00:00',
      });
      axios
        .post(`${this.auth}v1/list_owner_bids/`, payload, this.config)
        .then(response => {
          const unescaped = response.data;
          if (this.ordercount.length === 0) {
            const multiplier = response.data.count / 100;
            for (let i = 0; i < Math.floor(multiplier); i++) {
              this.ordercount.push(`${i * 100} - ${(i + 1) * 100}`);
            }
            this.ordercount.push(`${Math.floor(multiplier) * 100} - ${response.data.count}`);
            this.orderRange = this.ordercount[0];
          }
          if (unescaped.status) {
            unescaped.data.forEach((row, i) => {
              this.orders.push(this.populateOrders(row, i));
              this.loadingStatus = false;
              this.responseNo = 1;
            });
            if (this.$route.path === '/quotes') {
              this.refreshOrders();
            }
          } else {
            this.loadingStatus = false;
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.loadingStatus = false;
        });
    },
    populateOrders(row, i) {
      const orderno = row.order_no;
      const time = row.date_time;
      const bidamount = row.bid_amount;
      const bidid = row.order_bid_id;
      const variance = row.price_variance;
      const fromcity = row.from_city;
      const tocity = row.to_city;
      const riderid = row.rider_id;
      const vehicleid = row.vehicle_id;
      const orderStatus = row.order_status;
      const confirmStatus = row.confirm_status;
      const awardStatus = row.award_status;
      if (row.order_notes.length > 1) {
        orderDetails.orderNotes = row.order_notes[0].msg;
      }
      const vendorname = row.vendor_disp_name;
      if (row.order_details) {
        const unescaped1 = JSON.parse(row.order_details);
        const orderDetails = unescaped1.values;
        const priceDetails = JSON.parse(row.price_details);
        if (priceDetails.order_currency) {
          orderDetails.currency = priceDetails.order_currency;
        } else {
          orderDetails.currency = 'KES';
        }
        if (row.customer_min_amount) {
          orderDetails.min_amount = row.min_take_home;
        } else {
          orderDetails.min_amount = 0;
        }
        orderDetails.orderNo = orderno;
        orderDetails.id = i + 1;
        orderDetails.variance = variance;
        orderDetails.bid_status = 1;
        orderDetails.vendorname = vendorname;
        orderDetails.assignedVehicle = vehicleid;
        orderDetails.assignedRider = riderid;
        orderDetails.fromCity = fromcity;
        orderDetails.toCity = tocity;
        orderDetails.bidId = bidid;
        orderDetails.bidAmount = bidamount;
        orderDetails.bidPlaced = 0;
        orderDetails.confirmed = 0;
        orderDetails.orderTime = time;
        orderDetails.orderStatus = orderStatus;
        orderDetails.confirmStatus = confirmStatus;
        orderDetails.awardStatus = awardStatus;
        return orderDetails;
      }
    },
    trackCancelBid(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Order Cancel Bid Web', JSON.parse(payload));
      }
    },
    trackUpdateBid(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Order Update Bid Web', JSON.parse(payload));
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
</style>
