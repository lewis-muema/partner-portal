<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab" v-if="!createOrderStatus">
      <div class="truckflow__container-outer">
        <div class="freight__container">
          <div class="truckflow__container-search">
            <span class="container__search-input">
              <input type="text" onfocus="value = ''" class="container__search-element" id="inp" :placeholder="$t('freightOrders.enter_pickup')" @input="filterPickup()" @keyup.delete="refresh()" />
            </span>
            <span class="container__search-input">
              <input type="text" onfocus="value = ''" class="container__search-element" id="dst" :placeholder="$t('freightOrders.enter_destination')" @input="filterDest()" @keyup.delete="refresh()" />
            </span>
          </div>
        </div>
        <div class="bids">
          <div id="orders__list-table" class="orders__list-table">
            <div class="orders__list-toprow table-head">
              <div class="orders__col-head pickup-freight uppercase">{{ $t('freightOrders.pickup_location') }}</div>
              <div class="orders__col-head destination-freight uppercase">{{ $t('freightOrders.destination') }}</div>
              <div class="orders__col-head pick-date-freight uppercase">{{ $t('freightOrders.pickup_date') }}</div>
              <div class="orders__col-head truck-freight uppercase">{{ $t('freightOrders.truck') }}</div>
              <div class="orders__col-head client-freight">{{ $t('freightOrders.client') }}</div>
              <div class="orders__col-head price-align-freight uppercase">{{ $t('freightOrders.no_of_trucks') }}</div>
              <div class="orders__col-head center-action-freight uppercase"></div>
            </div>
            <div class="loading" v-if="loadingStatus && orders.length === 0"></div>
            <div class="no-records" v-if="!loadingStatus && orders.length === 0">
              <p class="no-records-par">{{ loaderMessage }}</p>
            </div>
            <template v-for="(order, index) in orders">
              <div
                class="orders__list-row"
                @click="openOrder(order)"
                :key="order.id"
              >
                <div class="orders__list-col pickup-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.pickup') }}</p>
                  <p class="row1" @mouseover="showFromTooltip(index)" @mouseout="hideFromTooltip(index)">{{ order.pickup }}</p>
                  <span :class="`tooltiptext sp${index}`">{{ order.pickup }}</span>
                </div>
                <div class="orders__list-col destination-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.destination') }}</p>
                  <p class="row2" @mouseover="showToTooltip(index)" @mouseout="hideToTooltip(index)">{{ order.destination }}</p>
                  <span :class="`tooltiptext sps${index}`">{{ order.destination }}</span>
                </div>
                <div class="orders__list-col pick-date-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.date') }}</p>
                  <p>{{ timeFormat(index) }}</p>
                </div>
                <div class="orders__list-col truck-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.truck') }}</p>
                  <p class="row3">{{ order.cargo_type }}</p>
                </div>
                <div class="orders__list-col client-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.client') }}</p>
                  <p>{{ order.customer_name }}</p>
                </div>
                <div class="orders__list-col price-align-freight">
                  <p class="orders__mobile-col">{{ $t('freightOrders.no_of_trucks') }}</p>
                  <p>{{ order.total_trucks }} {{ $t('freightOrders.trucks') }}</p>
                </div>
                <div class="orders__list-col center-action-freight">
                  <P class="orders__mobile-col uppercase">{{ $t('freightOrders.action') }}</P>
                  <div class="orders__statuses">
                    <span>{{ $t('freightOrders.view') }} ></span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="freight-create-order-container" v-else>
      <div class="map-details--go-back-freight" @click="$store.commit('setCreateOrderStatus', false)">
        <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
        <span class="map-details-go-back--span">{{ $t('freightOrders.back') }}</span>
      </div>
      <orderCreation />
    </div>
    <notify />
  </div>
</template>
<script>
import axios from 'axios';
import 'file-viewer';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification.vue';
import verifier from '../../components/verifier.vue';
import errorHandler from '../../components/errorHandler.vue';
import orderCreation from './orderCreation.vue';

export default {
  title: 'Partner Portal - Freight Orders',
  components: {
    verifier,
    errorHandler,
    notify,
    orderCreation,
  },
  mixins: [timezone],
  data() {
    return {
      auth: process.env.VUE_APP_AUTH,
      loadingStatus: true,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      errorObj: '',
      loaderMessage: this.$t('freightOrders.no_orders'),
    };
  },
  computed: {
    orders() {
      return this.$store.getters.getFreightOrders;
    },
    createOrderStatus() {
      return this.$store.getters.getCreateOrderStatus;
    },
  },
  watch: {
    createOrderStatus(val) {
      if (!val) {
        this.fetchOrders();
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchOrders();
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
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
      const orderTime = this.orders[id].pickup_time;
      return this.formatedTime(orderTime);
    },
    currencyFormat(id) {
      const amount = this.orders[id].amount ? this.orders[id].amount : 0;
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
    },
    openOrder(order) {
      this.$router.push(`/freight/orders/${order.quotation_id}`);
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
    refresh() {
      document.querySelectorAll('.orders__list-row').forEach(row => {
        row.style.display = 'grid';
      });
      const inputInp = document.getElementById('inp') ? document.getElementById('inp').value.toLowerCase() : '';
      const inputDst = document.getElementById('dst') ? document.getElementById('dst').value.toLowerCase() : '';
      document.querySelectorAll('.row1').forEach((row1, i) => {
        const classer = row1.parentNode;
        const searchedInp = row1.innerHTML.toLowerCase();
        const searchedDst = document.querySelectorAll('.row2')[i].innerHTML.toLowerCase();
        const searchedVend = document.querySelectorAll('.row3')[i].innerHTML.toLowerCase();
        if (searchedInp.indexOf(inputInp) > -1 && searchedDst.indexOf(inputDst) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    fetchOrders() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/transporters/orders/${this.sessionInfo.id}`, this.config)
          .then(response => {
            this.$store.commit('setFreightOrders', response.data.data);
            this.loadingStatus = false;
            resolve(response);
          })
          .catch(error => {
            this.$store.commit('setFreightOrders', []);
            this.loadingStatus = false;
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
  },
};
</script>

<style>
.capitalize-text {
  text-transform: capitalize;
}
</style>
