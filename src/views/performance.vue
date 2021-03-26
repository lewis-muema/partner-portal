<template>
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <statsLoading v-if="show_loading" class="stats_loader-align" />
    <div class="stats-performance-dash" v-else>
      <div class="performance--header">
        {{ $t('perfomance.perfomance') }}
      </div>
      <div class="row dashboard__row performance--row">
        <el-table :data="ridersData" class="documents-table-outer">
          <el-table-column width="400" label="Name">
            <template slot-scope="scope">
              <div class="performance--outer-overlay">
                <div class="partner--image">
                  <img class="partner-icon" :src="`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${ridersData[scope.$index]['photo']}`" alt="" />
                </div>
                <div class="rider--info driver-info">
                  <p class="rider--name">{{ ridersData[scope.$index]['name'] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Vehicle">
            <template slot-scope="scope">
              <span> {{ ridersData[scope.$index]['vendor_disp_name'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Registration number">
            <template slot-scope="scope">
              <span> {{ ridersData[scope.$index]['registration_no'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template slot-scope="scope">
              <span :class="showPerformanceHiglight(ridersData[scope.$index]['vendor_type'])" @click="showRiderRating(ridersData[scope.$index])">
                {{ $t('perfomance.view_perfomance') }}
                <i class="el-icon-arrow-right"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <notify />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import statsLoading from './statsLoadingComponent.vue';
import errorHandler from '../components/errorHandler';
import notify from '../components/notification';

export default {
  name: 'Performance',
  components: { statsLoading, notify, errorHandler },
  data() {
    return {
      licenseData: [],
      show_loading: true,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      errorObj: '',
      ridersData: [],
      listed_vendors: [1, 2, 3],
    };
  },
  created() {
    this.fetchAvailableDrivers();
  },
  methods: {
    showActiveDashboard() {
      if (this.$route.path === '/performance') {
        return 'active';
      }
    },
    fetchAvailableDrivers() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        owner_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
        .then(res => {
          this.ridersData = res.data.riders;
          this.show_loading = false;
        })
        .catch(error => {
          this.ridersData = [];
          this.show_loading = false;
        });
    },
    showPerformanceHiglight(value) {
      let className = 'next--link-inactive';
      if (this.listed_vendors.includes(value)) {
        className = 'next--link';
      }

      return className;
    },
    showRiderRating(value) {
      if (this.listed_vendors.includes(value.vendor_type)) {
        this.$store.commit('setSelectedPartner', value);
        this.$router.push({ name: 'partner-stats' });
      }
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance.css';
.stats_loader-align {
  margin-top: 7% !important;
}
.next--link {
  color: #EE7D00;
  cursor: pointer;
}
.next--link-inactive {
  color: #989898;
}
</style>
