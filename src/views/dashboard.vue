<template>
  <div>
    <verifier />
    <div class="page-dash" v-if="dataResponse">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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
        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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
        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
          <div class="dashboard__dash-box">
            <span class="dashboard__box-icon dashboard__box-icon-red">
              <font-awesome-icon :icon="['fas', 'university']" />
            </span>
            <div class="dashboard__box-content">
              <span class="dashboard__box-text">Next transfer</span>
              <span class="dashboard__box-number">{{ nextTransfer() }}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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
                  <div class="chart" id="chartContain"></div>
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
                    <span class="dashboard__rate-text">Hours online this month</span>
                    <span class="dashboard__rate-number">{{ hoursOnlineThisWeek() }} / 5</span>
                    <div class="dashboard__rate-sm">
                      <div
                        class="dashboard__rate-bar dashboard__rate-bar-orange"
                        :style="{ width:hoursPercentageWeek()+'%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this week</span>
                    <span class="dashboard__rate-number">{{ hoursOnlineThisMonth() }} / 5</span>
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
import verifier from '../components/verifier';

const axios = require('axios');
const moment = require('moment');

export default {
  components: {
    verifier,
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
      options: '',
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      axios
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/dashboard`, payload, this.config)
        .then(response => {
          this.dataStatus = true;
          this.dataResponse = response.data;
          const earnings = [];
          let amount = '';
          this.dataResponse.msg.Monthly_earnings.forEach((row, i) => {
            amount = parseInt(row.amount, 10);
            earnings.push({ label: row.month, y: amount });
          });
          this.options = {
            exportEnabled: true,
            animationEnabled: true,
            axisY: {
              lineColor: '#d3d3d3',
              tickColor: '#d3d3d3',
              labelFontColor: '#333',
              gridColor: '#d3d3d3',
              gridThickness: 1,
            },
            axisX: {
              lineColor: '#d3d3d3',
              tickColor: '#d3d3d3',
              labelFontColor: '#333',
            },
            data: [
              {
                type: 'splineArea',
                color: 'rgba(23,130,197,.8)',
                dataPoints: earnings,
              },
            ],
          };
        })
        .catch(error => {
          this.dataStatus = true;
          console.log(error.response);
        });
    }
  },
  updated() {
    this.$nextTick(() => {
      const chart = new CanvasJS.Chart('chartContain', this.options);
      chart.render();
    });
  },
  methods: {
    cashMadeThisMonth() {
      const cashval = this.dataResponse.msg.Cash_made_this_Month;
      if (cashval.split(' ')[1] < 0) {
        return `${cashval.split(' ')[0]} ${Math.abs(cashval.split(' ')[1])
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
      const cashval = this.dataResponse.msg.Cash_made_this_Week;
      if (cashval.split(' ')[1] < 0) {
        return `${cashval.split(' ')[0]} ${Math.abs(cashval.split(' ')[1])
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
      const cashval = this.dataResponse.msg.Next_transfer;
      if (cashval.split(' ')[1] < 0) {
        return `${cashval.split(' ')[0]} ${Math.abs(cashval.split(' ')[1])
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      } else {
        return `${cashval.split(' ')[0]} ${cashval
          .split(' ')[1]
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
      }
    },
    ratingThisWeek() {
      return this.dataResponse.msg.Average_Rating_this_Week;
    },
    ratingThisMonth() {
      return this.dataResponse.msg.Average_Rating_this_Month;
    },
    hoursOnlineThisWeek() {
      return Math.round(this.dataResponse.msg.Hours_online_this_Week);
    },
    hoursOnlineThisMonth() {
      return Math.round(this.dataResponse.msg.Hours_online_this_Month);
    },
    ratingPercentage() {
      if (this.dataResponse.msg.Average_Rating_this_Week) {
        const percent = (this.dataResponse.msg.Average_Rating_this_Week / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
    ratingPercentageMonth() {
      if (this.dataResponse.msg.Average_Rating_this_Month) {
        const percent = (this.dataResponse.msg.Average_Rating_this_Month / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
    hoursPercentageWeek() {
      if (this.dataResponse.msg.Hours_online_this_Week) {
        const percent = (this.dataResponse.msg.Hours_online_this_Week / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
    hoursPercentageMonth() {
      if (this.dataResponse.msg.Hours_online_this_Month) {
        const percent = (this.dataResponse.msg.Hours_online_this_Month / 5) * 100;
        return percent;
      } else {
        return 0;
      }
    },
  },
};
</script>

<style>
</style>
