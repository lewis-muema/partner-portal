<template lang="html">
  <div class="owners-banner-outer">
  <div class="">
    <div>
      <img
        src="https://images.sendyit.com/partner_portal/images/login-page-banner.svg"
        class="owners-banner-logo"
      >
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ownersBannerComponent',
};
</script>

<style lang="css">
@media (max-width: 1036px) {
  .owners-banner-outer {
    display: none !important;
  }
}
.owners-banner-outer{
  -webkit-box-flex: 1;
  flex: 2;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-right: 9%;
}
.owners-banner-logo{
  display: block;
  width: 82%;
  margin: 6% auto auto;
}
</style>
