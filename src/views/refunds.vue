<template lang="html">
  <div class="">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <documentsLoading v-if="show_loading" />
    <div class="stats-dash" v-else>
      <div class="request-refund--section">
        <el-button size="mini" class="request-refund-btn" @click="openRefundDialog()">
          {{ $t('refund.request_refund') }}
        </el-button>
      </div>
      <div class="row dashboard__row">
        <el-table :data="refundsData" class="refund-main-dialog">
          <el-table-column prop="description" label="Description"> </el-table-column>
          <el-table-column label="Refund amount">
            <template slot-scope="scope"> Ksh {{ refundsData[scope.$index]['amount'] }} </template>
          </el-table-column>
          <el-table-column prop="order_no" label="Order number"> </el-table-column>
          <el-table-column label="Date">
            <template slot-scope="scope">
              {{ formatDate(refundsData[scope.$index]['date']) }}
            </template>
          </el-table-column>
          <el-table-column label="Status">
            <template slot-scope="scope">
              <span :class="showStatusHiglight(refundsData[scope.$index]['status'])">{{ checkStatus(refundsData[scope.$index]['status']) }} </span>
            </template>
          </el-table-column>
          <el-table-column label="Document">
            <template slot-scope="scope">
              <el-button size="mini" class="update-license" @click="openRefundView(refundsData[scope.$index])">
                {{ $t('refund.view') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="Request refund" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div class="inner-dialog">
          <div class="drag-image">
            <div class="download-refund-img">
              <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
                <img class="upload_image" src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg" id="imagePreview" />
                <i class="el-icon-upload"></i>
                <div v-if="fileName !== ''">{{ uploading_text }}</div>
                <div v-else>{{ $t('refund.drop_files_here') }}or <em>{{ $t('refund.click_to_upload') }}</em></div>
              </el-upload>
              <div v-if="fileName !== ''">
                <span class="reward-upload-label">
                {{ $t('refund.document_uploaded_successfully') }}
                </span>
              </div>
            </div>
          </div>
          <div class="main-dialog">
            <div class="request-refund-inputs">
              <p>
                {{ $t('refund.description') }}
              </p>
              <input type="text" class="request_refund-inputs" v-model="description" />
            </div>
            <div class="request-refund-inputs">
              <p>
                {{ $t('refund.order_number') }}
              </p>
              <input type="text" class="request_refund-inputs" v-model="order_number" />
            </div>
            <div class="request-refund-inputs">
              <p>
                {{ $t('refund.partner') }}
              </p>
              <el-select v-model="rider" placeholder="Select Partner" class="refund-rider-info">
                <el-option v-for="item in rider_list" :key="item.rider_id" :label="item.name" :value="item.rider_id"> </el-option>
              </el-select>
            </div>

            <div class="request-refund-inputs">
              <p>
                {{ $t('refund.refund_amount') }}
              </p>
              <input type="number" class="request_refund-inputs" v-model="refund_amount" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()" class="cancel-refund">{{ $t('refund.cancel') }}</el-button>
          <el-button type="primary" @click="initiateRequest()" class="confirm-refund">{{ $t('refund.confirm') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog title="View Refund Request" :visible.sync="refundRequest" width="50%" :before-close="handleClose">
        <div class="inner-dialog">
          <div class="drag-image">
            <div class="download-refund-img">
              <img class="refund-documents" :src="requestViewData.documents" alt="" />
            </div>
          </div>
          <div class="main-dialog">
            <div class="request-refund-inputs">
              <p class="request-refund-label">
                {{ $t('refund.description') }}
              </p>
              <p class="refund-text">{{ requestViewData.description }}</p>
            </div>
            <div class="request-refund-inputs">
              <p class="request-refund-label">
                {{ $t('refund.order_number') }}
              </p>
              <p class="refund-text">{{ requestViewData.order_no }}</p>
            </div>
            <div class="request-refund-inputs">
              <p class="request-refund-label">
                {{ $t('refund.refund_amount') }}
              </p>
              <p class="refund-text">{{ requestViewData.currency }} {{ requestViewData.amount }}</p>
            </div>
            <div class="request-refund-inputs" v-if="requestViewData.status === 2">
              <p class="request-refund-label">
                {{ $t('refund.declined_reason') }}
              </p>
              <p class="refund-text">{{ requestViewData.reason }}</p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()" class="cancel-refund">{{ $t('refund.back') }}</el-button>
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
  name: 'refunds',
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
      dialogVisible: false,
      dialogImageUrl: '',
      imageDialogVisible: false,
      refundRequest: false,
      requestViewData: {},
      refundImageData: {},
      rider_list: [],
      rider: '',
      description: '',
      order_number: '',
      refund_amount: '',
      fileName: '',
      refundsData: [],
      errorObj: '',
      uploading_text: this.$t('refund.change'),
    };
  },
  computed: {
    img_section_style() {
      if (typeof this.fileName === 'undefined' || this.fileName === null) {
        return {
          background: 'url(https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/default_pic.jpg)',
        };
      } else {
        return {
          background: `url(https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName})`,
        };
      }
    },
  },
  created() {
    this.initiateS3();
    this.fetchDrivers();
    setTimeout(() => {
      this.getRefundsData();
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
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    getRefundsData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = {
        owner_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.PARTNERS_APP}owner_refund_requests`, payload, this.config)
        .then(res => {
          this.show_loading = false;
          this.refundsData = res.data;
        })
        .catch(error => {
          this.errorObj = error.response;
          this.show_loading = false;
          this.refundsData = [];
        });
    },
    fetchDrivers() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riderPayload = {
        owner_id: sessionInfo.id,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, riderPayload, this.config)
        .then(res => {
          this.rider_list = res.data.riders;
        })
        .catch(error => {
          this.errorObj = error.response;
          this.rider_list = [];
        });
    },
    uploadToS3() {
      if (Object.keys(this.refundImageData).length === 0) {
        this.notify(3, 0, 'Kindly upload refund image');
      } else {
        this.uploading_text = 'Loading Preview ...';
        const file = this.refundImageData.file;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name);
        const rider = parseInt(this.rider, 10);
        this.fileName = fileName;
        const albumPhotosKey = `${encodeURIComponent('refund_requests')}/${rider}/`;
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
              this.uploading_text = this.$t('refund.change');
              console.log('There was an error uploading your photo: ', err.message);
            } else {
              const imageId = 'imagePreview';
              const src = `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.fileName}`;
              $(`#${imageId}`).attr('src', src);
              this.uploading_text = this.$t('refund.change');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    initiateRequest() {
      if (Object.keys(this.refundImageData).length === 0 || this.description === '' || this.order_number === '' || this.rider === '' || this.refund_amount === '') {
        this.notify(3, 0, 'Kindly provide all values');
      } else {
        const payload = {
          rider_id: parseInt(this.rider, 10),
          description: this.description,
          order_no: this.order_number,
          amount: this.refund_amount,
          documents: [`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/${this.fileName}`],
        };
        axios
          .post(`${process.env.PARTNERS_APP}request_refund`, payload, this.config)
          .then(res => {
            this.dialogVisible = false;
            this.show_loading = true;
            this.getRefundsData();
            this.clearSavedData();
          })
          .catch(error => {
            this.errorObj = error.response;
            this.notify(3, 0, 'Request Refund Error . Try again');
          });
      }
    },
    clearSavedData() {
      this.refundImageData = [];
      this.description = '';
      this.order_number = '';
      this.rider = '';
      this.refund_amount = '';
      this.closeDialog();
    },
    sanitizeFilename(name) {
      const rider = parseInt(this.rider, 10);
      const temp_name = `refunds_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
    checkStatus(value) {
      let status = '';
      if (value === 0) {
        status = this.$t('refund.pending');
      } else if (value === 1) {
        status = this.$t('refund.approved');
      } else {
        status = this.$t('refund.declined');
      }

      return status;
    },
    showStatusHiglight(value) {
      let className = '';
      if (value === 0) {
        className = 'pending-highlight';
      } else if (value === 2) {
        className = 'declined-highlight';
      } else {
        className = 'approved-highlight';
      }

      return className;
    },
    formatDate(date) {
      return moment(date).format('MMMM Do YYYY');
    },
    handleClose(done) {
      this.$confirm(this.$t('refund.sure_close_dialog'))
        .then(_ => {
          done();
          this.closeDialog();
        })
        .catch(_ => {});
    },
    handleRemove(file, fileList) {
      this.refundImageData = {};
    },
    handlePictureCardPreview(file) {
      this.refundImageData = file;
      this.uploadToS3();
    },
    closeDialog() {
      this.uploading_text = this.$t('refund.change');
      const imageId = 'imagePreview';
      this.refundRequest = false;
      this.dialogVisible = false;
      this.refundImageData = {};
      this.requestViewData = {};
      this.fileName = '';
      const src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
      $(`#${imageId}`).attr('src', src);
    },
    openRefundDialog() {
      this.dialogVisible = true;
    },
    openRefundView(data) {
      this.requestViewData = data;
      this.refundRequest = true;
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
</style>
