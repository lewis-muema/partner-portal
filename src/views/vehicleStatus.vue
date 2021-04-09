<template lang="html">
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <documentsLoading v-if="show_loading" />
    <div class="stats-dash" v-else>
      <div class="row dashboard__row">
        <el-table :data="vehicleData" class="documents-table-outer">
          <el-table-column label="" width="60">
            <template slot-scope="scope">
              <i class="el-icon-success success-license" v-if="vehicleData[scope.$index]['update_carrier_type'] !== 1"></i>
              <i class="el-icon-warning declined-license" v-if="vehicleData[scope.$index]['update_carrier_type'] === 1"></i>
            </template>
          </el-table-column>
          <el-table-column width="400">
            <template slot-scope="scope">
              <div class="performance--outer-overlay">
                <div class="rider--info bike-status-rider-label">
                  <p class="rider--name">{{ vehicleData[scope.$index]['vendor_disp_name'] }} {{ vehicleData[scope.$index]['number_plate'] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="700">
            <template slot-scope="scope">
              <div v-if="vehicleData[scope.$index]['update_carrier_type'] === 1">
                <span class="highlight-bike-status"> Update details </span>
              </div>
              <div v-else>
                {{ vehicleStatus(vehicleData[scope.$index]) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" class="update-license action-button--active" @click="openUpdateDialog(vehicleData[scope.$index])" :class="{ disableUpdateBtn: vehicleData[scope.$index]['update_carrier_type'] !== 1 }">
                Update
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="dialogTitle(vehicleDialogData.vendor_disp_name)" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
        <div class="inner-dialog">
          <div class="drag-image">
            <div v-if="vehicleDialogData.update_carrier_type === 1">
              <p class="dialog-inner-label">What is the type of your {{ vehicleDialogData.vendor_disp_name }}?</p>
              <div class="carrier-upper-padding">
                <div class="vendors-final-outerline">
                  <div class="vendor-final-cards" :class="{ vendor_active_final: activeTab === 'no-box' }" @click="selectCard('no-box', 0)">
                    <img class="vendor-types-final" :src="getVendorIcon(0, vehicleDialogData.vendor_type)" alt="" />
                    <p v-if="vehicleDialogData.vendor_type === 1" class="vendor-label">Bike without Box</p>
                    <p v-else class="vendor-label">Open {{ vehicleDialogData.vendor_disp_name }}</p>
                  </div>
                  <div class="vendor-final-cards" :class="{ vendor_active_final: activeTab === 'box' }" @click="selectCard('box', 1)">
                    <img class="vendor-types-final" :src="getVendorIcon(1, vehicleDialogData.vendor_type)" alt="" />
                    <p v-if="vehicleDialogData.vendor_type === 1" class="vendor-label">Bike with a Box</p>
                    <p v-else class="vendor-label">Closed {{ vehicleDialogData.vendor_disp_name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <p class="dialog-inner-label">Upload image of your {{ vehicleDialogData.vendor_disp_name }}</p>
              <div class="bike-image">
                <div class="download-refund-img">
                  <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
                    <img class="upload_image" src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg" id="imagePreview" />
                    <i class="el-icon-upload"></i>
                    <div v-if="fileName !== ''">{{ uploading_text }}</div>
                    <div v-else>Drop file here or <em>click to upload</em></div>
                  </el-upload>
                  <div v-if="fileName !== ''">
                    <span class="reward-upload-label">
                      Document uploaded successfully .
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer submit-dialog-footer">
            <el-button @click="closeDialog()" class="cancel-refund">Cancel</el-button>
            <el-button type="primary" @click="initiateVehicleUpdate()" class="confirm-refund">Update</el-button>
          </span>
        </div></el-dialog>
      <notify />
    </div>
  </div>
</template>

<script>
import S3 from 'aws-s3';
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';
import notify from '../components/notification';
import errorHandler from '../components/errorHandler';

let s3 = '';

export default {
  name: 'vehicleStatus',
  components: { documentsLoading, notify, errorHandler },
  data() {
    return {
      show_loading: true,
      colors: '#EE7D00',
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
      vehicleData: [],
      vehicleDialogData: {},
      errorObj: '',
      uploading_text: 'Change',
      fileName: '',
      vehicleStatusData: {},
      rider: '',
    };
  },
  created() {
    this.initiateS3();
    setTimeout(() => {
      this.getVehicleData();
    }, 5000);
  },
  methods: {
    initiateS3() {
      const script = document.createElement('script');
      script.onload = () => {
        const albumBucketName = 'sendy-partner-docs';
        const bucketRegion = 'eu-west-1';
        const IdentityPoolId = 'eu-west-1:2812c134-0c22-4755-be2d-8fa850a041ee';

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId,
          }),
        });

        s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: albumBucketName },
        });
      };
      script.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.7.20.min.js';

      document.head.appendChild(script);
    },
    getVehicleData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = {
        ownerId: sessionInfo.id,
      };
      axios
        .post(`${process.env.NODE_PARTNER_API}partner_portal/owner_documents`, payload, this.config)
        .then(res => {
          this.show_loading = false;
          const result = res.data.data;
          this.vehicleData = result.filter(obj => obj.vendor_type === 1 || obj.vendor_type === 2);
        })
        .catch(error => {
          this.errorObj = error.response;
          this.show_loading = false;
          this.vehicleData = [];
        });
    },
    openUpdateDialog(data) {
      this.carrier_type = '';
      this.vehicleDialogData = data;
      this.rider = data.rider_id;
      if (data.update_carrier_type !== 1) {
        this.carrier_type = data.carrier_type;
      }
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.vehicleDialogData = {};
      this.fileName = '';
      this.vehicleStatusData = {};
      this.uploading_text = 'Change';
    },
    dialogTitle(vendor) {
      return `Update type of ${vendor}`;
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
    getVendorIcon(id, vendor) {
      if (id === 0) {
        return `https://images.sendyit.com/web_platform/vendor_type/side/v2/open/${vendor}.svg`;
      }
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/closed/${vendor}.svg`;
    },
    vehicleStatus(data) {
      let carrier_name = data.vendor_type === 1 ? 'Bike without a box' : `Open ${data.vendor_disp_name}`;
      if (data.carrier_type === 1) {
        carrier_name = data.vendor_type === 1 ? 'Bike with a box' : `Closed ${data.vendor_disp_name}`;
      }

      return carrier_name;
    },
    initiateVehicleUpdate() {
      if (this.carrier_type === '' || Object.keys(this.vehicleStatusData).length === 0) {
        this.notify(3, 0, 'Kindly provide all values');
      } else {
        const payload = {
          sim_card_sn: this.vehicleDialogData.sim_card_sn,
          rider_phone: this.vehicleDialogData.rider_phone,
          carrier_type: parseInt(this.carrier_type, 10),
          carrier_type_docs: [`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName}`],
        };
        axios
          .post(`${process.env.PARTNERS_APP}partner_details_update`, payload, this.config)
          .then(res => {
            this.dialogVisible = false;
            this.show_loading = true;
            this.getVehicleData();
            this.closeDialog();
          })
          .catch(error => {
            this.errorObj = error.response;
            this.notify(3, 0, `${this.vehicleDialogData.vendor_disp_name} Status Update Error . Try again`);
          });
      }
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    handlePictureCardPreview(file) {
      this.vehicleStatusData = file;
      this.uploadVehicleData();
    },
    handleRemove(file, fileList) {
      this.fileName = '';
      this.vehicleStatusData = {};
      this.uploading_text = 'Change';
    },
    uploadVehicleData() {
      if (Object.keys(this.vehicleStatusData).length === 0) {
        this.notify(3, 0, 'Kindly upload bike image ');
      } else {
        this.uploading_text = 'Loading Preview ...';
        const file = this.vehicleStatusData.file;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name);
        const rider = parseInt(this.rider, 10);
        this.fileName = fileName;
        const albumPhotosKey = `${encodeURIComponent('partner_details')}/${rider}/`;
        const photoKey = albumPhotosKey + fileName;
        this.fileName = photoKey;
        s3.upload(
          {
            Key: photoKey,
            Body: file,
            ACL: 'public-read',
            ContentType: fileType,
          },
          (err, data) => {
            if (err) {
              this.uploading_text = 'Change';
              console.log('There was an error uploading your photo: ', err.message);
            } else {
              const imageId = 'imagePreview';
              const src = `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.fileName}`;
              $(`#${imageId}`).attr('src', src);
              this.uploading_text = 'Change';
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    sanitizeFilename(name) {
      const temp_name = `${this.vehicleDialogData.vendor_disp_name.toLowerCase().replace(' ', '_')}_img_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
.action-button--active {
  background-color: #EE7D00;
  border-color: #EE7D00;
  color: #fff;
}
.action-button--disable {
  pointer-events: none;
  cursor: not-allowed;
}
.disableUpdateBtn {
  background: #635c5c !important;
  border-color: #635c5c !important;
  pointer-events: none;
  cursor: not-allowed;
}
.highlight-bike-status {
  color: #EE7D00;
}
</style>
