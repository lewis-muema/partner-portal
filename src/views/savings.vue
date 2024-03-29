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
                :placeholder="$t('savings.from')"
                name="from"
              ></datepicker>
            </div>
            <div class="col-5">
              <datepicker v-model="to" input-class="filtIn" id="dtto" :placeholder="$t('savings.to')" name="to"></datepicker>
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
          <datatable
            class="savings__row"
            :columns="columns"
            :rows="rows"
            :title="$t('savings.saving_for', { name: this.sessionInfo.name, monthPeriod: monthPeriod })"
            v-if="rows"
            :per-page="[10, 20, 30, 40, 50]"
            :default-per-page="10"
            :clickable="false"
            :sortable="true"
            :exact-search="true"
            :exportable="true"
            :locale="language"
          ></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-else>
        <div class="col-12 padding margin-bottom">
          <datepicker
            v-model="from"
            input-class="filtIn"
            id="dtfrom"
            :placeholder="$t('savings.from')"
            name="from"
          ></datepicker>
        </div>
        <div class="col-12 padding margin-bottom">
          <datepicker v-model="to" input-class="filtIn" id="dtto" :placeholder="$t('savings.to')" name="to"></datepicker>
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
        <p v-if="rows.length === 0" class="no-loans">{{ $t('savings.no_savings') }}</p>
        <div class="statement__mobile-view" v-for="row in rows" :key="row.pay_narrative">
          <table class="table-responsive mobile-table">
            <thead class="thead-mobile">
              <tr>
                <th>{{ $t('savings.amount') }}</th>
                <th>{{ $t('savings.balance') }}</th>
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
import axios from 'axios';
import moment from 'moment';
import verifier from '../components/verifier.vue';
import errorHandler from '../components/errorHandler.vue';
import timezone from '../mixins/timezone';

export default {
  title: 'Partner Portal - Savings',
  components: {
    verifier,
    Datepicker,
    datatable: DataTable,
    errorHandler,
  },
  mixins: [timezone],
  data() {
    return {
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      columns: [{ label: ' ', field: 'rider_id' }, { label: 'Txn No', field: 'txn' }, { label: this.$t('savings.date'), field: 'pay_time' }, { label: this.$t('savings.amount'), field: 'amount' }, { label: this.$t('savings.balance'), field: 'running_balance' }, { label: this.$t('savings.narrative'), field: 'pay_narrative' }],
      page: 1,
      rows: [],
      from: '',
      to: '',
      error: '',
      windowWidth: '',
      monthPeriod: '',
      errorObj: '',
    };
  },
  computed: {
    language() {
      if (localStorage.getItem('language')) {
        return localStorage.getItem('language').split('-')[0];
      }
      return 'en';
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.monthPeriod = moment().utc().local().format('MMMM YYYY');
      this.fetchSavings(1);
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
    month() {
      const date = new Date();
      return `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`;
    },
    filt() {
      if (this.to === '' || this.from === '') {
        this.error = this.$t('savings.please_select_both');
        setTimeout(() => {
          this.error = '';
        }, 4000);
      } else {
        this.monthPeriod = `${moment(this.from).format('DD MMMM YYYY')} - ${moment(this.to).format('DD MMMM YYYY')}`;
        this.fetchSavings(2);
      }
    },
    fetchSavings(requestType) {
      const payload = this.definePayload(requestType);
      this.displayFetchingStatus(this.$t('savings.fetch_savings'), 0);
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/savings`, payload, this.config)
        .then(response => {
          $('#filtSub').html('<i class="fa fa-filter" aria-hidden="true"></i>');
          this.handleResponse(response);
        })
        .catch(error => {
          this.error = error.response.data.message;
          setTimeout(() => {
            this.error = '';
          }, 4000);
          this.rows = [];
          this.displayFetchingStatus(error.response.data.message, 0);
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
        $('#filtSub').html('<div class="loading-spinner"></div> LOADING');
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
    dateFormat(date) {
        const UTCDate = this.convertToUTC(date);
        const local = this.convertToLocalTime(UTCDate);
        return local;
    },
    handleResponse(response) {
      const record = [];
      let currency = '';
      response.data.savings.forEach((row, i) => {
        this.sessionInfo.riders.forEach((rider, x) => {
          if (rider.rider_id === row.rider_id) {
            currency = rider.default_currency;
          }
        });
        record.push({
          rider_id: row.rider_id,
          txn: row.txn,
          pay_time: this.dateFormat(row.pay_time),
          amount: `${currency} ${row.amount * -1}`,
          running_balance: `${currency} ${row.running_balance * -1}`,
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
