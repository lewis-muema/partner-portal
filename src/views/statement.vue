<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="statements__blinder">
      <div class="statement__withdraw-popup statement__row">
        <div class="statement__row">
          <span>{{ $t('statement.withdraw_cash') }}</span>
          <span>
            <i class="material-icons statement__cancel-icon" @click="closePopup">{{ $t('statement.cancel') }}</i>
          </span>
        </div>
        <div v-if="hasExpiredDocuments || hasDisputedOrder" class="expired__docs">
          <div class="expired__message">
            <i class="el-icon-warning expired__icon"></i>
            <p><span v-if="hasDisputedOrder">{{ $t('statement.order_dispute_msg') }}</span> <span v-else-if="hasExpiredDocuments">{{ $t('statement.expired_doc_msg') }}</span></p>
          </div>
          <div class="expired__body">
            <div v-if="hasDisputedOrder" class="dispute__panel">
              <p>{{ disputedOrders[0].order_no }}</p>
              <p>{{ disputedOrders[0].date }}</p>
              <p>{{ disputedOrders[0].pick_up_location }}</p>
            </div>
            <div v-else-if="hasExpiredDocuments" class="expired__panel">
              <div>
                <p>{{ $t('statement.driving_licences') }}</p>
                <p>{{ expiredDocuments[0].rider_name }}</p>
                <p style="color:rgba(188, 80, 0, 1)">
                  {{ $t('statement.exp_date') }} {{ expiredDate }}
                </p>
              </div>
              <router-link to="/documents"><button class="btn btn-primary text-capitalize">{{ $t('statement.btn_update') }}</button></router-link>
            </div>
          </div>
          <span v-if="hasDisputedOrder"><a target="_blank" href="http://support.sendyit.com/collection/66-customer-support"><button style="margin:20px 0px" class="btn btn-primary text-capitalize">{{ $t('statement.contact_support') }}</button></a></span>
          <p v-else-if="hasExpiredDocuments" class="expired__text">{{ $t('statement.trouble') }}<a target="_blank" href="http://support.sendyit.com/collection/66-customer-support"><span style="color:rgba(238, 125, 0, 1)">{{ $t('statement.contact_support') }}</span></a></p>
        </div>
        <div v-else>
          <div v-if="payable_amount" class="withdraw-modal-screen">
            <div class="statement__row statement__add-bank-tab">
              <p class="small-margin statement__error-box-header color-white">{{ withdrawHead }}</p>
              <p class="small-margin color-white">{{ withdrawError }}</p>
              <router-link to="/banks" v-if="addAccountStatus">
                <p class="small-margin statement__bg-orange">+ {{ $t('statement.add_bank_account') }}</p>
              </router-link>
            </div>
            <div class="statement__row statement__divided-row">
              <span class="statement__column-3">
                <i class="material-icons statement__wallet">account_balance_wallet</i>
              </span>
              <span class="statement__column-9">
                <p class="no-margin large-font">{{ $t('statement.balance') }}</p>
                <p class="no-margin large-font">{{ ownerRb.currency }} {{ Math.floor(ownerRb.running_balance * -1) }}</p>
              </span>
            </div>
            <div class="statement__row">
              <input id="withdrawalAmount" type="text" placeholder="Enter amount" class="full-width input-height input-border" v-model="amount" @input="checkDetails()" @keyup.delete="checkDetails()" :maxlength="amountLength" />
            </div>
            <div class="statement__row">
              <button id="continue" class="full-width input-height withdraw-buttons statement__withdraw-button" v-if="sendWithdrawStatus" @click="goNext()">{{ $t('statement.next') }}</button>
              <button class="continue full-width input-height withdraw-buttons" disabled v-else>{{ $t('statement.next') }}</button>
            </div>
          </div>
        </div>
        <div class="withdraw-modal-screen-2" v-if="payment_options">
          <div class="statement__row">
            <p class="no-margin x-large-font"> {{ $t('statement.want_paid') }}</p>
          </div>
          <div class="statement__row statement__scrollable-row" v-for="method in payment_methods" :key="method.payment_method_id">
            <div class="withdraw-payment-options">
              <input type="radio" v-model="payment_method" name="profileImg" class="statement__column-2 statement__radio-button-margin radio-1" :value="method.payment_method_id" @click="checkedWithDrawal(method.payment_method_id, 0)" />
              <span class="statement__column-10">
                <p class="no-margin">{{ method.name }}</p>
              </span>
            </div>
          </div>
          <div v-if="displayAccounts" class="withdraw-bank-accounts-list">
            <div class="statement__divided-row centered bank-row" v-for="bankAccount in bankAccounts" :key="bankAccount.id">
              <input type="radio" v-model="payment_account" name="profileImg" class="statement__column-2 statement__radio-button-margin radio-1" :value="bankAccount.id" @click="checkedWithDrawal(payment_method, bankAccount.id)" />
              <span class="statement__column-10">
                <p class="no-margin small-font">{{ bankAccount.bank_name }}</p>
                <p class="no-margin small-font">{{ bankAccount.account_no }}</p>
              </span>
            </div>
            <div v-if="bankAccounts.length === 0">
              {{ $t('statement.dont_have_active_bank_account') }}
            </div>
          </div>
          <div class="statement__row">
            <button class="full-width input-height withdraw-buttons statement__withdraw-button" v-if="allowWithdrawal && (bankAccounts.length > 0 || payment_method === 1)" @click="withdraw()">{{ $t('statement.withdraw_cash') }}</button>
            <button class="input-height" disabled v-else>{{ $t('statement.withdraw_cash') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="print">
      <div class="printContain hidden-sm-down" v-if="windowWidth > 768">
        <div class="row justify-content-between senta">
          <div class="stat-filt col-6">
            <div class="row justify-content-between">
              <div class="col-2 padding">
                <select class="dropdown-filter" v-model="riderId" @change="selectRider(riderId)">
                  <option selected value>{{ $t('statement.driver') }}</option>
                  <option v-for="rider in riders" :value="rider.rider_id" :key="rider.rider_id">{{ rider.f_name }} {{ rider.s_name }}</option>
                </select>
              </div>
              <div class="col-2 padding">
                <select class="dropdown-filter" v-model="vehicleId">
                  <option selected value>{{ $t('statement.vehicle') }}</option>
                  <option v-for="vehicle in vehicles" :value="vehicle.id" :key="vehicle.id">{{ vehicle.registration_no }}</option>
                </select>
              </div>
              <div class="col-3">
                <datepicker v-model="from" input-class="filtIn" id="dtfrom" :placeholder="$t('statement.from')" name="$t('statement.to')"></datepicker>
              </div>
              <div class="col-3 to-date-selector">
                <datepicker v-model="to" input-class="filtIn" id="dtto" :placeholder="$t('statement.to')" name="to"></datepicker>
                <i v-if="to || from || vehicleId || riderId" class="fa fa-times-circle clear-inputs-icon" aria-hidden="true" @click="clearFilters()"></i>
              </div>
              <div class="subFilt col-2">
                <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub" @click="filt()">
                  <i class="fa fa-filter" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="stat-cards col-6 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-end items-align-end">
              <p style="font-size:14px">
                {{ $t('statement.can_withdraw') }} <span class="font-weigth-bold text-success" style="font-weigth:600" v-if="ownerRb">{{ ownerRb.currency }} {{ Math.floor(ownerRb.running_balance * -1) }}</span>
              </p>
            </div>
            <div class="subFilt d-flex justify-content-end items-align-end">
              <button type="button" id="filtSub" name="button" class="btn btn_primary col-4 fil-sub fil-sub-1 active-btn" @click="closePopup()" v-if="activeStatus">{{ $t('statement.withdraw_cash') }}</button>
              <button type="button" id="filtSub" name="button" class="btn btn_primary col-4 fil-sub-disabled fil-sub-1 inactive-btn" @mouseover="showErr(true)" @mouseleave="showErr(false)" v-else>{{ $t('statement.withdraw_cash') }}</button>
              <p class="hidden-btn-error">{{ $t('statement.button_disabled') }}</p>
            </div>
            <div class="d-flex justify-content-end items-align-end mt-2">
              <router-link to="/myWithdrawals"><p style="color:#EE7D00">{{ $t('statement.view') }} <span v-show="activeStatus">{{ $t('statement.previous') }}</span> {{ $t('statement.withdrawals') }}</p></router-link>
            </div>
          </div>
        </div>

        <div class="search-error" id="err">{{ error }}</div>
        <div class="orders__list-currency-filter">
          <div class="orders__list-currencies" v-for="(currency, index) in currencies" :key="index" @click="activeCurrency = currency" :class="activeCurrency === currency ? 'active-currency' : ''">
            {{ currency }}
          </div>
        </div>
        <div class="statement__list-cash-filter">
          <span class="orders__list-cash-selectors" @click="pay_method = 0" :class="pay_method === 0 ? 'cash-selector-active' : ''">{{ $t('statement.all') }}</span>
          <span class="orders__list-cash-selectors" @click="pay_method = 1" :class="pay_method === 1 ? 'cash-selector-active' : ''">{{ $t('statement.cash_orders') }}</span>
          <span class="orders__list-cash-selectors" @click="pay_method = 2" :class="pay_method === 2 ? 'cash-selector-active' : ''"> {{ $t('statement.non_cash') }}</span>
        </div>
        <table id="disp" class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
          <div class="divider-top"></div>
          <datatable ref="input" :columns="columns" :rows="filteredTransactions" :title="$t('statement.statement_for', { name: this.sessionInfo.name, monthPeriod: monthPeriod })" :per-page="[10, 20, 30, 40, 50]" :default-per-page="10" :clickable="false" :sortable="true" :exact-search="true" :exportable="true" :locale="language"></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-else>
        <div class="col-12 padding margin-bottom">
          <datepicker v-model="from" input-class="filtIn" id="dtfrom" :placeholder="$t('statement.from')" name="from"></datepicker>
        </div>
        <div class="col-12 padding margin-bottom to-date-selector">
          <datepicker v-model="to" input-class="filtIn to-filter-input" id="dtto" :placeholder="$t('statement.to')" name="to"></datepicker>
          <i v-if="to || from || vehicleId || riderId" class="fa fa-times-circle clear-inputs-icon" aria-hidden="true" @click="clearFilters()"></i>
        </div>
        <div class="subFilt col-12 padding margin-bottom">
          <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub centered-btn" @click="filt()">
            <i class="fa fa-filter" aria-hidden="true"></i>
          </button>
        </div>
        <div class="search-error" id="err">{{ error }}</div>
        <div class="withdrawal-button-mobile">
          <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub fil-sub-1 active-btn" @click="closePopup()" v-if="activeStatus"> {{ $t('statement.withdraw_cash') }}</button>
          <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub-disabled fil-sub-1 inactive-btn" @mouseover="showErr(true)" @mouseleave="showErr(false)" v-else>{{ $t('statement.withdraw_cash') }}</button>
        </div>
        <div class="orders__list-currency-filter-mobile">
          <div class="orders__list-currencies" v-for="(currency, index) in currencies" :key="index" @click="activeCurrency = currency" :class="activeCurrency === currency ? 'active-currency' : ''">
            {{ currency }}
          </div>
        </div>
        <div class="statement__list-cash-filter">
          <span class="orders__list-cash-selectors" @click="pay_method = 0" :class="pay_method === 0 ? 'cash-selector-active' : ''">{{ $t('statement.all') }}</span>
          <span class="orders__list-cash-selectors" @click="pay_method = 1" :class="pay_method === 1 ? 'cash-selector-active' : ''">{{ $t('statement.cash_orders') }}</span>
          <span class="orders__list-cash-selectors" @click="pay_method = 2" :class="pay_method === 2 ? 'cash-selector-active' : ''">{{ $t('statement.non_cash') }}</span>
        </div>
        <p v-if="filteredTransactions.length === 0" class="no-loans"> {{ $t('statement.no_mode_found', { mode: mode }) }}</p>
        <div class="statement__mobile-view" v-for="row in filteredTransactions" :key="row.id">
          <table class="table-responsive mobile-table">
            <thead class="thead-mobile">
              <tr>
                <th>{{ $t('statement.amount') }}</th>
                <th>{{ $t('statement.balance') }}</th>
              </tr>
            </thead>
            <tr class="divider">
              <td class="statement__txt-orange">{{ row.amount }}</td>
              <td class="statement__txt-blue">{{ row.running_balance }}</td>
            </tr>
            <tr>
              <td>{{ row.txn }}&nbsp;({{ row.pay_narrative }})</td>
              <td>{{ row.pay_time }}</td>
            </tr>
          </table>
        </div>
      </div>
      <notify />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import DataTable from 'vue-materialize-datatable';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import axios from 'axios';
import Mixpanel from 'mixpanel';
import notify from '../components/notification.vue';
import verifier from '../components/verifier.vue';
import errorHandler from '../components/errorHandler.vue';
import timezone from '../mixins/timezone';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  title: 'Partner Portal - Statement',
  components: {
    verifier,
    Datepicker,
    datatable: DataTable,
    errorHandler,
    notify,
  },
  mixins: [timezone],
  data() {
    return {
      sessionInfo: '',
      payment_options: false,
      payment_methods: [],
      statement_payment_methods: [],
      payment_method: '',
      payment_account: '',
      payable_amount: true,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      columns: [
        { label: 'Txn No', field: 'txn' },
        { label: this.$t('statement.date'), field: 'pay_time' },
        { label: this.$t('statement.amount'), field: 'amount' },
        { label: this.$t('statement.balance'), field: 'running_balance' },
        { label: this.$t('statement.narrative'), field: 'pay_narrative' },
        { label: this.$t('statement.driver_name'), field: 'rider_name' },
      ],
      page: 1,
      rows: [
        {
          rider_id: 1,
          txn: 1,
          pay_time: 1,
          amount: 1,
          running_balance: 1,
          pay_narrative: 1,
        },
      ],
      from: '',
      to: '',
      error: '',
      windowWidth: '',
      ownerRbs: '',
      ownerBalance: '',
      bankAccounts: [],
      allBanks: [],
      opened: false,
      sendWithdrawStatus: false,
      amount: '',
      bankId: '',
      amountLength: '',
      mpesaWithdrawal: false,
      bankWithdrawal: false,
      responseCount: 0,
      selectedRow: '',
      responseNumber: 0,
      checked: 0,
      withdrawError: '',
      addAccountStatus: false,
      withdrawHead: '',
      notificationMessage: '',
      notificationType: 'failed',
      notificationName: 'message-box',
      sendingWithdrawRequestStatus: false,
      activeStatus: false,
      withdrawDay: '',
      withdrawTime: '',
      day: '',
      showWithdrawErr: '',
      vehicles: [],
      riders: [],
      vehicleId: '',
      riderId: '',
      riderNames: this.$t('statement.all_riders'),
      vehArray: [],
      monthPeriod: '',
      errorObj: '',
      payload: '',
      pay_method: 0,
      fetchingStatus: false,
      currencies: [],
      activeCurrency: '',
      hasDisputedOrder: false,
      hasExpiredDocuments: false,
      disputedOrders: [],
      expiredDocuments: [],
    };
  },
  computed: {
    language() {
      if (localStorage.getItem('language')) {
        return localStorage.getItem('language').split('-')[0];
      }
      return 'en';
    },
    displayAccounts() {
      return this.payment_method === 10;
    },
    allowWithdrawal() {
      return this.payment_method !== '';
    },
    paymentMethods() {
      let methods = [];
      if (this.pay_method === 1) {
        methods = [5];
        return methods;
      }
      if (this.pay_method === 2) {
        this.statement_payment_methods.forEach(row => {
          if (row !== 5) {
            methods.push(row);
          }
        });
        return methods;
      }
      methods = this.statement_payment_methods;
      return methods;
    },
    filteredTransactions() {
      const statements = [];
      this.rows.forEach(row => {
        if (this.paymentMethods.includes(row.pay_method) && row.currency === this.activeCurrency) {
          statements.push(row);
        }
      });
      return statements;
    },
    mode() {
      if (this.pay_method === 0) {
        return this.$t('statement.statement');
      } else if (this.pay_method === 1) {
        return this.$t('statement.cash_orders_small');
      }
      return this.$t('statement.non_cash_orders_small');
    },
    ownerRb() {
      if (this.ownerRbs) {
        let rb;
        this.ownerRbs.forEach(row => {
          if (row.currency === this.activeCurrency) {
            rb = row;
          }
        });
        return rb;
      }
      return '';
    },
    expiredDate() {
      return new Date(this.expiredDocuments[0].driving_license.expiry_date).toDateString() || '';
    },
  },
  watch: {
    pay_method() {
      if (this.filteredTransactions.length === 0 && !this.fetchingStatus) {
        this.displayFetchingStatus(this.$t('statement.no_mode_found', { mode: this.mode }), 0);
      } else {
        this.removeFetchingStatus();
      }
    },
    filteredTransactions() {
      this.$refs.input.currentPage = 1;
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.monthPeriod = moment()
        .utc()
        .local()
        .format('MMMM YYYY');
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.displayFetchingStatus('Fetching statement', 0);
      this.getVehicles().then(res1 => {
        this.fetchStatement(1).then(res2 => {
          this.fetchAllBanks().then(res3 => {
            this.fetchOwnerBanks();
          });
        });
      });
    }
    this.fetchExpiredDocuments();
    this.fetchDisputedOrders();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    clearFilters() {
      this.to = '';
      this.from = '';
      this.vehicleId = '';
      this.riderId = '';
      this.fetchStatement(1).then(res2 => {
        this.fetchAllBanks().then(res3 => {
          this.fetchOwnerBanks();
        });
      });
    },
    getPaymentOptions() {
      const payload = {
        country_code: this.sessionInfo.country_code,
        currency: this.activeCurrency,
        account_type: 'Owner',
        amount: parseFloat(this.amount),
        entry_point: 'Partner Portal',
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}localisation/accounts/pay_methods`, payload, this.config)
        .then(response => {
          this.payment_methods = JSON.parse(JSON.stringify(response.data.payment_methods));
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    getVehicles() {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/vehicles`, payload, this.config)
          .then(response => {
            this.vehArray = response.data.vehicles;
            this.listVehicles();
            this.listRiders();
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    filt() {
      if (this.to === '' || this.from === '') {
        this.error = this.$t('statement.please_select_both');
        setTimeout(() => {
          this.error = '';
        }, 4000);
      } else {
        this.monthPeriod = `${moment(this.from).format('DD MMMM YYYY')} - ${moment(this.to).format('DD MMMM YYYY')}`;
        this.fetchStatement(2);
      }
    },

    fetchStatement(requestType) {
      return new Promise((resolve, reject) => {
        const payload = this.definePayload(requestType);
        this.displayFetchingStatus('Fetching statement', 0);
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_statement`, payload, this.config)
          .then(response => {
            this.currencies = response.data.details.owner_balance.currencies;
            this.activeCurrency = this.currencies[0];
            this.ownerRbs = response.data.details.owner_balance.rb;
            this.ownerBalance = response.data.details.owner_balance;
            if (requestType === 1) {
              this.showWithdrawButton();
            } else {
              $('#filtSub').html('<i class="fa fa-filter" aria-hidden="true"></i>');
              this.removeFetchingStatus();
            }
            if (response.data.details.statement.length > 0) {
              this.handleResponse(response);
            } else {
              this.rows = [];
              this.displayFetchingStatus(this.$t('statement.no_mode_found', { mode: this.mode }), 0);
            }
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    definePayload(requestType) {
      let firstDay = '';
      let lastDay = '';
      let payload = '';
      this.rows = [];
      if (requestType === 1) {
        firstDay = moment()
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
        lastDay = moment()
          .endOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          from: firstDay,
          to: lastDay,
        });
      } else {
        $('#filtSub').html(`<div class="loading-spinner"></div> ${this.$t('statement.loading')}`);
        firstDay = `${moment(this.from).format('YYYY-MM-DD')} 00:00:00`;
        lastDay = `${moment(this.to).format('YYYY-MM-DD')} 23:59:59`;
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          from: firstDay,
          to: lastDay,
          vehicle_id: this.vehicleId === '' ? null : this.vehicleId,
          rider_id: this.riderId === '' ? null : this.riderId,
        });
      }
      return payload;
    },
    dateFormat(date) {
      const UTCDate = this.convertToUTC(date);
      const local = this.convertToLocalTime(UTCDate);
      return local;
    },
    handleResponse(response) {
      const record = [];
      response.data.details.statement.forEach((row, i) => {
        const rbRb = row.running_balance;
        const currencyRb = row.currency;
        const rbAmount = row.amount;
        const currencyAmount = row.currency;
        if (!this.statement_payment_methods.includes(row.payment_method)) {
          this.statement_payment_methods.push(row.payment_method);
        }
        record.push({
          txn: row.txn,
          pay_time: this.dateFormat(row.pay_time),
          amount: `${currencyAmount} ${rbAmount}`,
          running_balance: `${currencyRb} ${rbRb}`,
          pay_narrative: row.pay_narrative,
          rider_name: row.rider_name,
          id: i,
          pay_method: row.payment_method,
          currency: row.currency,
        });
      });
      this.removeFetchingStatus();
      this.rows = record;
    },
    displayFetchingStatus(message, time) {
      if (message === 'Fetching statement') {
        this.fetchingStatus = true;
      } else {
        this.fetchingStatus = false;
      }
      setTimeout(() => {
        if (document.getElementsByTagName('tbody').length > 0) {
          const list = document.getElementsByTagName('tbody')[0];
          list.innerHTML = `<tr class="records-placeholder"><td colspan="6" style="text-align: center;">${message}</td></tr>`;
        }
      }, time);
    },
    removeFetchingStatus() {
      this.fetchingStatus = false;
      const element = document.querySelector('.records-placeholder');
      if (typeof element !== 'undefined' && element !== null) {
        element.parentNode.removeChild(element);
      }
    },
    closePopup() {
      this.sendWithdrawStatus = false;
      this.payable_amount = true;
      this.payment_options = false;
      if (this.opened) {
        this.notify(2);
        this.opened = false;
        document.querySelector('.statements__blinder').style.display = 'none';
        this.addAccountStatus = false;
      } else {
        this.opened = true;
        document.querySelector('.statements__blinder').style.display = 'flex';
        this.amount = '';
      }
    },
    checkDetails() {
      this.amount = this.amount.toString().replace(/[^0-9]/g, '');
      this.sendWithdrawStatus = parseInt(this.amount, 10) <= parseInt(this.ownerRb.running_balance, 10) * -1 && parseInt(this.amount, 10) >= 101;
    },
    checkedWithDrawal(option, value) {
      if (option === 1) {
        this.mpesaWithdrawal = true;
        this.bankWithdrawal = false;
        this.checked = 1;
        this.checkDetails();
      } else if (option === 10) {
        // this.displayAccounts();
        this.selectedRow = value;
        this.bankWithdrawal = true;
        this.mpesaWithdrawal = false;
        this.checked = 1;
        this.checkDetails();
        const bankName = this.bankAccounts[value].bank_name.toString();
        const filterObj1 = this.allBanks.filter(e => e.name === bankName);
        if (filterObj1.length > 0) {
          this.bankId = filterObj1[0].payment_bank_id;
        } else {
          this.bankId = '';
        }
      }
    },
    goNext() {
      this.getPaymentOptions();
      this.payment_options = true;
      this.payable_amount = false;
    },
    withdraw() {
      this.sendWithdrawStatus = false;
      this.notify(1, 2, this.$t('statement.sending_request'));
      if (this.mpesaWithdrawal && !this.bankWithdrawal) {
        this.constructPayload(1);
      } else if (!this.mpesaWithdrawal && this.bankWithdrawal) {
        this.constructPayload(2);
      }
    },
    constructPayload(paymethod) {
      let payload = '';
      let notification = '';
      if (paymethod === 1) {
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          phone_no: this.sessionInfo.phone,
          payment_type: paymethod,
          amount: this.amount,
        });
        notification = this.$t('statement.withdraw_processed_mpesa', { amount: this.amount });
      } else {
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          account_no: this.bankAccounts[this.selectedRow].account_no,
          payment_type: paymethod,
          amount: this.amount,
          payment_bank_id: this.bankId,
        });
        notification = this.$t('statement.withdraw_processed_bank', { amount: this.amount });
      }
      this.payload = payload;
      this.sendWithdrawRequest(payload, notification, paymethod);
    },
    sendWithdrawRequest(payload, notification, paymethod) {
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/initiate_cash_withdrawal`, payload, this.config)
        .then(response => {
          const parsedResponse = response.data;
          if (parsedResponse.status) {
            this.$router.push({ name: 'withdrawal-status', params: { id: parsedResponse.reference_no } });
            this.notify(1, 1, response.data.message);
            this.from = '';
            this.to = '';
            setTimeout(() => {
              if (this.opened) {
                this.closePopup();
              }
              this.fetchStatement(1);
            }, 4000);
            if (paymethod === 1) {
              this.trackMpesaWithdrawal(payload);
            } else {
              this.trackBankWithdrawal(payload);
            }
          } else {
            this.notify(1, 0, response.data.message);
            setTimeout(() => {
              this.notify(2);
              this.fetchStatement(1);
            }, 4000);
          }
        })
        .catch(error => {
          this.notify(1, 0, error.response.data.message);
          setTimeout(() => {
            this.notify(2);
            this.fetchStatement(1);
          }, 4000);
        });
    },
    fetchOwnerBanks() {
      return new Promise((resolve, reject) => {
        this.responseCount = 0;
        this.bankAccounts = [];
        const payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        let counter = -1;
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/get_owner_bank_accounts`, payload, this.config)
          .then(response => {
            const parsedResponse = response.data;
            parsedResponse.data.forEach((row, i) => {
              if (row.admin_approval === 1) {
                counter += 1;
                row.id = counter;
                this.bankAccounts.push(row);
              }
            });
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchAllBanks() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/banks`, this.config)
          .then(response => {
            const parsedResponse = response.data;
            parsedResponse.data.forEach((row, i) => {
              this.allBanks.push(row);
            });
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchDisputedOrders() {
      return new Promise((resolve, reject) => {
        /* eslint-disable */
        const payload = {
          owner_id: this.sessionInfo.id,
        };
        axios
          .post(`${process.env.VUE_APP_AUTH}orders/owner_disputed_orders`, payload, this.config)
          .then(response => {
            const parsedResponse = response.data;
            if (parsedResponse.status && parsedResponse.disputed_orders.length > 0) {
              this.hasDisputedOrders = parsedResponse.status;
              this.disputedOrders = parsedResponse.disputed_orders;
            }
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchExpiredDocuments() {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          ownerId: this.sessionInfo.id,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_documents`, payload, this.config)
          .then(response => {
            const parsedResponse = response.data;
            if (parsedResponse.status && parsedResponse.data.length > 0) {
              const currentTime = moment();
              if (currentTime.diff(parsedResponse.data.driving_license.expiry_date, 'days') >= 0 || currentTime.diff(parsedResponse.data.driving_license.expiry_date, 'days') < 0) {
                this.expiredDocuments = parsedResponse.data;
                this.hasExpiredDocuments = parsedResponse.status;
              }
            }
            resolve(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    showErr(val) {
      if (val) {
        document.querySelector('.hidden-btn-error').style.display = 'block';
      } else {
        document.querySelector('.hidden-btn-error').style.display = 'none';
      }
    },
    showWithdrawButton() {
      if (this.ownerBalance.is_withdrawal_day) {
        this.activeStatus = true;
        if (document.querySelector('.active-btn')) {
          document.querySelector('.active-btn').style.display = 'block';
        }
      } else {
        this.activeStatus = false;
        if (document.querySelector('.inactive-btn')) {
          document.querySelector('.inactive-btn').style.display = 'block';
        }
      }
    },
    listRiders() {
      const vehCount = this.vehArray;
      vehCount.forEach((row, g) => {
        if (vehCount[g].rider !== null) {
          this.riders.push(vehCount[g].rider);
        }
      });
    },
    listVehicles() {
      const vehCount = this.vehArray;
      vehCount.forEach((row, g) => {
        if (vehCount[g].vehicle !== null) {
          this.vehicles.push(vehCount[g].vehicle);
        }
      });
    },
    selectRider(id) {
      const filterObj = this.riders.filter(e => e.rider_id === id);
      if (filterObj.length > 0) {
        this.riderNames = `${filterObj[0].f_name} ${filterObj[0].s_name}`;
      } else {
        this.riderNames = this.$t('statement.all_riders');
      }
    },
    trackMpesaWithdrawal(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Withdrawal to Mpesa', JSON.parse(payload));
      }
    },
    trackBankWithdrawal(payload) {
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Withdrawal to Bank', JSON.parse(payload));
      }
    },
  },
};
</script>

<style>
@import '../assets/css/style.css';
</style>
