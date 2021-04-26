<template>
  <div class="withdrawals">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="container dash">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="withdrawals__crum" :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/statement' }">Statement</el-breadcrumb-item>
        <el-breadcrumb-item>My Withdrawals</el-breadcrumb-item>
      </el-breadcrumb>

      <h1 class="withdrawal__heading">My Withdrawals</h1>

      <div class="tabs">
        <el-tabs v-model="activeName">
          <el-tab-pane label="In Progress" name="first">
            <withdrawal-item :withdrawals="processing"></withdrawal-item>
          </el-tab-pane>
          <el-tab-pane label="Failed" name="second">
            <withdrawal-item :withdrawals="failed"></withdrawal-item>
          </el-tab-pane>
          <el-tab-pane label="Completed" name="third">
            <withdrawal-item :withdrawals="completed"></withdrawal-item>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import withdrawalItem from './withdrawalItem.vue';
import errorHandler from '../components/errorHandler';

export default {
  components: { withdrawalItem, errorHandler },
  data() {
    return {
      activeName: 'first',
      withdrawals: [],
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      errorObj: '',
    };
  },
  computed: {
    failed() {
      return this.withdrawals.filter(el => el.status.toLowerCase() === 'failed');
    },
    processing() {
      return this.withdrawals.filter(el => el.status.toLowerCase() === 'processing');
    },
    completed() {
      return this.withdrawals.filter(el => el.status.toLowerCase() === 'completed');
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
    }
    this.fetchWithdrawals();
  },
  methods: {
    fetchWithdrawals() {
    return new Promise((resolve, reject) => {
      /* eslint-disable */
      const payload = {
        owner_Id: this.sessionInfo.id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partners/owner_withdrawals`, payload, this.config)
        .then(response => {
          const parsedResponse = response.data;
          if (parsedResponse.status && parsedResponse.owner_withdrawals.length > 0) {
            this.withdrawals = parsedResponse.owner_withdrawals;
          }
          resolve(response);
        })
        .catch(error => {
          this.errorObj = error.response;
          resolve(error);
        });
    });
  },
  },
};
</script>
<style scoped>
.withdrawals {
  background-color: #f7f9fc;
  height: 100vh;
  padding: 60px 0px;
}
.dash {
  width: 60%;
  margin: auto;
  padding: 20px 20px;
  background: #fff;
  border-radius: 10px;
}
.withdrawals__bread {
  width: 50%;
}
.tabs {
  padding: 10px 0px;
}
.el-tabs__item {
  color: rgba(238, 125, 0, 1);
}
.withdrawal__heading {
  font-size: 30px;
  color: rgba(96, 98, 102, 1);
  padding-top: 26px;
  font-weight: 600;
}

</style>
