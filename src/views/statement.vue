<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="statements__blinder">
      <div class="statement__withdraw-popup statement__row">
        <div class="popup-row statement__row">
          <span>Withdraw cash</span>
          <span>
            <i class="material-icons statement__cancel-icon" @click="closePopup">cancel</i>
          </span>
        </div>
        <div v-if="payable_amount" class="withdraw-modal-screen">
          <div class="statement__row statement__add-bank-tab">
            <p class="small-margin statement__error-box-header color-white">{{ withdrawHead }}</p>
            <p class="small-margin color-white">{{ withdrawError }}</p>
            <router-link to="/banks" v-if="addAccountStatus">
              <p class="small-margin statement__bg-orange">+ Add a bank account</p>
            </router-link>
          </div>
          <div class="statement__row statement__divided-row">
            <span class="statement__column-3">
              <i class="material-icons statement__wallet">account_balance_wallet</i>
            </span>
            <span class="statement__column-9">
              <p class="no-margin large-font">Balance</p>
              <p class="no-margin large-font">{{ ownerRb.currency }} {{ ownerRb.rb * -1 }}</p>
            </span>
          </div>
          <div class="statement__row">
            <input id="withdrawalAmount" type="text" placeholder="Enter amount" class="full-width input-height input-border" v-model="amount" @input="checkDetails()" @keyup.delete="checkDetails()" :maxlength="amountLength" />
          </div>
          <div class="statement__row">
            <button id="continue" class="full-width input-height withdraw-buttons statement__withdraw-button" v-if="sendWithdrawStatus" @click="goNext()">Next</button>
            <button class="continue full-width input-height withdraw-buttons" disabled v-else>Next</button>
          </div>
        </div>
        <div class="withdraw-modal-screen-2" v-if="payment_options">
          <div class="statement__row">
            <p class="no-margin x-large-font">How do you want to be paid?</p>
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
          </div>
          <div class="statement__row">
            <button class="full-width input-height withdraw-buttons statement__withdraw-button" v-if="allowWithdrawal" @click="withdraw()">Withdraw Cash</button>
            <button class="input-height" disabled v-else>Withdraw Cash</button>
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
                  <option selected value>Driver</option>
                  <option v-for="rider in riders" :value="rider.rider_id" :key="rider.rider_id">{{ rider.f_name }} {{ rider.s_name }}</option>
                </select>
              </div>
              <div class="col-2 padding">
                <select class="dropdown-filter" v-model="vehicleId">
                  <option selected value>vehicle</option>
                  <option v-for="vehicle in vehicles" :value="vehicle.id" :key="vehicle.id">{{ vehicle.registration_no }}</option>
                </select>
              </div>
              <div class="col-3">
                <datepicker v-model="from" input-class="filtIn" id="dtfrom" placeholder="From" name="from"></datepicker>
              </div>
              <div class="col-3">
                <datepicker v-model="to" input-class="filtIn" id="dtto" placeholder="To" name="to"></datepicker>
              </div>
              <div class="subFilt col-2">
                <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub" @click="filt()">
                  <i class="fa fa-filter" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="stat-cards col-4">
            <div class="row" style="justify-content: flex-end;">
              <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                <div class="statement__dash-box dashboard__dash-box">
                  <span class="dashboard__box-icon statement__box-icon dashboard__box-icon-orange">
                    <font-awesome-icon :icon="['fas', 'money-bill-alt']" />
                  </span>
                  <div class="statement__box-content">
                    <span class="statement__box-text">You can withdraw :</span>
                    <br />
                    <span class="statement__box-number" v-if="this.ownerRb">{{ ownerRb.currency }} {{ Math.floor(ownerRb.rb * -1) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="stat-cards col-2">
            <div class="subFilt">
              <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub fil-sub-1 active-btn" @click="closePopup()" v-if="activeStatus">Withdraw cash</button>
              <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub-disabled fil-sub-1 inactive-btn" @mouseover="showErr(true)" @mouseleave="showErr(false)" v-else>Withdraw cash</button>
              <p class="hidden-btn-error">The button is disabled. You cannot withdraw today</p>
            </div>
          </div>
        </div>
        <div class="search-error" id="err">{{ error }}</div>
        <table id="disp" class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
          <div class="divider-top"></div>
          <datatable :columns="columns" :rows="rows" :title="`Statement for ${this.sessionInfo.name} for ${monthPeriod}`" v-if="rows" :per-page="[10, 20, 30, 40, 50]" :default-per-page="10" :clickable="false" :sortable="true" :exact-search="true" :exportable="true"></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-else>
        <div class="col-12 padding margin-bottom">
          <datepicker v-model="from" input-class="filtIn" id="dtfrom" placeholder="From" name="from"></datepicker>
        </div>
        <div class="col-12 padding margin-bottom">
          <datepicker v-model="to" input-class="filtIn" id="dtto" placeholder="To" name="to"></datepicker>
        </div>
        <div class="subFilt col-12 padding margin-bottom">
          <button type="button" id="filtSub" name="button" class="btn btn_primary fil-sub centered-btn" @click="filt()">
            <i class="fa fa-filter" aria-hidden="true"></i>
          </button>
        </div>
        <div class="search-error" id="err">{{ error }}</div>
        <p v-if="rows.length === 0" class="no-loans">No statement found for this period</p>
        <div class="statement__mobile-view" v-for="row in rows" :key="row.id">
          <table class="table-responsive mobile-table">
            <thead class="thead-mobile">
              <tr>
                <th>Amount</th>
                <th>Balance</th>
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
import notify from '../components/notification';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';
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
      payment_method: '',
      payment_account: '',
      payable_amount: true,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      columns: [
        { label: 'Txn No', field: 'txn' },
        { label: 'Date', field: 'pay_time' },
        { label: 'Amount', field: 'amount' },
        { label: 'Balance', field: 'running_balance' },
        { label: 'Narrative', field: 'pay_narrative' },
        { label: 'Driver Name', field: 'rider_name' },
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
      ownerRb: '',
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
      riderNames: 'all riders',
      vehArray: [],
      monthPeriod: '',
      errorObj: '',
      payload: '',
    };
  },
  computed: {
    displayAccounts() {
      return this.payment_method === 10;
    },
    allowWithdrawal() {
      return this.payment_method !== '';
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
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    getPaymentOptions() {
      const payload = {
        country_code: this.sessionInfo.country_code,
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
          .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/vehicles`, payload, this.config)
          .then(response => {
            this.vehArray = response.data.msg;
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
        this.error = 'Please select both a from and to date';
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
          .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/owner_statement`, payload, this.config)
          .then(response => {
            if (requestType === 1) {
              this.ownerRb = response.data.msg.owner_balance;
              this.showWithdrawButton();
            } else {
              $('#filtSub').html('<i class="fa fa-filter" aria-hidden="true"></i>');
              this.removeFetchingStatus();
            }
            if (response.data.msg.statement !== null) {
              this.handleResponse(response);
            } else {
              if (requestType === 2) {
                this.error = 'No statement found for this period';
                setTimeout(() => {
                  this.error = '';
                }, 4000);
              }
              this.rows = [];
              this.displayFetchingStatus('No statement found for this period', 0);
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
        $('#filtSub').html('<div class="loading-spinner"></div> LOADING');
        firstDay = moment(this.from).format('YYYY-MM-DD HH:mm:ss');
        lastDay = moment(this.to).format('YYYY-MM-DD HH:mm:ss');
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          from: firstDay,
          to: lastDay,
          vehicle_id: this.vehicleId,
          rider_id: this.riderId,
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
      this.ownerRb = response.data.msg.owner_balance;
      response.data.msg.statement.forEach((row, i) => {
        const rbRb = row.running_balance.split(' ')[1] * -1;
        const currencyRb = row.running_balance.split(' ')[0];
        const rbAmount = row.amount.split(' ')[1] * -1;
        const currencyAmount = row.amount.split(' ')[0];
        record.push({
          txn: row.txn,
          pay_time: this.dateFormat(row.pay_time),
          amount: `${currencyAmount} ${rbAmount}`,
          running_balance: `${currencyRb} ${rbRb}`,
          pay_narrative: row.pay_narrative,
          rider_name: row.rider_name,
          id: i,
        });
      });
      this.removeFetchingStatus();
      this.rows = record;
    },
    displayFetchingStatus(message, time) {
      setTimeout(() => {
        if (document.getElementsByTagName('tbody').length > 0) {
          const list = document.getElementsByTagName('tbody')[0];
          list.innerHTML = `<tr class="records-placeholder"><td colspan="6" style="text-align: center;">${message}</td></tr>`;
        }
      }, time);
    },
    removeFetchingStatus() {
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
      this.sendWithdrawStatus = parseInt(this.amount, 10) <= parseInt(this.ownerRb.rb, 10) * -1 && parseInt(this.amount, 10) >= 101;
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
      this.notify(1, 2, 'Sending request');
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
        notification = `The withdrawal is currently being processed. The ${this.amount} will reflect in your m-pesa`;
      } else {
        payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
          account_no: this.bankAccounts[this.selectedRow].account_no,
          payment_type: paymethod,
          amount: this.amount,
          payment_bank_id: this.bankId,
        });
        notification = `The withdrawal is currently being processed. The ${this.amount} will reflect in your bank account`;
      }
      this.payload = payload;
      this.sendWithdrawRequest(payload, notification, paymethod);
    },
    sendWithdrawRequest(payload, notification, paymethod) {
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/initiate_cash_withdrawal`, payload, this.config)
        .then(response => {
          const parsedResponse = response.data;
          if (parsedResponse.status_code) {
            this.trackWithdrawal(payload);
            this.notify(1, 1, response.data.message);
            this.from = '';
            this.to = '';
            setTimeout(() => {
              this.notify(2);
              this.fetchStatement(1);
            }, 4000);
            if (this.opened) {
              // this.closePopup();
            }
          } else {
            if (Object.prototype.hasOwnProperty.call(response.data, 'status_code')) {
              this.notify(1, 0, response.data.message);
            } else {
              this.notify(1, 0, response.data.message);
            }
            setTimeout(() => {
              this.notify(2);
              this.fetchStatement(1);
            }, 4000);
            if (this.opened) {
              // this.closePopup();
            }
          }
        })
        .catch(error => {
          this.errorObj = error.response;
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
    showErr(val) {
      if (val) {
        document.querySelector('.hidden-btn-error').style.display = 'block';
      } else {
        document.querySelector('.hidden-btn-error').style.display = 'none';
      }
    },
    showWithdrawButton() {
      if (this.ownerRb.is_withdrawal_day) {
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
        this.riderNames = 'all riders';
      }
    },
    trackWithdrawal(payload) {
      if (process.env.VUE_APP_AUTH !== undefined && !process.env.VUE_APP_AUTH.includes('test')) {
        mixpanel.track('Owner Withdrawal', JSON.parse(payload));
      }
    },
  },
};
</script>

<style>
@import '../assets/css/style.css';
</style>
