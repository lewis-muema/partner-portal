<template lang="html">
  <div class="performance--header">
    <div class="performance--header--item">
      <div class="performance--header--item__left">
        <div class="performance--header--item__left__inner">
          <div class="performance--outer-overlay">
            <div class="rider--image">
              <img class="rider-icon" :src="`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${rider.photo}`" alt="" />
            </div>
            <div class="rider--info" style="padding-top: 6%;">
              <p class="rider--name">{{ rider.name }}</p>
              <p class="rider--vehicle">{{ rider.registration_no }}</p>
            </div>
          </div>
          <div v-if="this.visible" class="perfomance--list--available">
            <el-dropdown trigger="click">
              <div><i class="el-icon-arrow-down el-icon--right"></i></div>
              <el-dropdown-menu slot="dropdown" class="unnamed">
                <div v-for="(rider, index) in rider_list" :key="index">
                  <el-dropdown-item @click.native="riderSelected(rider)">
                    <div class="available--rider--outer-overlay ">
                      <div class="available--rider--image">
                        <img class="available--rider-icon" :src="`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${rider.photo}`" alt="" />
                      </div>
                      <div class="available--rider--info" style="margin-left : 5px;padding-left:10px;">
                        <p class="available--rider--name">{{ rider.name }}</p>
                        <span class="available--rider--vehicle">{{ rider.registration_no }}</span>
                      </div>
                    </div>
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="performance--header--item__right">
      <div class="rating--section">
        <a>Rating</a>
        <p>
          <span style="padding-top: 3%;">{{ rider.rating }}</span> <el-rate v-model="rider.rating" disabled class="el-rate__icon" disabled-void-color="#C0C4CC" :colors="['#F57E20', '#F57E20', '#F57E20']"> </el-rate>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Mixpanel from 'mixpanel';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  name: 'riderPerformanceHeader',
  data() {
    return {
      rider_list: [],
      rider: [],
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      visible: false,
    };
  },
  created() {
    this.fetchBikeDrivers();
    this.fetchRiderList();
    const mixPanelPayload = {
      owner_id: sessionInfo.id,
    };
    // this tracks all performance page loads
    this.trackRiderPerformanceLoad(mixPanelPayload);
  },
  methods: {
    trackRiderPerformanceLoad(payload) {
      const data = JSON.parse(payload);
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Rider Performance Loaded', data);
      }
    },
    fetchBikeDrivers() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        owner_id: sessionInfo.id,
        vendor_type: 1,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
        .then(res => {
          this.$store.commit('setBikeAvailability', true);
          this.$store.commit('setBikeRiders', res.data.riders);
          this.rider_list = res.data.riders;
          this.singleRiderIdentifier();
          this.riderLengthIdentifier();
        })
        .catch(error => {
          this.$store.commit('setBikeAvailability', false);
          this.$store.commit('setBikeRiders', []);
          this.rider_list = [];
        });
    },
    fetchRiderList() {
      const riders = this.$store.getters.getBikeRiders;
      this.riders = riders;
    },
    singleRiderIdentifier() {
      this.rider = this.rider_list[0];
      this.$store.commit('setBikeRiderId', this.rider.rider_id);
    },
    riderSelected(singleRider) {
      this.rider = singleRider;
      this.$store.commit('setBikeRiderId', singleRider.rider_id);
    },
    riderLengthIdentifier() {
      const rider = this.rider_list;
      if (rider.length > 1) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
  },
};
</script>

<style lang="css" scoped></style>