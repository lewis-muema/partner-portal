<template lang="html">
  <div>
    <div v-for="(withdrawal, index) in withdrawals" :key="index">
      <router-link :to="'/withdrawal-status/'+withdrawal.ref_no">
      <div class="parent">
        <div class="child1">
          <h4>{{ withdrawal.created_at }}</h4>
          <p>{{ withdrawal.payment_method }} - {{ withdrawal.amount }}</p>
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
