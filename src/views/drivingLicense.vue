<template lang="html">
  <div>
    <errorHandler :error="errorObj" v-if="errorObj" />
    <documentsLoading v-if="show_loading" />
    <div class="stats-dash" v-else>
      <div class="row dashboard__row">
        <el-table :data="licenseData" class="documents-table-outer">
          <el-table-column label="" width="50">
            <template slot-scope="scope">
              <i class="el-icon-success success-license" v-if="licenseIconStatus(licenseData[scope.$index]) === 1"></i>
              <i class="el-icon-warning declined-license" v-if="licenseIconStatus(licenseData[scope.$index]) === 0"></i>
              <i class="el-icon-circle-close declined-license" v-if="licenseIconStatus(licenseData[scope.$index]) === 2"></i>
              <i class="el-icon-circle-close declined-license" v-if="licenseIconStatus(licenseData[scope.$index]) === 3"></i>
            </template>
          </el-table-column>
          <el-table-column width="400">
            <template slot-scope="scope">
              <div class="performance--outer-overlay">
                <div class="partner--image">
                  <img class="partner-icon" :src="`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${licenseData[scope.$index]['photo']}`" alt="" />
                </div>
                <div class="rider--info driver-info">
                  <p class="rider--name">{{ licenseData[scope.$index]['rider_name'] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="700">
            <template slot-scope="scope">
              <span :class="showStatusHiglight(licenseData[scope.$index])">{{ licenseStatus(licenseData[scope.$index]) }}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" class="update-license" @click="openUpdateDialog(licenseData[scope.$index])">
                {{ $t('drivingLicence.update') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="Update Driving License" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
        <div class="inner-dialog">
          <div class="drag-image">
            <div class="download-refund-img">
              <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
                <img class="upload_image" src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg" id="imagePreview" />
                <i class="el-icon-upload"></i>
                <div v-if="fileName !== ''">{{ uploading_text }}</div>
                <div v-else>{{ $t('drivingLicence.drop_files_here') }} <em>{{ $t('drivingLicence.click_to_upload') }} </em></div>
              </el-upload>
              <div v-if="fileName !== ''">
                <span class="reward-upload-label">
                 {{ $t('drivingLicence.document_uploaded_successfully') }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()" class="cancel-refund">{{ $t('drivingLicence.cancel') }}</el-button>
          <el-button type="primary" @click="initiateUpload()" class="confirm-refund">{{ $t('drivingLicence.update') }}</el-button>
        </span>
      </el-dialog>
      <notify />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import S3 from 'aws-s3';
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';
import notify from '../components/notification';
import errorHandler from '../components/errorHandler';

let s3 = '';

export default {
  name: 'drivingLicense',
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
      licenseImageData: {},
      rider: '',
      dialogVisible: false,
      fileName: '',
      licenseData: [],
      errorObj: '',
      uploading_text: this.$t('drivingLicence.change'),
    };
  },
  created() {
    this.initiateS3();
    setTimeout(() => {
      this.getLicenseData();
    }, 5000);
  },
  methods: {
    getLicenseData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = {
        ownerId: sessionInfo.id,
      };
      axios
        .post(`${process.env.NODE_PARTNER_API}partner_portal/owner_documents`, payload, this.config)
        .then(res => {
          this.show_loading = false;
          this.licenseData = res.data.data;
        })
        .catch(error => {
          this.errorObj = error.response;
          this.show_loading = false;
          this.licenseData = [];
        });
    },
    openUpdateDialog(data) {
      this.rider = data.rider_id;
      this.dialogVisible = true;
    },
    closeDialog() {
      const imageId = 'imagePreview';
      this.dialogVisible = false;
      this.licenseImageData = {};
      this.fileName = '';
      const src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
      $(`#${imageId}`).attr('src', src);
      this.uploading_text = this.$t('drivingLicence.change');
    },
    handleClose(done) {
      this.$confirm(this.$t('drivingLicence.sure_close_dialogue'))
        .then(_ => {
          done();
          this.closeDialog();
        })
        .catch(_ => {});
    },
    handlePictureCardPreview(file) {
      this.licenseImageData = file;
      this.uploadDl();
    },
    handleRemove(file, fileList) {
      this.licenseImageData = {};
    },
    licenseStatus(data) {
      const currentTime = moment();
      let text = '';
      if ((data.driving_license.expiry_date === null || data.driving_license.expiry_date === '') && data.driving_license.renewal_status === -1) {
        text = this.$t('drivingLicence.kindly_upload_dl');
      } else if (data.driving_license.renewal_status === 0) {
        text = this.$t('drivingLicence.pending_approval');
      } else if (data.driving_license.renewal_status === 2) {
        text = this.$t('drivingLicence.document_declined');
      } else if (currentTime.diff(data.driving_license.expiry_date, 'days') >= 0 || currentTime.diff(data.driving_license.expiry_date, 'days') < 0) {
        text = this.$t('drivingLicence.delivery_licence_expires', { expiry_date: data.driving_license.expiry_date });
      } else {
        text = this.$t('drivingLicence.delivery_licence_expires', { expiry_date: data.driving_license.expiry_date });
      }
      return text;
    },
    licenseIconStatus(data) {
      const currentTime = moment();
      let label = '';
      if (currentTime.diff(data.driving_license.expiry_date, 'days') >= 0) {
        label = 3;
      } else if (data.driving_license.renewal_status === 0 || data.driving_license.renewal_status === 2) {
        label = 0;
      } else if (data.driving_license.expiry_date === null || data.driving_license.expiry_date === '' || data.driving_license.renewal_status === -1) {
        label = 3;
      } else if (currentTime.diff(data.driving_license.expiry_date, 'days') < 0) {
        label = 1;
      } else if (data.driving_license.renewal_status === 2) {
        label = 2;
      } else {
        label = 1;
      }
      return label;
    },
    showStatusHiglight(data) {
      const currentTime = moment();
      let className = '';
      if (data.driving_license.expiry_date === null || data.driving_license.expiry_date === '' || currentTime.diff(data.driving_license.expiry_date, 'days') >= 0) {
        className = 'pending-license';
      } else if (data.driving_license.renewal_status === 0 || data.driving_license.renewal_status === 2 || data.driving_license.renewal_status === -1) {
        className = 'pending-license';
      } else if (currentTime.diff(data.driving_license.expiry_date, 'days') < 0) {
        className = '';
      } else {
        className = '';
      }
      return className;
    },
    uploadDl() {
      if (Object.keys(this.licenseImageData).length === 0) {
        this.notify(3, 0, this.$t('drivingLicence.kindly_upload_dl'));
      } else {
        this.uploading_text = this.$t('drivingLicence.loading_preview');
        const file = this.licenseImageData.file;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name);
        this.fileName = fileName;
        const albumPhotosKey = `${encodeURIComponent('dl')}/`;
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
              this.uploading_text = this.$t('drivingLicence.change');
              console.log('There was an error uploading your photo: ', err.message);
            } else {
              const imageId = 'imagePreview';
              const src = `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.fileName}`;
              $(`#${imageId}`).attr('src', src);
              this.uploading_text = this.$t('drivingLicence.change');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    initiateUpload() {
      if (this.fileName !== '') {
        const payload = {
          riderId: parseInt(this.rider, 10),
          type: 1,
          data: {},
          document: `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName}`,
        };
        axios
          .post(`${process.env.NODE_PARTNER_API}partner_portal/update_document`, payload, this.config)
          .then(res => {
            this.notify(3, 1, this.$t('drivingLicence.dl_submited'));
            this.dialogVisible = false;
            this.show_loading = true;
            this.getLicenseData();
            this.clearSavedData();
          })
          .catch(error => {
            this.errorObj = error.response;
            this.notify(3, 0, this.$t('drivingLicence.request_refund_error'));
          });
      } else {
        this.notify(3, 0, this.$t('drivingLicence.kindly_upload_dl'));
      }
    },
    sanitizeFilename(name) {
      const rider = parseInt(this.rider, 10);
      const temp_name = `dl_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
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
    clearSavedData() {
      this.licenseImageData = {};
      this.fileName = '';
      this.uploading_text = this.$t('drivingLicence.change');
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
</style>
