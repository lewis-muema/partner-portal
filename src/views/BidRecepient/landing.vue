<template>
  <div class="landingPage">
    <div class="landing-svg">
      <img src="https://images.sendyit.com/partner_portal/images/owners_banner.svg" alt="" />
    </div>
    <div class="landingPage__content">
      <div v-if="this.$route.fullPath === '/recepient/signup'">
        <Signup />
      </div>
      <div v-else-if="this.$route.fullPath === '/recepient/verification'">
        <Verification/>
      </div>
    </div>
  </div>
</template>

<script>
import Signup from './signup.vue';
import Verification from './verification.vue';

export default {
  components: {
    Signup,
    Verification,
  },
  methods: {
    routeChecker() {
      console.log();
    },
  },
};
</script>

<style>
.landingPage {
  width: 80%;
  margin: 50px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 50px 0px;
}
.landingPage__content{
    width: 40%;
    margin: auto;
}
@media only screen and (max-width: 1040px) {
  .landing-svg{
    display: none;
  }
  .landingPage__content{
      width: 80%;
      margin: auto;
  }
}
@media only screen and (max-width: 700px) {
 .landingPage__content {
    width: 90%;
    margin: auto;
  }
}
</style>
