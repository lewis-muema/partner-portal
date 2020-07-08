<template lang="html">
  <documentsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="request-refund--section">
      <el-button size="mini" class="request-refund-btn" @click="openRefundDialog()">
        Request refund
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
              View
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
              <i class="el-icon-upload"></i>
              <div v-if="Object.keys(refundImageData).length > 0">Change</div>
              <div v-else>Drop file here or <em>click to upload</em></div>
            </el-upload>
            <div v-if="Object.keys(refundImageData).length > 0">
              <span class="reward-upload-label">
                Document uploaded successfully .
              </span>
            </div>
          </div>
        </div>
        <div class="main-dialog">
          <div class="request-refund-inputs">
            <p>
              Description
            </p>
            <input type="text" class="request_refund-inputs" />
          </div>
          <div class="request-refund-inputs">
            <p>
              Order number
            </p>
            <input type="text" class="request_refund-inputs" />
          </div>
          <div class="request-refund-inputs">
            <p>
              Refund amount
            </p>
            <input type="text" class="request_refund-inputs" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()" class="cancel-refund">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="confirm-refund">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="View Refund Request" :visible.sync="refundRequest" width="50%" :before-close="handleClose">
      <div class="inner-dialog">
        <div class="drag-image">
          <div class="download-refund-img">
            <img class="refund-documents" src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg" alt="" />
          </div>
        </div>
        <div class="main-dialog">
          <div class="request-refund-inputs">
            <p class="request-refund-label">
              Description
            </p>
            <p class="refund-text">{{ requestViewData.description }}</p>
          </div>
          <div class="request-refund-inputs">
            <p class="request-refund-label">
              Order number
            </p>
            <p class="refund-text">{{ requestViewData.order_no }}</p>
          </div>
          <div class="request-refund-inputs">
            <p class="request-refund-label">
              Refund amount
            </p>
            <p class="refund-text">Ksh {{ requestViewData.amount }}</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()" class="cancel-refund">Back</el-button>
      </span>
    </el-dialog>
  </div></template>

<script>
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';

export default {
  name: 'refunds',
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
      dialogVisible: false,
      dialogImageUrl: '',
      imageDialogVisible: false,
      refundRequest: false,
      requestViewData: {},
      refundImageData: {},
      refundsData: [
        {
          id: 1,
          rider_id: 1,
          name: 'James Doe',
          vendor_type: 1,
          phone_no: '0729464402',
          description: 'Kitui delivery fee',
          order_no: 'ADDF4U4U4U44I',
          amount: 1200,
          documents: ['https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593766051139.jpg', 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593769844106.jpg'],
          status: 0,
          date: '2020-07-03 00:00:00',
        },
        {
          id: 2,
          rider_id: 1,
          name: 'James Doe',
          vendor_type: 1,
          phone_no: '0729464402',
          description: 'Kitui delivery fee',
          order_no: 'ADDF4U4U4U44I',
          amount: 1200,
          documents: ['https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593766051139.jpg', 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593769844106.jpg'],
          status: 1,
          date: '2020-07-03 00:00:00',
        },
        {
          id: 3,
          rider_id: 1,
          name: 'James Doe',
          vendor_type: 1,
          phone_no: '0729464402',
          description: 'Kitui delivery fee',
          order_no: 'ADDF4U4U4U44I',
          amount: 1200,
          documents: ['https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593766051139.jpg', 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/refund_requests/1/1593769844106.jpg'],
          status: 2,
          date: '2020-07-03 00:00:00',
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.getRefundsData();
    }, 5000);
  },
  methods: {
    getRefundsData() {
      this.show_loading = false;
    },
    checkStatus(value) {
      let status = '';
      if (value === 0) {
        status = 'Pending';
      } else if (value === 1) {
        status = 'Approved';
      } else {
        status = 'Declined';
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
      this.$confirm('Are you sure to close this dialog?')
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
      console.log('file', file);
    },
    closeDialog() {
      this.refundRequest = false;
      this.dialogVisible = false;
      this.refundImageData = {};
      this.requestViewData = {};
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

<style>
@import '../assets/css/performance_section.css?v=1';
</style>
