<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="dashboard-currency-selector" v-if="dataResponse">
      <div class="dashboard-currency-buttons" v-for="(currency, index) in currencies" :key="index" :class="activeCurrency === currency ? 'active-currency' : ''" @click="activeCurrency = currency">{{ currency }}</div>
      <button class="dashboard-upload-invoice-button" @click="uploadStatus = true">
        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
        Upload Invoice
      </button>
    </div>
    <div class="page-dash" v-if="dataResponse && !uploadStatus">
      <div class="dashboard-partner-filter">
        <span>
          <span class="dashboard-partner-label">View analytics by partner</span>
          <select class="dashboard-partner-select" v-model="riderId">
            <option selected value>All</option>
            <option v-for="rider in riders" :value="rider.rider_id" :key="rider.rider_id">{{ rider.f_name }} {{ rider.s_name }}</option>
          </select>
        </span>
      </div>
      <div class="row dashboard__row">
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-orange-highlight">
              <font-awesome-icon :icon="['fas', 'coins']" class="new-dashboard__box-icon-orange" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Amount made this week</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-orange">{{ cashMadeThisWeek() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-green-highlight">
              <font-awesome-icon :icon="['fas', 'university']" class="new-dashboard__box-icon-green" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Next transfer</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-green">{{ nextTransfer() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-maroon-highlight">
              <font-awesome-icon :icon="['fas', 'mobile']" class="new-dashboard__box-icon-maroon" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Next transfer</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-maroon">{{ nextTransfer() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-yellow-highlight">
              <font-awesome-icon :icon="['fas', 'gas-pump']" class="new-dashboard__box-icon-yellow" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Rating this week</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-yellow">{{ ratingThisWeek() }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-blue-highlight">
              <font-awesome-icon :icon="['fas', 'calendar-week']" class="new-dashboard__box-icon-blue" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Pending D Notes</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-blue" v-if="count">{{ count }}
                <span class="bold" v-if="amount"> ({{ currency }} {{ amount }})</span>
              </span>
              <span class="dashboard__box-number" v-else>0</span>
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
                <div class="col-lg-9">
                  <p class="new-dashboard-head-smol">
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'revenue' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'revenue'">
                      Revenue
                    </span>
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'total orders' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'total orders'">
                      Total Orders
                    </span>
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'fuel advance' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'fuel advance'">
                      Fuel Advance
                    </span>
                  </p>
                  <chart :chart-data="dataPoints" :options="dataOptions" />
                </div>
                <div class="col-lg-3">
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this week</span>
                    <div class="new-dashboard-ratings">
                      <span v-for="(star, index) in rating(3.5)" :key="index">
                        <font-awesome-icon v-if="star === 1" :icon="['fas', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['fas', 'star-half']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['far', 'star']" class="new-dashboard__box-icon-orange half-star all-stars" />
                        <font-awesome-icon v-if="star === 0" :icon="['far', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                      </span>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this month</span>
                    <div class="new-dashboard-ratings">
                      <span v-for="(star, index) in rating(4.5)" :key="index">
                        <font-awesome-icon v-if="star === 1" :icon="['fas', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['fas', 'star-half']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['far', 'star']" class="new-dashboard__box-icon-orange half-star all-stars" />
                        <font-awesome-icon v-if="star === 0" :icon="['far', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                      </span>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this week</span>
                    <div class="new-dashboard-online-hours">{{ hoursOnlineThisWeek() }} Hours</div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this month</span>
                    <div class="new-dashboard-online-hours">{{ hoursOnlineThisMonth() }} Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-dashboard-upload-container" v-if="dataResponse && uploadStatus">
      <span class="upload-invoice-span">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="upload-invoice-back-button" @click="uploadStatus = false" />
        Upload invoice
      </span>
      <div class="upload-invoice-pad">
        <div class="center-text">
          <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="new-dashboard__box-icon-orange upload-pad-icon" />
          <p class="upload-pad-text">Click here to browse files</p>
        </div>
      </div>
      <div class="upload-invoice-buttons">
        <button class="upload-invoice-delete-button">
          Delete
        </button>
        <button class="upload-invoice-next-button">
          Next
        </button>
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
      vehArray: [],
      vehicles: [],
      riders: [],
      riderId: '',
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      activeGraph: 'revenue',
      uploadStatus: false,
      currencies: ['KES', 'USD'],
      activeCurrency: 'KES',
      dataResponse: '',
      errorObj: '',
      count: '',
      amount: '',
      currency: '',
      nextTransferAmount: '',
      dataPoints: '',
      revenueDataPoints: '',
      ordersDataPoints: '',
      fuelDataPoints: '',
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
  watch: {
    activeGraph(val) {
      if (val === 'revenue') {
        this.dataPoints = this.revenueDataPoints;
      } else if (val === 'total orders') {
        this.dataPoints = this.ordersDataPoints;
      } else if (val === 'fuel advance') {
        this.dataPoints = this.fuelDataPoints;
      }
    },
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
      this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/pending_delivery_notes', riderPayload)
        .then(response => {
          if (response.data.status) {
            this.count = response.data.pendingDeliveryNotesData[0].count;
            this.amount = response.data.pendingDeliveryNotesData[0].total_amount;
          }
        })
        .then(() => {
          this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/dashboard', payload).then(response => {
            this.getVehicles();
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
            this.revenueDataPoints = {
              labels: months,
              datasets: [
                {
                  label: 'Revenue',
                  borderColor: '#F28226',
                  backgroundColor: '#fff',
                  data: amountArray,
                },
              ],
            };
            this.ordersDataPoints = {
              labels: months,
              datasets: [
                {
                  label: 'Total orders',
                  borderColor: '#F28226',
                  backgroundColor: '#fff',
                  data: amountArray,
                },
              ],
            };
            this.fuelDataPoints = {
              labels: months,
              datasets: [
                {
                  label: 'Fuel advance',
                  borderColor: '#F28226',
                  backgroundColor: '#fff',
                  data: amountArray,
                },
              ],
            };
            this.dataPoints = this.revenueDataPoints;
          });
        });
    }
  },
  methods: {
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
          })
          .catch(error => {
            this.errorObj = error.response;
          });
      });
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
    rating(totalRating) {
      const ratings = [];
      for (let i = 0; i < 5; i++) {
        const remainder = totalRating - i;
        if (remainder > 1) {
          ratings.push(1);
        } else if (remainder < 1 && remainder > 0) {
          ratings.push(remainder);
        } else if (remainder < 0) {
          ratings.push(0);
        }
      }
      return ratings;
    },
    post(app, url, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${app}${url}`, payload, this.config)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            resolve(error);
          });
      });
    },
    cashMadeThisMonth() {
      const cashval = this.dataResponse.response.cash_made_this_month;
      return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(cashval.split(' ')[1]))
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
    },
    cashMadeThisWeek() {
      const cashval = this.dataResponse.response.cash_made_this_week;
      return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(cashval.split(' ')[1]))
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
    },
    nextTransfer() {
      const cashval = this.dataResponse.response.next_transfer;
      this.currency = cashval.split(' ')[0];
      const amount = cashval.split(' ')[1];
      return `${cashval.split(' ')[0]} ${Math.floor(Math.abs(parseInt(amount, 10)))
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
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

<style></style>
