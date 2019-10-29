<template lang="html">
  <statsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Orders completed </span>
          <div class="completed--order--stats">
            <span class="dashboard__box-number completed--order-inner"> {{ this.rider_stats.dispatch_info.completed }} orders</span>
            <el-progress type="line" :percentage="completeRate()" :stroke-width="10" :color="colors" :show-text="false"></el-progress>
          </div>
          <div class="riderstats__box-extra completed--order--extra">
            <div v-if="!target_reached">
              <span class="dashboard__box-text"><i class="far fa-lightbulb"></i> {{ orderTarget() }} orders to go to reach your daily target</span>
            </div>
            <div v-else>
              <span class="dashboard__box-text"><i class="fas fa-check-circle" style="color:#00b800"></i> Daily target of {{ this.rider_stats.completion_target }} orders achieved</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Orders acceptance rate </span>
          <div class="row order--acceptance-inner">
            <el-progress type="circle" :percentage="acceptanceRate()" :stroke-width="10" :color="colors"></el-progress>
            <div class="dashboard--progress">
              <div class="row row--extra-align">
                <div class="completed--checker"></div>
                <span>{{ this.rider_stats.dispatch_info.confirmed }} orders confirmed</span>
              </div>
              <div class="row row--extra-align">
                <div class="uncompleted--checker"></div>
                <span>{{ this.rider_stats.dispatch_info.rejected }} orders rejected</span>
              </div>
            </div>
          </div>
          <div class="riderstats__box-extra">
            <span class="dashboard__box-text"><i class="fas fa-exclamation-circle"></i> Confirm all orders to make more money </span>
          </div>
        </div>
      </div>
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Orders completion rate </span>
          <div class="row rider--stats-extra">
            <el-progress type="circle" :percentage="completionRate()" :stroke-width="10" :color="colors"></el-progress>
            <div class="dashboard--progress">
              <div class="row row--extra-align">
                <div class="completed--checker"></div>
                <span>{{ this.rider_stats.dispatch_info.completed }} orders completed</span>
              </div>
              <div class="row row--extra-align">
                <div class="uncompleted--checker"></div>
                <span>{{ this.rider_stats.dispatch_info.cancelled }} orders cancelled</span>
              </div>
            </div>
          </div>
          <div class="riderstats__box-extra">
            <span class="dashboard__box-text"><i class="fas fa-exclamation-circle"></i> Complete all confirmed orders </span>
          </div>
        </div>
      </div>
    </div>

    <div class="row dashboard__row">
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Time spent online </span>
          <div class="" style="margin-left: 4%; padding-top: 37px;width:86%; !important">
            <span class="dashboard__box-number online--time-inner"> {{ this.onlineTime() }}</span>
            <el-progress type="line" :percentage="onlineRate()" :stroke-width="10" :color="colors" :show-text="false"></el-progress>
          </div>
          <div class="riderstats__box-extra online--time--extra">
            <div v-if="!online_target_reached">
              <span class="dashboard__box-text"><i class="far fa-lightbulb"></i><a class="active-target-hours"> {{ onlineTarget() }} </a>to go to reach your daily target</span>
            </div>
            <div v-else>
              <span class="dashboard__box-text"><i class="fas fa-check-circle checked-daily-target"></i> Daily target of <a>{{ this.rider_stats.online_target/3600 }} hours</a> achieved</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Delays in pickup </span>
          <div class="riderstats__box-content delay-inner">
            <span class="dashboard__box-number delay--inner-text">{{ this.rider_stats.delay_info.pickup }} Delays</span>
          </div>
          <div class="riderstats__box-extra delay--extra">
            <span class="dashboard__box-text"><i class="fas fa-exclamation-circle"></i> 80% of all orders are picked in {{ this.rider_stats.avg_pickup_time }} minutes</span>
          </div>
        </div>
      </div>
      <div class="dashboard__box-container stats-container">
        <div class="dashboard__dash-box stats--dashboard">
          <span class="dashboard__box-number dashboard-header">Delays in delivery</span>
          <div class="riderstats__box-content delay-inner">
            <span class="dashboard__box-number delay--inner-text">{{ this.rider_stats.delay_info.delivery }} Delays</span>
          </div>
          <div class="riderstats__box-extra delay--extra">
            <span class="dashboard__box-text"><i class="fas fa-exclamation-circle"></i> 80% of all orders are delivered n {{ this.rider_stats.avg_delivery_time }} minutes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import statsLoading from './statsLoadingComponent.vue';

