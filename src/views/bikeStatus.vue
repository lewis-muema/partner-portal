<template lang="html">
  <documentsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="" width="50">
          <i class="el-icon-success success-license"></i>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="performance--outer-overlay">
              <div class="rider--info" style="padding-top: 3%;">
                <p class="rider--name">{{ tableData[scope.$index]['vendor'] }} {{ tableData[scope.$index]['vehiclePlate'] }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="700"> </el-table-column>
        <el-table-column>
          <el-button size="mini" class="update-license">
            Update
          </el-button>
        </el-table-column>
      </el-table>
    </div>
  </div></template>

<script>
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';

export default {
  name: 'bikeStatus',
  components: { documentsLoading },
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
      bikeData: {},
      tableData: [
        {
          vendor: 'Bike',
          vehiclePlate: 'KBS 127V',
          status: 'Bike with a box & can access CBD',
        },
        {
          vendor: 'Bike',
          vehiclePlate: 'KBS 127V',
          status: 'Bike with a box & can access CBD',
        },
        {
          vendor: 'Bike',
          vehiclePlate: 'KBS 127V',
          status: 'Bike without a box & can’t access CBD',
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.getBikeData();
    }, 5000);
  },
  methods: {
    getBikeData() {
      this.show_loading = false;
    },
  },
};
</script>

<style>
@import '../assets/css/performance_section.css';
</style>
