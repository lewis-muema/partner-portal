<template lang="html">
  <documentsLoading v-if="show_loading"/>
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <el-table :data="insuranceData" class="documents-table-outer">
        <el-table-column label="" width="50">
          <template slot-scope="scope">
            <i class="el-icon-success success-license" v-if="insuaranceIconStatus(insuranceData[scope.$index]) === 1"></i>
            <i class="el-icon-warning declined-license" v-if="insuaranceIconStatus(insuranceData[scope.$index]) === 0"></i>
            <i class="el-icon-circle-close declined-license" v-if="insuaranceIconStatus(insuranceData[scope.$index]) === 2"></i>
            <i class="el-icon-circle-close declined-license" v-if="insuaranceIconStatus(insuranceData[scope.$index]) === 3"></i>
          </template>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="performance--outer-overlay">
              <div class="rider--info insurance-rider-data">
                <p class="rider--name">{{ insuranceData[scope.$index]['vendor_disp_name'] }} {{ insuranceData[scope.$index]['number_plate'] }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="700">
          <template slot-scope="scope">
            <span :class="showStatusHiglight(insuranceData[scope.$index])">{{ insuaranceStatus(insuranceData[scope.$index]) }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button size="mini" class="update-license" @click="openUpdateDialog(insuranceData[scope.$index])">
              Update
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="Update Vehicle Insurance" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="inner-dialog">
        <div class="drag-image">
          <div class="download-refund-img">
            <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div v-if="Object.keys(insuranceImageData).length > 0">Change</div>
              <div v-else>Drop file here or <em>click to upload</em></div>
            </el-upload>
            <div v-if="Object.keys(insuranceImageData).length > 0">
              <span class="reward-upload-label">
                Document uploaded successfully .
              </span>
            </div>
          </div>
        </div>
        <div class="main-dialog">
          <div class="request-refund-inputs">
            <p>
              Insurance certificate number
            </p>
            <input type="text" class="request_refund-inputs" v-model="certificate_no" />
          </div>
          <div class="request-refund-inputs">
            <p>
              Policy number
            </p>
            <input type="text" class="request_refund-inputs" v-model="policy_no" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()" class="cancel-refund">Cancel</el-button>
        <el-button type="primary" @click="uploadInsuarance()" class="confirm-refund">Update</el-button>
      </span>
    </el-dialog>
    <notify /></div></template>

<script>
import S3 from 'aws-s3';
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';
import notify from '../components/notification';

let s3 = '';

export default {
  name: 'insurance',
  components: { documentsLoading, notify },
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
      insuranceImageData: {},
      dialogVisible: false,
      certificate_no: '',
      policy_no: '',
      insuranceData: [],
      rider: '',
      fileName: '',
    };
  },
  created() {
    this.initiateS3();
    setTimeout(() => {
      this.getInsuranceData();
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
    getInsuranceData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = {
        ownerId: sessionInfo.id,
      };
      axios
        .post(`${process.env.NODE_PARTNER_API}partner_portal/owner_documents`, payload, this.config)
        .then(res => {
          this.show_loading = false;
          this.insuranceData = res.data.data;
        })
        .catch(error => {
          this.show_loading = false;
          this.insuranceData = [];
        });
    },
    uploadInsuarance() {
      if (Object.keys(this.insuranceImageData).length === 0 || this.certificate_no === '' || this.policy_no === '') {
        this.notify(3, 0, 'Kindly provide all values');
      } else {
        const file = this.insuranceImageData.file;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name);
        this.fileName = fileName;
        const albumPhotosKey = `${encodeURIComponent('insurance')}/`;
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
              console.log('There was an error uploading your photo: ', err.message);
            } else {
              this.initiateUpload();
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    initiateUpload() {
      const payload = {
        riderId: parseInt(this.rider, 10),
        type: 2,
        data: {
          certificate_no: this.certificate_no,
          policy_no: this.policy_no,
        },
        document: `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName}`,
      };
      axios
        .post(`${process.env.NODE_PARTNER_API}partner_portal/update_document`, payload, this.config)
        .then(res => {
          this.notify(3, 1, 'Insurance document submitted');
          this.dialogVisible = false;
          this.show_loading = true;
          this.getInsuranceData();
          this.clearSavedData();
        })
        .catch(error => {
          this.notify(3, 0, 'Request Refund Error . Try again');
        });
    },
    clearSavedData() {
      this.insuranceImageData = {};
    },
    openUpdateDialog(data) {
      this.rider = data.rider_id;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.insuranceImageData = {};
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
          this.closeDialog();
        })
        .catch(_ => {});
    },
    handlePictureCardPreview(file) {
      this.insuranceImageData = file;
    },
    handleRemove(file, fileList) {
      this.insuranceImageData = {};
    },
    insuaranceIconStatus(data) {
      const currentTime = moment();
      let label = '';
      if (data.insurance.expiry_date === null || data.insurance.expiry_date === '' || currentTime.diff(data.insurance.expiry_date, 'days') >= 0) {
        label = 3;
      } else if (data.insurance.renewal_status === 0) {
        label = 0;
      } else if (data.insurance.renewal_status === 2) {
        label = 2;
      } else {
        label = 1;
      }
      return label;
    },
    showStatusHiglight(data) {
      const currentTime = moment();
      let className = '';
      if (data.insurance.expiry_date === null || data.insurance.expiry_date === '' || currentTime.diff(data.insurance.expiry_date, 'days') >= 0) {
        className = 'pending-license';
      } else if (data.driving_license.renewal_status === 0) {
        className = 'pending-license';
      } else if (data.driving_license.renewal_status === 2) {
        className = 'pending-license';
      } else {
        className = '';
      }
      return className;
    },
    insuaranceStatus(data) {
      const currentTime = moment();
      let text = '';
      if (data.insurance.expiry_date === null || data.insurance.expiry_date === '') {
        text = 'Missing document expiry date';
      } else if (currentTime.diff(data.insurance.expiry_date, 'days') >= 0) {
        text = `Insuarance document expires on ${moment(data.insurance.expiry_date).format('MMMM Do , YYYY')} `;
      } else {
        text = `Insuarance document expires on ${moment(data.insurance.expiry_date).format('MMMM Do , YYYY')} `;
      }
      return text;
    },
    sanitizeFilename(name) {
      const rider = parseInt(this.rider, 10);
      const temp_name = `insu_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
</style>
