<template lang="html">
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <documentsLoading v-if="show_loading" />
    <div class="stats-dash" v-else>
      <div class="row dashboard__row">
        <el-table :data="bikeData" class="documents-table-outer">
          <el-table-column label="" width="60">
            <template slot-scope="scope">
              <i class="el-icon-success success-license" v-if="bikeData[scope.$index]['update_license_status'] !== 1"></i>
              <i class="el-icon-warning declined-license" v-if="bikeData[scope.$index]['update_license_status'] === 1"></i>
            </template>
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
              <div v-if="bikeData[scope.$index]['update_license_status'] === 1">
                <span class="highlight-bike-status"> {{ $t('cdbStatus.update_details') }} </span>
              </div>
              <div v-else>
                {{ bikeStatus(bikeData[scope.$index]) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" class="update-license action-button--active" @click="openUpdateDialog(bikeData[scope.$index])" :class="{ disableUpdateBtn: bikeData[scope.$index]['update_license_status'] !== 1 }">
                {{ $t('cdbStatus.update') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="dialogTitle()" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
        <div class="inner-dialog">
          <div class="drag-image">
            <p class="dialog-inner-label"> {{ $t('cdbStatus.have_cbd_licence') }}</p>
            <div class="">
              <el-radio v-model="radio" label="1" class="radio-options"> {{ $t('cdbStatus.yes') }}</el-radio>
            </div>
            <div class="">
              <el-radio v-model="radio" label="2" class="radio-options"> {{ $t('cdbStatus.no') }}</el-radio>
            </div>
            <div class="" v-if="radio === '1'">
              <p class="dialog-inner-label"> {{ $t('cdbStatus.upload_image') }}</p>
              <div class="bike-image">
                <div class="download-refund-img">
                  <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
                    <img class="upload_image" src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg" id="imagePreview" />
                    <i class="el-icon-upload"></i>
                    <div v-if="fileName !== ''">{{ uploading_text }}</div>
                    <div v-else> {{ $t('cdbStatus.drop_files_here') }} <em> {{ $t('cdbStatus.click_to_upload') }}</em></div>
                  </el-upload>
                  <div v-if="fileName !== ''">
                    <span class="reward-upload-label">
                      {{ $t('cdbStatus.doc_uploaded_successfully') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()" class="cancel-refund"> {{ $t('cdbStatus.cancel') }}</el-button>
          <el-button type="primary" @click="initiateCbdLicenseUpdate()" class="confirm-refund"> {{ $t('cdbStatus.update') }}</el-button>
        </span>
      </el-dialog>
      <notify />
    </div>
  </div>
</template>

<script>
import S3 from 'aws-s3';
import $ from 'jquery';
import axios from 'axios';
import documentsLoading from './documentsLoading.vue';
import notify from '../components/notification.vue';
import errorHandler from '../components/errorHandler.vue';

let s3 = '';

export default {
  name: 'bikeStatus',
  components: { documentsLoading, notify, errorHandler },
  data() {
    return {
      show_loading: true,
      colors: '#EE7D00',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      activeTab: '',
      radio: '',
      carrier_type: '',
      dialogVisible: false,
      bikeData: [],
      bikeDialogData: {},
      errorObj: '',
      uploading_text: this.$t('cdbStatus.change'),
      fileName: '',
      bikeStatusData: {},
      rider: '',
    };
  },
  created() {
    this.initiateS3();
    setTimeout(() => {
      this.getBikeData();
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
      this.radio = '';
      this.fileName = '';
      this.bikeStatusData = {};
      this.uploading_text = this.$t('cdbStatus.change');
      this.bikeDialogData = data;
      this.rider = data.rider_id;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.bikeDialogData = {};
      this.fileName = '';
      this.bikeStatusData = {};
      this.uploading_text = this.$t('cdbStatus.change');
    },
    dialogTitle() {
      return 'CBD status';
    },
    handleClose(done) {
      this.$confirm(this.$t('cdbStatus.sure_close_dialogue'))
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
      let cbd_state = this.$t('cdbStatus.does_have_cbd_license');

      if (data.license_status === 1) {
        cbd_state = this.$t('cdbStatus.cbd_licence');
      }

      return cbd_state;
    },
    initiateCbdLicenseUpdate() {
      if (this.radio === '') {
        this.notify(3, 0, this.$t('cdbStatus.provide_all_values'));
      } else if (this.radio === '1' && Object.keys(this.bikeStatusData).length === 0) {
        this.notify(3, 0, this.$t('cdbStatus.upload_cbd_licence'));
      } else {
        const payload = {
          sim_card_sn: this.bikeDialogData.sim_card_sn,
          rider_phone: this.bikeDialogData.rider_phone,
          license_status: parseInt(this.radio, 10),
        };

        if (this.radio === '1') {
          payload.license_status_docs = [`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName}`];
        }

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
            this.notify(3, 0, this.$t('cdbStatus.upload_cbd_licence'));
          });
      }
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    handlePictureCardPreview(file) {
      this.bikeStatusData = file;
      this.uploadBikeData();
    },
    handleRemove(file, fileList) {
      this.fileName = '';
      this.bikeStatusData = {};
      this.uploading_text = this.$t('cdbStatus.change');
    },
    uploadBikeData() {
      if (Object.keys(this.bikeStatusData).length === 0) {
        this.notify(3, 0, this.$t('cdbStatus.upload_cbd_licence'));
      } else {
        this.uploading_text = this.$t('cdbStatus.loading_preview');
        const file = this.bikeStatusData.file;
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
              this.uploading_text = this.$t('cdbStatus.change');
              console.log('There was an error uploading your photo: ', err.message);
            } else {
              const imageId = 'imagePreview';
              const src = `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.fileName}`;
              $(`#${imageId}`).attr('src', src);
              this.uploading_text = this.$t('cdbStatus.change');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    sanitizeFilename(name) {
      const temp_name = `cbd_license_${new Date().getTime()}.${name.split('.').pop()}`;
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
