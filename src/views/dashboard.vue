<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="page-dash" v-if="dataResponse">
      <div class="row dashboard__row">
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-blu">
              <font-awesome-icon :icon="['fas', 'chart-bar']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Cash made this month</span>
              <span class="dashboard__box-number">{{ cashMadeThisMonth() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-orange">
              <font-awesome-icon :icon="['fas', 'money-bill-alt']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Cash made this week</span>
              <span class="dashboard__box-number">{{ cashMadeThisWeek() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-green">
              <font-awesome-icon :icon="['fas', 'university']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Next transfer</span>
              <span class="dashboard__box-number">{{ nextTransfer() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-grey">
              <font-awesome-icon :icon="['fas', 'star']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Rating this week</span>
              <span class="dashboard__box-number">{{ ratingThisWeek() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-red">
              <font-awesome-icon :icon="['fas', 'spinner']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Pending D Notes</span>
              <span class="dashboard__box-number" v-if="count">{{ count }}</span>
              <span class="dashboard__box-number" v-else>0</span>
              <span class="dashboard__box-subscript" v-if="amount">
                (Amount
                <span class="bold">{{ currency }} {{ amount }}</span>)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="dashboard__mid">
            <!-- <div class="dashboard__mid-header">
            <h3 class="dashboard__mid-title">Monthly Recap</h3>
            </div>-->
            <div class="dashboard__mid-body">
              <div class="row">
                <div class="col-lg-8">
                  <p class="text-center head-smol">Monthly Stat Comparison: Cash Made</p>
                  <!-- <div class="chart" id="chartContain"></div> -->
                  <chart :data="dataPoints" :options="dataOptions" />
                  <div class="dashboard__blinder"></div>
                </div>
                <div class="col-lg-4">
                  <p class="text-center head-smol">Rating and Activity</p>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this week</span>
                    <span class="dashboard__rate-number">{{ ratingThisWeek() }} / 5</span>
                    <div class="dashboard__rate-sm">
                      <div
                        class="dashboard__rate-bar dashboard__rate-bar-blu"
                        :style="{ width:ratingPercentage()+'%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this month</span>
                    <span class="dashboard__rate-number">{{ ratingThisMonth() }} / 5</span>
                    <div class="dashboard__rate-sm">
                      <div
                        class="dashboard__rate-bar dashboard__rate-bar-red"
                        :style="{ width:ratingPercentageMonth()+'%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this week</span>
                    <span class="dashboard__rate-number">{{ hoursOnlineThisWeek() }}</span>
                    <div class="dashboard__rate-sm">
                      <div
                        class="dashboard__rate-bar dashboard__rate-bar-orange"
                        :style="{ width:hoursPercentageWeek()+'%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this month</span>
                    <span class="dashboard__rate-number">{{ hoursOnlineThisMonth() }}</span>
                    <div class="dashboard__rate-sm">
                      <div
                        class="dashboard__rate-bar dashboard__rate-bar-grey"
                        :style="{ width:hoursPercentageMonth()+'%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import chart from '../components/chart.vue';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

export default {
  title: 'Partner Portal - Dashboard',
  components: {
    verifier,
    errorHandler,
    chart,
  },
  data() {
    return {
      dataStatus: false,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      dataResponse: '',
      errorObj: '',
      count: '',
      amount: '',
      currency: '',
      nextTransferAmount: '',
      dataPoints: '',
      dataOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
        },
      },
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      const riderIds = [];
      this.sessionInfo.riders.forEach((row, i) => {
        riderIds.push(row.rider_id);
      });
      const riderPayload = JSON.stringify({
        rider_ids: riderIds,
      });
      this.post(process.env.VUE_APP_AUTH, 'partners/owner_running_bal', payload).then(response => {
        if (response.data.status) {
          this.nextTransferAmount = response.data.rb;
        }
      }).then(() => {
        this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/pending_delivery_notes', riderPayload).then(response => {
          if (response.data.status) {
            this.count = response.data.pendingDeliveryNotesData[0].count;
            this.amount = response.data.pendingDeliveryNotesData[0].total_amount;
          }
        }).then(() => {
          this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/dashboard', payload).then(response => {
            this.dataStatus = true;
            this.dataResponse = response.data;
            let amount = '';
            const earnings = [];
            const months = [];
            const amountArray = [];
            this.dataResponse.response.monthly_earnings.forEach((row, i) => {
              amount = parseInt(row.amount, 10);
              months.push(row.month);
              amountArray.push(amount);
            });
            this.dataPoints = {
              labels: months,
              datasets: [
                {
                  label: 'Amount',
                  backgroundColor: 'rgba(23,130,197,.8)',
                  data: amountArray,
                },
              ],
            };
          });
        });
      });
    }
  },
  methods: {
    post(app, url, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${app}${url}`, payload, this.config).then((response) => {
          resolve(response);
        }).catch((error) => {
          resolve(error);
        });
      });
    },
    cashMadeThisMonth() {
      const cashval = this.dataResponse.response.cash_made_this_month;
      if (cashval.split(' ')[1] < 0) {
        return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(cashval.split(' ')[1]))
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      } else {
        return `${cashval.split(' ')[0]} ${cashval
          .split(' ')[1]
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      }
    },
    cashMadeThisWeek() {
      const cashval = this.dataResponse.response.cash_made_this_week;
      if (cashval.split(' ')[1] < 0) {
        return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(cashval.split(' ')[1]))
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      } else {
        return `${cashval.split(' ')[0]} ${cashval
          .split(' ')[1]
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      }
    },
    nextTransfer() {
      const cashval = this.dataResponse.response.next_transfer;
      this.currency = cashval.split(' ')[0];
      const amount = this.nextTransferAmount === '' ? cashval.split(' ')[1] : this.nextTransferAmount;
      if (parseInt(amount, 10) < 0) {
        return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(parseInt(amount, 10)))
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      } else {
        return `${cashval.split(' ')[0]} ${amount
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      }
    },
    ratingThisWeek() {
      return Math.floor(this.dataResponse.response.average_rating_this_week);
    },
    ratingThisMonth() {
      return Math.floor(this.dataResponse.response.average_rating_this_month);
    },
    hoursOnlineThisWeek() {
      return Math.floor(this.dataResponse.response.hours_online_this_week);
    },
    hoursOnlineThisMonth() {
      return Math.floor(this.dataResponse.response.hours_online_this_month);
    },
    ratingPercentage() {
      if (this.dataResponse.response.average_rating_this_week) {
        const percent = (Math.floor(this.dataResponse.response.average_rating_this_week) / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
    ratingPercentageMonth() {
      if (this.dataResponse.response.average_rating_this_month) {
        const percent = (Math.floor(this.dataResponse.response.average_rating_this_month) / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
    hoursPercentageWeek() {
      if (this.dataResponse.response.hours_online_this_week) {
        const percent = (Math.floor(this.dataResponse.response.hours_online_this_week) / 168) * 100;
        return Math.floor(percent);
      } else {
        return 0;
      }
    },
    hoursPercentageMonth() {
      if (this.dataResponse.response.hours_online_this_month) {
        const percent = (Math.floor(this.dataResponse.response.hours_online_this_month) / (moment().daysInMonth() * 24)) * 100;
        return Math.floor(percent);
      } else {
        return 0;
      }
    },
  },
};
</script>

<style>
</style>
