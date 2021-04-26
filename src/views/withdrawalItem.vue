<template lang="html">
  <div>
    <div v-for="(withdrawal, index) in withdrawals" :key="index">
      <router-link class="router" :to="'/withdrawal-status/' + withdrawal.ref_no">
        <div class="item">
          <div class="item__info">
            <h4 class="item__heading">
              {{ timestamp }}
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
        <div class="child2">
          <p>{{ withdrawal.status }}</p>
          <i class=""></i>
        </div>
      </div>
      </router-link>
    </div>
  </div>
</template>
<script>

export default {
  props: ['withdrawals'],
  data() {
    return {

    };
  },
  computed: {
    timestamp() {
      return new Date(this.withdrawal.created_at).toDateString();
    },
  },
};
</script>
<style scoped>
.parent{
  padding-top: 40px ;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.child1{
  justify-content: flex-start;
}

.child2{
  justify-content: flex-end;
}

</style>
