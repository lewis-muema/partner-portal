<template lang="html">
  <documentsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <el-table :data="bikeData" class="documents-table-outer">
        <el-table-column label="" width="50">
          <i class="el-icon-success success-license"></i>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="performance--outer-overlay">
              <div class="rider--info bike-status-rider-label">
                <p class="rider--name">{{ bikeData[scope.$index]['vendor'] }} {{ bikeData[scope.$index]['vehiclePlate'] }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="700"> </el-table-column>
        <el-table-column>
          <el-button size="mini" class="update-license" @click="openUpdateDialog()">
            Update
          </el-button>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="Type of bike & CBD status" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
      <div class="inner-dialog">
        <div class="drag-image">
          <p class="dialog-inner-label">What is the type of your bike?</p>
          <div class="carrier-upper-padding">
            <div class="vendors-final-outerline">
              <div class="vendor-final-cards" :class="{ vendor_active_final: activeTab === 'box' }" @click="selectCard('box', 1)">
                <img class="vendor-types-final" :src="getVendorIcon(1)" alt="" />
                <p class="vendor-label">Bike with a Box</p>
              </div>
              <div class="vendor-final-cards" :class="{ vendor_active_final: activeTab === 'no-box' }" @click="selectCard('no-box', 0)">
                <img class="vendor-types-final" :src="getVendorIcon(0)" alt="" />
                <p class="vendor-label">Bike without Box</p>
              </div>
            </div>
          </div>
          <p class="dialog-inner-label">Do you have a CBD license?</p>
          <div class="">
            <el-radio v-model="radio" label="1" class="radio-options">Yes</el-radio>
          </div>
          <div class="">
            <el-radio v-model="radio" label="2" class="radio-options">No</el-radio>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()" class="cancel-refund">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="confirm-refund">Update</el-button>
      </span>
    </el-dialog>
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
      activeTab: '',
      radio: '',
      carrier_type: '',
      dialogVisible: false,
      bikeData: [
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
    openUpdateDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
          this.closeDialog();
        })
        .catch(_ => {});
    },
    selectCard(tab, code) {
      this.activeTab = tab;
      this.carrier_type = code;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
</style>
