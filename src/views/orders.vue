<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab">
      <div class="truckflow__container-outer">
        <div class="truckflow__container-search">
          <span class="container__search-input">
            <input type="text" onfocus="value = ''" class="container__search-element" id="inp" :placeholder="$t('orders.enter_pickup')" @input="filterPickup()" @keyup.delete="refresh()" />
          </span>
          <span class="container__search-input">
            <input type="text" onfocus="value = ''" class="container__search-element" id="dst" :placeholder="$t('orders.enter_destination')" @input="filterDest()" @keyup.delete="refresh()" />
          </span>
          <span class="container__search-select">
            <select name class="container__search-element select-font" @change="filterVendor()" id="vend" :disabled="orders.length === 0">
              <option value selected> {{ $t('orders.select_type_truck') }}</option>
              <option value="Pick up"> {{ $t('orders.pick_up') }}</option>
              <option value="Van"> {{ $t('orders.van') }}</option>
              <option value="3T Truck">3 {{ $t('orders.tonne_truck') }}</option>
              <option value="5T Truck">5 {{ $t('orders.tonne_truck') }}</option>
              <option value="10T Truck">10 {{ $t('orders.tonne_truck') }}</option>
              <option value="14T Truck">14 {{ $t('orders.tonne_truck') }}</option>
              <option value="20T Truck">20 {{ $t('orders.tonne_truck') }}</option>
              <option value="28T Truck">28 {{ $t('orders.tonne_truck') }}</option>
              <option value="Freight">{{ $t('orders.freight_truck') }}</option>
            </select>
          </span>
          <span class="container__search-select" v-if="ordercount.length > 0">
            <select name class="container__search-element select-font" @change="definePayload()" v-model="orderRange">
              <option :value="order" v-for="order in ordercount" :key="order">{{ order }}</option>
            </select>
          </span>
        </div>
        <select name class="order-range" @change="definePayload()" v-model="orderRange" v-if="ordercount.length > 0">
          <option :value="order" v-for="order in ordercount" :key="order">{{ order }}</option>
        </select>
        <div class="bids">
          <div class="orders__list-cash-filter">
            <span class="orders__list-cash-selectors" @click="pay_method = 0" :class="pay_method === 0 ? 'cash-selector-active' : ''">{{ $t('orders.all') }}</span>
            <span class="orders__list-cash-selectors" @click="pay_method = 1" :class="pay_method === 1 ? 'cash-selector-active' : ''">{{ $t('orders.cash_orders') }}</span>
            <span class="orders__list-cash-selectors" @click="pay_method = 2" :class="pay_method === 2 ? 'cash-selector-active' : ''">{{ $t('orders.non_cash_orders') }}</span>
          </div>
          <div id="orders__list-table" class="orders__list-table">
            <div class="orders__list-toprow table-head">
              <div class="orders__col-head pickup uppercase"> {{ $t('orders.pickup_location') }}</div>
              <div class="orders__col-head load uppercase"> {{ $t('orders.type_of_load') }}</div>
              <div class="orders__col-head destination uppercase"> {{ $t('orders.destination') }}</div>
              <div class="orders__col-head distance uppercase"> {{ $t('orders.distance') }}</div>
              <div class="orders__col-head pick-date uppercase"> {{ $t('orders.pickup_date') }}</div>
              <div class="orders__col-head truck uppercase">{{ $t('orders.truck') }}</div>
              <div class="orders__col-head orderNo"> {{ $t('orders.order_number') }}</div>
              <div class="orders__col-head price-align uppercase">{{ $t('orders.price') }} </div>
              <div class="orders__col-head price-align uppercase">{{ $t('orders.vat') }}</div>
              <div class="orders__col-head bid-in uppercase"></div>
              <div class="orders__col-head center-action uppercase">{{ $t('orders.action') }}</div>
            </div>
            <div class="loading" v-if="loadingStatus"></div>
            <div class="no-records" v-if="!loadingStatus && orders.length === 0">
              <p class="no-records-par">{{ loaderMessage }}</p>
            </div>
            <template v-for="order in filteredOrders">
              <div
                class="orders__list-row"
                @click="toggle(order.id)"
                :class="{ opened: opened.includes(order.id) }"
                v-if="showParentOrdercard(order.id)"
                :key="order.id"
              >
                <div class="orders__list-col pickup">
                  <p class="orders__mobile-col">{{ $t('orders.pickup') }}</p>
                  <p class="row1" @mouseover="showFromTooltip(order.id)" @mouseout="hideFromTooltip(order.id)">{{ shortFromName(order.id) }}</p>
                  <span :class="`tooltiptext sp${order.id}`">{{ order.from_name }}, {{ order.start_address }}</span>
                </div>
                <div class="orders__list-col load">
                  <p class="orders__mobile-col"> {{ $t('orders.load') }}</p>
                  <p>N/A</p>
                </div>
                <div class="orders__list-col destination">
                  <p class="orders__mobile-col">{{ $t('orders.destination_capital') }}</p>
                  <p class="row2" @mouseover="showToTooltip(order.id)" @mouseout="hideToTooltip(order.id)">{{ shortToName(order.id) }}</p>
                  <span :class="`tooltiptext sps${order.id}`">{{ order.to_name }}, {{ order.end_address }}</span>
                </div>
                <div class="orders__list-col distance">
                  <p class="orders__mobile-col">{{ $t('orders.distance') }}</p>
                  <p class="orders__mobile-col--distance">{{ formatDistance(order.id) }} km</p>
                </div>
                <div class="orders__list-col pick-date">
                  <p class="orders__mobile-col">{{ $t('orders.date') }}</p>
                  <p>{{ timeFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col truck">
                  <p class="orders__mobile-col">{{ $t('orders.truck_capital') }}</p>
                  <p class="row3">{{ order.vendorname }}</p>
                </div>
                <div class="orders__list-col orderNo">
                  <p class="orders__mobile-col"> {{ $t('orders.order_number') }}</p>
                  <p>{{ order.orderNo }}</p>
                </div>

                <div class="orders__list-col price-align">
                  <p class="orders__mobile-col">{{ $t('orders.price_capital') }}</p>
                  <p class="right-align">{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col price-align">
                  <p class="orders__mobile-col">{{ $t('orders.vat') }}</p>
                  <p class="right-align">{{ order.currency }} {{ vatCurrencyFormat(order.id) }}</p>
                </div>

                <div class="orders__list-col bid-in"></div>
                <div class="orders__list-col center-action">
                  <P class="orders__mobile-col uppercase">{{ $t('orders.action') }}</P>
                  <div class="orders__statuses">
                    <span>
                      <p class="orders__confirm-icon confirmedbutton orders__buttons" v-if="confirmedStatus(order)">{{ $t('orders.confirmed') }}</p>
                      <p class="orders__confirm-icon in-transitButton orders__buttons" v-if="inTransitStatus(order)"> {{ $t('orders.in_transit') }}</p>
                      <p class="orders__confirm-icon deliveredButton orders__buttons" v-if="deliveredStatus(order)">{{ $t('orders.delivered') }}</p>
                      <p class="orders__confirm-icon pendingDnotes orders__buttons" v-if="pendingDnotes(order)"> {{ $t('orders.pending_d_notes') }}</p>
                      <p class="orders__confirm-icon cancelledButton orders__buttons" v-if="cancelledStatus(order)"> {{ $t('orders.cancelled') }}</p>
                    </span>
                    <span>
                      <i class="material-icons icon arrow" :class="orderStatuses(order)" v-if="opened.includes(order.id)">keyboard_arrow_down</i>
                      <i class="material-icons icon arrow" :class="orderStatuses(order)" v-if="!opened.includes(order.id)">keyboard_arrow_right</i>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="opened.includes(order.id)" :class="'row-' + order.id" :key="order.orderNo">
                <div colspan="8" class="expanded-row">
                  <div class="map-details--go-back" @click="toggle(order.id)">
                    <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
                    <span class="map-details-go-back--span">{{ $t('orders.back') }}</span>
                  </div>
                  <div class="map__column">
                    <img :src="createStaticMapUrl(order)" class="map" />
                    <div class="map__details-row">
                      <div class="map__details-col">
                        <p class="map__details-pickup heading uppercase">{{ $t('orders.pickup_location') }}</p>
                        <p class="map__details-pickup par">{{ order.from_name }}</p>
                        <p class="map__details-date heading uppercase">{{ $t('orders.date_and_time') }}</p>
                        <p class="map__details-date par">{{ timeFormat(order.id) }}</p>
                      </div>
                      <div class="map__details-col">
                        <p class="map__details-dest heading uppercase">{{ $t('orders.destination') }}</p>
                        <p class="map__details-dest par">{{ order.to_name }}</p>
                        <p class="map__details-distance heading uppercase">{{ $t('orders.distance') }}</p>
                        <p class="map__details-distance par">{{ order.distance }}</p>
                        <p class="map__details-date heading uppercase"> {{ $t('orders.order_type') }}</p>
                        <p class="map__details-date par" v-if="order.order_type === 'Normal order'">{{ order.order_type }}</p>
                        <p class="map__details-date par capitalize-text" v-else>{{ order.order_type.order_type_tag.replace(/_/g, " ") }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="order__column">
                    <p class="order__weight heading uppercase"> {{ $t('orders.weight_of_order') }}</p>
                    <p class="order__weight par" v-if="!weight">{{ $t('orders.not_applicable') }}</p>
                    <p class="order__weight par" v-else>{{ weight }}</p>
                    <p class="order__loader heading uppercase">{{ $t('orders.loaders_needed') }}</p>
                    <p class="order__loader par" v-if="!loaders">{{ $t('orders.not_applicable') }}</p>
                    <p class="order__loader par" v-else>{{ loaders }}</p>
                    <p class="order__loadtype heading uppercase"> {{ $t('orders.type_of_load') }}</p>
                    <p class="order__loadtype par" v-if="!load">{{ $t('orders.not_applicable') }}</p>
                    <p class="order__loadtype par" v-else>{{ load }}</p>
                    <p class="order__notes heading uppercase"> {{ $t('orders.notes') }}</p>
                    <p class="order__notes par">{{ orderNotes(order.id) }}</p>
                  </div>
                  <div class="order__column">
                    <p class="order__amount heading uppercase">{{ $t('orders.amount') }}</p>
                    <p class="order__amount par">{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                    <div v-if="order.confirmStatus === 1 && order.orderStatus === 1">
                      <div class="assigned">
                        <p class="order__amount heading uppercase"> {{ $t('orders.vehicle_assigned_Order') }}</p>
                        <p class="order__amount par">{{ confirmedVehicle }}</p>
                      </div>
                      <div class="assigned">
                        <p class="order__amount heading uppercase">{{ $t('orders.driver_assigned_order') }}</p>
                        <p class="order__amount par">{{ confirmedDriver }}</p>
                      </div>
                      <div class="assigned" v-if="pendingDnotes(order)">
                        <p class="order__amount heading uppercase"> {{ $t('orders.delivery_status') }}</p>
                        <p class="order__amount par"> {{ $t('orders.d_notes_not_delivered') }}</p>
                      </div>
                      <div class="assigned" v-if="orderStatuses(order) === 'confirmedbutton'">
                        <button class="intransit--order__button order__button" @click="completeOrder(order, 'rider_app_pick_up')" v-if="sessionInfo.super_user">
                          {{ $t('orders.pickup_the_order') }}
                          <div class="loading-spinner intransit--order__spinner" v-if="orderLoadingStatus"></div>
                        </button>
                      </div>
                      <div class="assigned" v-if="orderStatuses(order) === 'in-transitButton'">
                        <button class="complete--order__button order__button" @click="completeOrder(order, 'rider_app_deliver')" v-if="sessionInfo.super_user">
                          {{ $t('orders.complete_order') }}
                          <div class="loading-spinner complete--order__spinner" v-if="orderLoadingStatus"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <notify />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import timezone from '../mixins/timezone';
import notify from '../components/notification.vue';
import verifier from '../components/verifier.vue';
import errorHandler from '../components/errorHandler.vue';

let interval = '';

export default {
  title: 'Partner Portal - My Orders',
  components: {
    verifier,
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
      responseNo: 0,
      confirmedDriver: null,
      confirmedVehicle: null,
      loadingStatus: true,
      orderLoadingStatus: false,
      fetchOrderStatus: false,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      errorObj: '',
      ordercount: [],
      orderRange: '0 - 100',
      pay_method: 0,
      payment_methods: [],
      loaderMessage: this.$t('orders.no_orders'),
    };
  },
  computed: {
    paymentMethods() {
      let methods = [];
      if (this.pay_method === 1) {
        methods = [5];
        return methods;
      }
      if (this.pay_method === 2) {
        this.payment_methods.forEach(row => {
          if (row !== 5) {
            methods.push(row);
          }
        });
        return methods;
      }
      methods = this.payment_methods;
      return methods;
    },
    filteredOrders() {
      const orders = [];
      this.orders.forEach(row => {
        if (this.paymentMethods.includes(row.pay_method)) {
          orders.push(row);
        }
      });
      return orders;
    },
  },
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
      this.$router.push('/orders');
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    regcounter(id) {
      this.regOk = id;
    },
    createStaticMapUrl(path) {
      const google_key = process.env.GOOGLE_API_KEY;
      const from_cordinates = path.from;
      const to_cordinates = path.to;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=500x200&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    insucounter(id) {
      this.insuOk = id;
    },
    driverNameCounter(id) {
      this.driverNameOk = id;
    },
    IDCounter(id) {
      this.IDOk = id;
    },
    DLCounter(id) {
      this.DLOk = id;
    },
    driverPhoneCounter(id) {
      this.drivePhoneOk = id;
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
    timeFormat(id) {
      const orderTime = this.orders[id - 1].orderTime;
      return this.formatedTime(orderTime);
    },
    confirmedStatus(order) {
      if (this.orderStatuses(order) === 'confirmedbutton') {
        return true;
      }
    },
    inTransitStatus(order) {
      if (this.orderStatuses(order) === 'in-transitButton') {
        return true;
      }
    },
    deliveredStatus(order) {
      if (this.orderStatuses(order) === 'deliveredButton') {
        return true;
      }
    },
    pendingDnotes(order) {
      if (this.orderStatuses(order) === 'pendingDnotes') {
        return true;
      }
    },
    cancelledStatus(order) {
      if (this.orderStatuses(order) === 'cancelledButton') {
        return true;
      }
    },
    orderStatuses(order) {
      if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 0) {
        return 'confirmedbutton';
      } else if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 2) {
        return 'in-transitButton';
      } else if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 3) {
        if (Object.prototype.hasOwnProperty.call(order.delivery_verification, 'physical_delivery_note_status') && order.delivery_verification.physical_delivery_note_status) {
          if (order.delivery_notes && Object.prototype.hasOwnProperty.call(order.delivery_notes[0], 'physical_delivery_note_status') && order.delivery_notes[0].physical_delivery_note_status === 2) {
            return 'deliveredButton';
          } else {
            return 'pendingDnotes';
          }
        } else {
          return 'deliveredButton';
        }
      } else {
        return 'cancelledButton';
      }
    },
    currencyFormat(id) {
      const amount = this.orders[id - 1].amount;
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
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
    formatDistance(id) {
      const distance = this.orders[id - 1].distance;
      const num = distance.replace(/\D+$/g, '');
      return Math.round(num);
    },
    orderNotes(id) {
      if (this.orders[id - 1].orderNotes) {
        return this.orders[id - 1].orderNotes.slice(7, 10000);
      } else {
        return 'No notes';
      }
    },
    shortFromName(id) {
      if (this.orders[id - 1].from_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].from_name.substr(0, this.orders[id - 1].from_name.indexOf(','));
        if (name.length > 30) {
          return `${name.slice(0, 30)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].from_name.length > 30) {
          return `${this.orders[id - 1].from_name.slice(0, 30)}. . .`;
        } else {
          return this.orders[id - 1].from_name;
        }
      }
    },
    shortToName(id) {
      if (this.orders[id - 1].to_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].to_name.substr(0, this.orders[id - 1].to_name.indexOf(','));
        if (name.length > 30) {
          return `${name.slice(0, 30)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].to_name.length > 30) {
          return `${this.orders[id - 1].to_name.slice(0, 30)}. . .`;
        } else {
          return this.orders[id - 1].to_name;
        }
      }
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.splice(index, 1); // this allows you to open only one tab at a time.
        this.opened.push(id);
      }
      this.count = null;
      this.count1 = null;
      this.ownerPhone = this.sessionInfo.phone;
      this.vendorType = this.orders[id - 1].vendor_type;
      this.ownerId = this.sessionInfo.id;
      this.closed = this.orders[id - 1].carrier_type;
      this.orderNo = this.orders[id - 1].order_no;
      this.message = null;
      this.confirmedDriver = this.orders[id - 1].confirmedDriver;
      this.confirmedVehicle = this.orders[id - 1].confirmedVehicle;
      if (this.orders[id - 1].package_details) {
        if (this.orders[id - 1].package_details.load_weight) {
          this.weight = `${this.orders[id - 1].package_details.load_weight} ${this.orders[id - 1].package_details.load_units}`;
        } else {
          this.weight = this.$t('orders.no_weight_provided');
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
      const length = document.querySelectorAll('.row1').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row1')[i].parentNode;
        const searched = document.querySelectorAll('.row1')[i].innerHTML.toLowerCase();
        if (searched.indexOf(input) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
    },
    filterDest() {
      const input = document.getElementById('dst').value;
      const input1 = input.toLowerCase();
      const length = document.querySelectorAll('.row2').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row2')[i].parentNode;
        const searched = document.querySelectorAll('.row2')[i].innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
    },
    filterVendor() {
      this.refresh();
      const input = document.getElementById('vend').value;
      const show = document.querySelectorAll('.orders__list-toprow').length;
      for (let i = 0; i < show; i++) {
        const hidden = document.querySelectorAll('.orders__list-toprow')[i];
        hidden.style.display = 'grid';
      }
      const input1 = input.toLowerCase();
      const length = document.querySelectorAll('.row3').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row3')[i].parentNode;
        const searched = document.querySelectorAll('.row3')[i].innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
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
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    completeOrder(order, url) {
      const payload = JSON.stringify({
        sim_card_sn: order.driverSerial,
        rider_phone: order.driverPhone,
        order_no: order.orderNo,
        destination: {
          lat: -1.23,
          lng: 38.45,
        },
        distance: 9,
        polyline: 'encoded_string',
        version_code: 1000,
      });
      this.orderLoadingStatus = true;
      axios
        .post(`${process.env.VUE_APP_AUTH}orders/${url}`, payload, this.config)
        .then(response => {
          this.orderLoadingStatus = false;
          this.notify(3, 1, response.data.reason);
          this.definePayload();
        })
        .catch(error => {
          this.orderLoadingStatus = false;
          this.notify(3, 0, error.response.data);
        });
    },
    refreshOrders(ordpayload) {
      interval = setInterval(() => {
        let order = '';
        let openid = '';
        let allDetails = '';
        if (this.opened[0]) {
          openid = this.opened[0];
          order = this.orders[openid - 1].orderNo;
        }
        this.ownerPhone = this.sessionInfo.phone;
        const orderPayload = JSON.stringify(ordpayload);
        axios
          .post(`${this.auth}v1/list_owner_orders/`, orderPayload, this.config)
          .then(response => {
            const unescaped = response.data;
            this.orders = [];
            unescaped.data.forEach((row, i) => {
              allDetails = this.populateOrders(row, i);
              if (order === allDetails.orderno) {
                this.opened = [];
                this.opened.push(i + 1);
              }
              if (!this.bikesOnly) {
                this.orders.push(allDetails);
              }
            });
          })
          .catch(error => {
            this.errorObj = error.response;
            if (error.response) {
              //   this.loadingStatus = false;
            }
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
    getOrders(ordpayload) {
      this.loadingStatus = true;
      this.ownerPhone = this.sessionInfo.phone;
      const orderPayload = JSON.stringify(ordpayload);
      axios
        .post(`${this.auth}v1/list_owner_orders/`, orderPayload, this.config)
        .then(response => {
          const unescaped = response.data;
          if (response.data.status) {
            if (this.ordercount.length === 0) {
              const multiplier = response.data.count / 100;
              for (let i = 0; i < Math.floor(multiplier); i++) {
                this.ordercount.push(`${i * 100} - ${(i + 1) * 100}`);
              }
              this.ordercount.push(`${Math.floor(multiplier) * 100} - ${response.data.count}`);
              this.orderRange = this.ordercount[0];
            }
            unescaped.data.forEach((row, i) => {
              this.orders.push(this.populateOrders(row, i));
              this.responseNo = 1;
              this.loadingStatus = false;
            });
            if (this.$route.path === '/orders') {
              this.refreshOrders(ordpayload);
            }
          } else {
            this.loadingStatus = false;
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.loaderMessage = this.$t('orders.experiencing_some_issues');
            this.loadingStatus = false;
          }
        });
    },
    populateOrders(row, i) {
      const orderno = row.order_no;
      const time = row.date_time;
      const driver = row.rider_name;
      const vehicle = row.vehicle_reg_no;
      const vendorname = row.vendor_disp_name;
      const orderStatus = row.order_status;
      const confirmStatus = row.confirm_status;
      const unescaped1 = JSON.parse(row.order_details);
      const orderDetails = unescaped1.values;
      const priceDetails = JSON.parse(row.price_details);
      if (row.rider_deliver_img) {
        orderDetails.delivery_notes = JSON.parse(row.rider_deliver_img);
      }
      if (priceDetails.order_currency) {
        orderDetails.currency = priceDetails.order_currency;
      } else {
        orderDetails.currency = 'KES';
      }
      if (row.order_notes.length > 0) {
        orderDetails.orderNotes = row.order_notes[0].msg;
      }
      if (row.customer_min_amount) {
        orderDetails.amount = row.amount;
      } else {
        orderDetails.amount = row.take_home;
      }
      if (!this.payment_methods.includes(orderDetails.pay_method)) {
        this.payment_methods.push(orderDetails.pay_method);
      }
      orderDetails.orderNo = orderno;
      orderDetails.id = i + 1;
      orderDetails.confirmed = 0;
      orderDetails.vendorname = vendorname;
      orderDetails.orderTime = time;
      orderDetails.confirmedDriver = driver;
      orderDetails.driverPhone = row.rider_phone_no;
      orderDetails.driverSerial = row.rider_serial_number;
      orderDetails.confirmedVehicle = vehicle;
      orderDetails.orderStatus = orderStatus;
      orderDetails.confirmStatus = confirmStatus;
      orderDetails.delivery_status = row.delivery_status;
      orderDetails.vat_amount = row.vat_amount;
      orderDetails.order_type = Object.prototype.hasOwnProperty.call(JSON.parse(row.order_details).values, 'dedicated_order_details') ? JSON.parse(row.order_details).values.dedicated_order_details : this.$t('orders.normal_order');
      return orderDetails;
    },
  },
};
</script>

<style>
.capitalize-text {
  text-transform: capitalize;
}
</style>