export default {
  name: 'RiderTodayStats',
  components: { statsLoading },
  data() {
    return {
      show_loading: true,
      colors: '#F57E20',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      rider_stats: {},
      old_rider_id: '',
      target_reached: false,
      online_target_reached: true,
    };
  },
  created() {
    setTimeout(() => {
      this.getTodayStats();
      this.interval = setInterval(() => this.getRiderId(), 1000);
    }, 5000);
  },
  methods: {
    getRiderId() {
      const new_rider_id = this.$store.getters.getRiderId;
      if (new_rider_id !== this.old_rider_id) {
        this.getTodayStats();
      }
    },
    getTodayStats() {
      this.show_loading = true;
      const rider_id = this.$store.getters.getRiderId;
      this.old_rider_id = rider_id;

      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        rider_id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/rider_performance`, riderPayload, this.config)
        .then(res => {
          this.rider_stats = res.data.rider_stats;
          this.show_loading = false;
          this.targetReached();
          this.onlineTargetReached();
        })
        .catch(error => {
          // ...
        });
    },
    acceptanceRate() {
      const acceptance_rate = this.rider_stats.dispatch_info.acceptance_rate;
      const rate = acceptance_rate * 100;
      return rate;
    },
    completionRate() {
      const completion_rate = this.rider_stats.dispatch_info.completion_rate;
      const rate = completion_rate * 100;
      return rate;
    },
    completeRate() {
      const completed = this.rider_stats.dispatch_info.completed;
      const target = this.rider_stats.completion_target;

      return (completed / target) * 100;
    },
    onlineRate() {
      const online = this.rider_stats.online_time;
      const target = this.rider_stats.online_target;

      return (online / target) * 100;
    },
    onlineTime() {
      let time = this.rider_stats.online_time;
      time = parseInt(time, 10);
      return `${Math.floor(moment.duration(time, 'seconds').asHours())} Hours ${moment.duration(time, 'seconds').minutes()} Minutes`;
    },
    onlineTarget() {
      const onlineTime = parseInt(this.rider_stats.online_time, 10);

      const onlineTarget = parseInt(this.rider_stats.online_target, 10);

      const timeDifferenceSec = onlineTarget - onlineTime;

      return `${Math.floor(moment.duration(timeDifferenceSec, 'seconds').asHours())} Hrs ${moment.duration(timeDifferenceSec, 'seconds').minutes()} Min`;
    },
    orderTarget() {
      const completed = parseInt(this.rider_stats.dispatch_info.completed, 10);
      const target = parseInt(this.rider_stats.completion_target, 10);

      return target - completed;
    },
    targetReached() {
      const completed = parseInt(this.rider_stats.dispatch_info.completed, 10);
      const target = parseInt(this.rider_stats.completion_target, 10);

      if (completed >= target) {
        this.target_reached = true;
      } else {
        this.target_reached = false;
      }
    },
    onlineTargetReached() {
      let onlineTime = parseInt(this.rider_stats.online_time, 10);
      onlineTime = Math.floor(moment.duration(onlineTime, 'seconds').asHours());

      let onlineTarget = parseInt(this.rider_stats.online_target, 10);
      onlineTarget = Math.floor(moment.duration(onlineTarget, 'seconds').asHours());

      if (onlineTime >= onlineTarget) {
        this.online_target_reached = true;
      } else {
        this.online_target_reached = false;
      }
    },
  },
};
</script>

<style>
@import '../assets/css/performance_section.css';
</style>
