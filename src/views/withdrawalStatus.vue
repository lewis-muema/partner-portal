<template>
  <div class="statements">
    <div class="container ">
      <div class="withdrawal">
        <el-breadcrumb class="bread-crum" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/statement' }">Statement</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/statement' }">My Withdrawals</el-breadcrumb-item>
          <el-breadcrumb-item>{{ withdrawal.withdrawal_timestamp }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="withdraw_date">
          <div>
            <h2 class="dark-grey">{{ withdrawal.withdrawal_timestamp }}</h2>
          </div>
          <h4 class="withdraw__status">{{ withdrawal.withdrawal_status }}</h4>
        </div>
        <div class="payment_method">
          <div>
            <p class="payment-method__heading">PAYMENT METHOD</p>
            <h3 class="dark-grey">{{ withdrawal.payment_method }}</h3>
          </div>
          <div class="payment-method__amount">
            <p class="payment-method__heading">AMOUNT</p>
            <h3 class="dark-grey">{{ withdrawal.currency }} {{ withdrawal.amount }}</h3>
          </div>
        </div>
        <hr />
        <div>
          <div class="withdrawal__progress" v-if="inProgress">
            <h3 class=" withdrawal__heading dark-grey">Progress</h3>
            <div>
              <el-steps class="step" :space="900" :active="sent" align-center finish-status="success">
                <el-step title="Request Sent"></el-step>
                <el-step title="Processing"></el-step>
                <el-step title="Completed"></el-step>
              </el-steps>
            </div>
          </div>
          <div v-else class="notification__head">
            <div class="notification__heading" v-if="isCompleted">
              <i class="el-icon-success icon-success"></i>
              <h3 class="notification__statement">Withdrawal Successful</h3>
            </div>
            <div class="notification__heading" v-else>
              <i class="el-icon-warning icon-fail"></i>
              <h3 class="notification__statement">Withdrawal Failed</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="fail" v-if="!inProgress && !isCompleted">
        <p class="fail__message">Sorry, We are experiencing some technical difficulties processing your withdrawal.</p>
        <p class="fail__message">Please make a new withdrawal in the next <b>15:00 minutes</b></p>
        <button class="warning_btn">New withdrawal</button>
        <p class="fail__support">Still having trouble? <span class="orange">Contact Support</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      withdrawal: {
        code: 200,
        amount: 3000,
        currency: 'KES',
        message: 'some message',
        payment_method: 'Mpesa',
        withdrawal_status: 'processing',
        withdrawal_timestamp: '2021-04-22 11:17:02.0',
        status: true,
      },
      sent: 2,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
    };
  },
  computed: {
    isCompleted() {
      return this.withdrawal.withdrawal_status.toLowerCase() === 'completed';
    },
    failed() {
      return this.withdrawal.withdrawal_status.toLowerCase() === 'failed';
    },
    inProgress() {
      return this.withdrawal.withdrawal_status.toLowerCase() === 'processing';
    },
  },
  created() {
    this.fetchWithdrawal();
  },
  mounted() {
  },
  methods: {
    fetchWithdrawal() {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          reference_no: this.$route.params.id,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}partners/owner_withdrawal_status`, payload, this.config)
          .then(response => {
            const parsedResponse = response.data;
            if (parsedResponse.status) {
              this.withdrawal = parsedResponse;
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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.statements {
  background-color: #f7f9fc;
  height: 100vh;
}
.container {
  width: 50%;
  margin: auto;
}
.bread-crum {
  padding: 10px 0px 30px 0px;
}
.dark-grey {
  color: rgba(96, 98, 102, 1);
}
.light-grey {
  color: rgba(144, 147, 153, 1);
}
.orange {
  color: #ee7d00;
}
.withdrawal {
  background: #fff;
  padding: 20px 20px;
  margin: 20px 0px;
  border: none;
  border-radius: 10px;
}
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #ea7125;
  background: red;
}
.el-step {
  color: #ee7d00;
}
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.warning_btn {
  border: none;
  border-radius: 5px;
  background: #ee7d00;
  color: #fff;
  min-width: 30%;
  padding: 10px 10px;
  margin: 10px 0px;
  font-weight: 600;
  font-size: 16px;
}
.payment_method {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px 20px 0px;
}
.payment-method__heading {
  padding: 10px 0px;
}
.payment-method__amount {
  text-align: right;
}
.withdraw_date {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 40px 0px;
}
.notification__head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0px;
}
.notification__heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.notification__statement {
  padding: 10px 0px;
}
.icon-fail {
  color: #bc5000;
  font-size: 30px;
  padding: 10px 0px;
}
.icon-success {
  color: #51a65b;
  font-size: 30px;
  padding: 10px 0px;
}
.fail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 30px 10px;
  border-radius: 5px;
}
.fail__message {
  padding: 2px 0px;
  font-size: 14px;
  letter-spacing: 0.3px;
}
.fail__support {
  padding: 10px 0px;
}
.withdraw__status {
  color: #ee7d00;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
}
.withdrawal__heading {
  padding: 20px 0px;
}
.withdrawal__progress {
  padding: 20px 0px;
}
.step {
  padding: 40px 0px;
}
</style>
