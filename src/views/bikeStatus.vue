<template lang="html">
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <documentsLoading v-if="show_loading" />
    <div class="stats-dash" v-else>
      <div class="row dashboard__row">
        <el-table :data="bikeData" class="documents-table-outer">
          <el-table-column label="" width="60">
            <i class="el-icon-success success-license"></i>
          </el-table-column>
          <el-table-column width="400">
            <template slot-scope="scope">
              <div class="performance--outer-overlay">
                <div class="rider--info bike-status-rider-label">
                  <p class="rider--name">{{ bikeData[scope.$index]['vendor_disp_name'] }} {{ bikeData[scope.$index]['number_plate'] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="700">
            <template slot-scope="scope">
              {{ bikeStatus(bikeData[scope.$index]) }}
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" class="update-license" :class="bikeData[scope.$index]['update_carrier_type'] === 1 ? 'action-button--active' : 'action-button--disable'" @click="openUpdateDialog(bikeData[scope.$index])">
                Update
              </el-button>
            </template>
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
          <el-button type="primary" @click="initiateBikeUpdate()" class="confirm-refund">Update</el-button>
        </span>
      </el-dialog>
      <notify />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';
import notify from '../components/notification';
import errorHandler from '../components/errorHandler';

export default {
  name: 'bikeStatus',
  components: { documentsLoading, notify, errorHandler },
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
      bikeData: [],
      bikeDialogData: {},
      errorObj: '',
    };
  },
  created() {
    setTimeout(() => {
      this.getBikeData();
    }, 5000);
  },
  methods: {
    getBikeData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = {
        ownerId: sessionInfo.id,
      };
      axios
        .post(`${process.env.NODE_PARTNER_API}partner_portal/owner_documents`, payload, this.config)
        .then(res => {
          this.show_loading = false;
          const result = res.data.data;
          this.bikeData = result.filter(obj => obj.vendor_type === 1);
        })
        .catch(error => {
          this.errorObj = error.response;
          this.show_loading = false;
          this.bikeData = [];
        });
    },
    openUpdateDialog(data) {
      this.bikeDialogData = data;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.bikeDialogData = {};
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
    bikeStatus(data) {
      let carrier_name = 'Bike without a box';
      let cbd_state = 'can’t access CBD';
      if (data.carrier_type === 1) {
        carrier_name = 'Bike with a box';
      }

      if (data.license_status === 1) {
        cbd_state = 'can access CBD';
      }

      return `${carrier_name} & ${cbd_state}`;
    },
    initiateBikeUpdate() {
      if (this.carrier_type === '' || this.radio === '') {
        this.notify(3, 0, 'Kindly provide all values');
      } else {
        const payload = {
          sim_card_sn: this.bikeDialogData.sim_card_sn,
          rider_phone: this.bikeDialogData.rider_phone,
          carrier_type: parseInt(this.carrier_type, 10),
          license_status: parseInt(this.radio, 10),
        };
        axios
          .post(`${process.env.PARTNERS_APP}partner_details_update`, payload, this.config)
          .then(res => {
            this.dialogVisible = false;
            this.show_loading = true;
            this.getBikeData();
            this.closeDialog();
          })
          .catch(error => {
            this.errorObj = error.response;
            this.notify(3, 0, 'Bike Status Update Error . Try again');
          });
      }
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
.action-button--active {
  background-color: #f57f20;
  border-color: #f57f20;
  color: #fff;
}
.action-button--disable {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
