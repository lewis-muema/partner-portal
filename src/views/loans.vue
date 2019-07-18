<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="print">
      <div class="printContain hidden-sm-down" v-if="windowWidth > 768">
        <div class="stat-filt col-6">
          <div class="row justify-content-between">
            <div class="col-5">
              <datepicker
                v-model="from"
                input-class="filtIn"
                id="dtfrom"
                placeholder="From"
                name="from"
              ></datepicker>
            </div>
            <div class="col-5">
              <datepicker v-model="to" input-class="filtIn" id="dtto" placeholder="To" name="to"></datepicker>
            </div>
            <div class="subFilt col-2">
              <button
                type="button"
                id="filtSub"
                name="button"
                class="btn btn_primary fil-sub"
                @click="filt();"
              >
                <i class="fa fa-filter" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="search-error" id="err">{{ error }}</div>
        <table id="disp" class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
          <div class="divider-top"></div>
          <datatable
            :columns="columns"
            :rows="rows"
            :title="`Loans for ${this.sessionInfo.name} for ${monthPeriod}`"
            v-if="rows"
            :per-page="[10, 20, 30, 40, 50]"
            :default-per-page="10"
            :clickable="false"
            :sortable="true"
            :exact-search="true"
            :exportable="true"
          ></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-else>
        <div class="col-12 padding margin-bottom">
          <datepicker
            v-model="from"
            input-class="filtIn"
            id="dtfrom"
            placeholder="From"
            name="from"
          ></datepicker>
        </div>
        <div class="col-12 padding margin-bottom">
          <datepicker v-model="to" input-class="filtIn" id="dtto" placeholder="To" name="to"></datepicker>
        </div>
        <div class="subFilt col-12 padding margin-bottom">
          <button
            type="button"
            id="filtSub"
            name="button"
            class="btn btn_primary fil-sub centered-btn"
            @click="filt();"
          >
            <i class="fa fa-filter" aria-hidden="true"></i>
          </button>
        </div>
        <div class="search-error" id="err">{{ error }}</div>
        <p v-if="rows.length === 0" class="no-loans">No loans found for this period</p>
        <div class="statement__mobile-view" v-for="row in rows" :key="row.pay_narrative">
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
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import DataTable from 'vue-materialize-datatable';
import Datepicker from 'vuejs-datepicker';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

const axios = require('axios');
const moment = require('moment');

export default {
  title: 'Partner Portal - Loans',
  components: {
    verifier,
    Datepicker,
    datatable: DataTable,
    errorHandler,
  },
  data() {
    return {
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      columns: [{ label: ' ', field: 'rider_id' }, { label: 'Txn No', field: 'txn' }, { label: 'Date', field: 'pay_time' }, { label: 'Amount', field: 'amount' }, { label: 'Balance', field: 'running_balance' }, { label: 'Narrative', field: 'pay_narrative' }],
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
      monthPeriod: '',
      errorObj: '',
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.monthPeriod = moment().format('MMMM YYYY');
      this.fetchLoans(1);
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
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
        this.fetchLoans(2);
      }
    },
    fetchLoans(requestType) {
      const payload = this.definePayload(requestType);
      this.displayFetchingStatus('Fetching loans', 0);
      axios
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/loans`, payload, this.config)
        .then(response => {
          if (requestType === 2) {
            document.getElementById('filtSub').innerHTML = '<i class="fa fa-filter" aria-hidden="true"></i>';
          }
          if (response.data.msg) {
            this.handleResponse(response);
          } else {
            if (requestType === 2) {
              this.error = 'No loans found for this period';
              setTimeout(() => {
                this.error = '';
              }, 4000);
            }
            this.rows = [];
            this.displayFetchingStatus('No loans found for this period', 0);
          }
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    definePayload(requestType) {
      let firstDay = '';
      let lastDay = '';
      if (requestType === 1) {
        firstDay = moment()
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
        lastDay = moment()
          .endOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        document.getElementById('filtSub').innerHTML = '<div class="loading-spinner"></div> LOADING';
        firstDay = moment(this.from).format('YYYY-MM-DD HH:mm:ss');
        lastDay = moment(this.to).format('YYYY-MM-DD HH:mm:ss');
        this.rows = [];
      }
      const riderIds = [];
      this.sessionInfo.riders.forEach((row, i) => {
        riderIds.push(parseInt(row.rider_id, 10));
      });
      const payload = JSON.stringify({
        rider_id: riderIds,
        from: firstDay,
        to: lastDay,
      });
      return payload;
    },
    handleResponse(response) {
      const record = [];
      let currency = '';
      response.data.msg.forEach((row, i) => {
        this.sessionInfo.riders.forEach((rider, x) => {
          if (rider.rider_id === row.rider_id) {
            currency = rider.default_currency;
          }
        });
        record.push({
          rider_id: row.rider_id,
          txn: row.txn,
          pay_time: row.pay_time,
          amount: `${currency} ${row.amount}`,
          running_balance: `${currency} ${row.running_balance}`,
          pay_narrative: row.pay_narrative,
        });
      });
      this.removeFetchingStatus();
      this.rows = record;
    },
    displayFetchingStatus(message, time) {
      setTimeout(() => {
        if (document.getElementsByTagName('tbody').length > 0) {
          const list = document.getElementsByTagName('tbody')[0];
          list.innerHTML = `<tr class="records-placeholder"><td colspan="9" style="text-align: center;">${message}</td></tr>`;
        }
      }, time);
    },
    removeFetchingStatus() {
      const element = document.querySelector('.records-placeholder');
      if (typeof element !== 'undefined' && element !== null) {
        element.parentNode.removeChild(element);
      }
    },
  },
};
</script>

<style>
</style>
