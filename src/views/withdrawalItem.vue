<template lang="html">
  <div>
     <div v-if="withdrawals.length > 0">
      <div v-for="(withdrawal, index) in withdrawals" :key="index">
      <router-link class="router" :to="'/withdrawal-status/' + withdrawal.ref_no">
        <div class="item">
          <div class="item__info">
            <h4 class="item__heading">
              {{ new Date(withdrawal.created_at).toDateString() }}
            </h4>
            <p class="item__content">{{ withdrawal.payment_method }} - {{ withdrawal.currency }} {{ withdrawal.amount }}</p>
          </div>
          <div class="item__indicator">
            <p class="item__status">{{ withdrawal.status }}</p>
            <i v-if="withdrawal.status === 'processing'" class="fas fa-clock icon icon-proc"></i>
            <i v-else-if="withdrawal.status === 'failed'" class="fas fa-exclamation-circle icon icon-fail"></i>
            <i v-else-if="withdrawal.status === 'completed'" class="fas fa-check-circle icon icon-comp"></i>
          </div>
        </div>
      </router-link>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'withdrawalItem',
  props: ['withdrawals'],
  data() {
    return {};
  },
};
</script>
<style scoped>
.item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.item__content {
  color: rgba(144, 147, 153, 1);
  font-size: 14px;
}
.item__indicator {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.item__status {
  font-size: 14px;
  font-weight: 600;
  color: rgba(144, 147, 153, 1);
}
.icon {
  font-size: 14px;
  padding: 4px 8px 0px 4px;
}
.icon-proc {
  color: rgba(238, 125, 0, 1);
}
.icon-fail {
  color: #bc5000;
}
.icon-comp {
  color: #51a65b;
}
</style>
