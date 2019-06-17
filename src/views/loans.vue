<template>
  <div>
    <verifier/>
    <Header/>
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
          <caption
            id="disp-caption"
            class="disp-caption"
          >Loans for {{ this.sessionInfo.name }} for {{ month() }}</caption>
          <div class="divider-top"></div>
          <datatable :columns="columns" :data="rows" v-if="rows">
            <template slot="footer">
              <tr>
                <td v-for="column in columns" :key="column.label">{{ column.label }}</td>
              </tr>
            </template>
          </datatable>
          <span>
            <datatable-pager v-model="page" type="short"></datatable-pager>
          </span>
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
import Datepicker from 'vuejs-datepicker';
import verifier from '../components/verifier';
import Header from '../components/headers/appHeader';

const axios = require('axios');
const moment = require('moment');

export default {
  components: {
    verifier,
    Header,
    Datepicker,
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
      rows: [],
      from: '',
      to: '',
      error: '',
      windowWidth: '',
    };
  },
  created() {
    this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    const riderIds = [];
    this.sessionInfo.riders.forEach((row, i) => {
      riderIds.push(parseInt(row.rider_id, 10));
    });
    const payload = JSON.stringify({
      rider_id: riderIds,
      from: firstDay,
      to: lastDay,
    });
    const record = [];
    let currency = '';

    axios.post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/loans`, payload, this.config).then(response => {
      if (response.data.msg) {
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
        this.rows = record;
      } else {
        this.rows = [];
        setTimeout(() => {
          if (document.getElementsByTagName('td').length > 0) {
            const list = document.getElementsByTagName('td')[0];
            list.innerHTML = 'No loans found for this period';
            list.style.textAlign = 'center';
          }
        }, 500);
      }
    });
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    month() {
      const date = new Date();
      return `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`;
    },
    filt() {
      if (this.to === '' || this.from === '') {
        this.error = 'Please select both a from and to date';
        setTimeout(() => {
          this.error = '';
        }, 4000);
      } else {
        // eslint-disable-next-line quotes
        document.getElementById('filtSub').innerHTML = `<div class='loading-spinner'></div> LOADING`;
        const firstDay = new Date(this.from.getFullYear(), this.from.getMonth(), this.from.getDate()).toISOString().split('T')[0];
        const lastDay = new Date(this.to.getFullYear(), this.to.getMonth(), this.to.getDate()).toISOString().split('T')[0];
        const riderIds = [];
        this.sessionInfo.riders.forEach((row, i) => {
          riderIds.push(parseInt(row.rider_id, 10));
        });
        const payload = JSON.stringify({
          rider_id: riderIds,
          from: firstDay,
          to: lastDay,
        });
        const record = [];
        let currency = '';

        axios.post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/loans`, payload, this.config).then(response => {
          // eslint-disable-next-line quotes
          document.getElementById('filtSub').innerHTML = `<i class="fa fa-filter" aria-hidden="true"></i>`;
          if (response.data.msg) {
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
            this.rows = record;
          } else {
            this.error = 'No loans found for this period';
            setTimeout(() => {
              this.error = '';
            }, 4000);
            this.rows = [];
            setTimeout(() => {
              if (document.getElementsByTagName('td').length > 0) {
                const list = document.getElementsByTagName('td')[0];
                list.innerHTML = 'No loans found for this period';
                list.style.textAlign = 'center';
              }
            }, 500);
          }
        });
      }
    },
  },
};
</script>

<style>
</style>
