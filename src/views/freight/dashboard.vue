<template>
  <div class="freight-dashboard">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="freight-dashboard-top-row">
      <p class="freight-dashboard-title">Recent activity</p>
    </div>
    <div class="loading" v-if="loadingStatus && timeline.length === 0"></div>
    <div class="freight-dashboard-row freight-dashboard-timeline-rows" v-for="(time, index) in timeline" :key="index">
      <p>{{ time.message }}</p>
      <p @click="showDocument(time.data.url)" v-if="time.actionable" class="freight-dashboard-links">View document <i class="el-icon-arrow-right"></i></p>
      <p @click="showOrder(time.data.order_id)" class="freight-dashboard-links" v-else>View order <i class="el-icon-arrow-right"></i></p>
      <div v-if="time.actionable" class="freight-dashboard-buttons">
        <button class="partner-documents-approve-button" @click="approve(time.data, 2)">Approve</button>
        <button class="partner-documents-decline-button" @click="decline(time.data, 3)">Reject</button>
      </div>
      <p class="freight-dashboard-time">{{ formatTime(time.date_time) }}</p>
    </div>
    <div class="freight-dashboard-empty-row" v-if="!loadingStatus && timeline.length === 0">
      There are no documents on your timeline
    </div>
    <modal name="preview-documents" :height="600" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Preview document</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('preview-documents')"></i>
        </div>
      <iframe :src="documentPreview" width="100%" height="100%" title="Document preview"></iframe>
      </div>
    </modal>
    <modal name="reject-documents" :height="350" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Decline document</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('reject-documents')"></i>
        </div>
      <textarea name="" id="" cols="30" rows="10" placeholder="Please write a reason why you want to decline this document" class="reject-documents-textarea" v-model="declineReason"></textarea>
      <div class="reject-documents-buttons">
        <button class="partner-documents-approve-button" @click="actionDocument()">Decline</button>
        <button class="partner-documents-decline-button" @click="$modal.hide('reject-documents')">Cancel</button>
      </div>
      </div>
    </modal>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';

export default {
  title: 'Partner Portal - Freight Dashboard',
  components: {
    verifier,
    errorHandler,
    notify,
  },
  mixins: [timezone],
  data() {
    return {
      auth: process.env.VUE_APP_AUTH,
      loadingStatus: true,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      errorObj: '',
      timeline: [],
      documentPreview: '',
      loaderMessage: 'There are no logs',
      declineReason: '',
      document: '',
      status: '',
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchTimeline();
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    fetchTimeline() {
      const payload = {
        user_id: parseInt(this.sessionInfo.id, 10),
        user_type: 2,
      };
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}orders/v2/freight/activity_log`, payload, this.config)
          .then(response => {
            this.timeline = response.data.log;
            this.loadingStatus = false;
            resolve(response);
          })
          .catch(error => {
            this.timeline = [];
            this.loadingStatus = false;
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    showDocument(url) {
      this.documentPreview = url;
      this.$modal.show('preview-documents');
    },
    showOrder(order) {
      this.$router.push(`/freight/orders/${order}`);
    },
    formatTime(time) {
      return this.dashboardTimer(time);
    },
    approve(data, status) {
      this.document = data;
      this.status = status;
      this.actionDocument();
    },
    decline(data, status) {
      this.document = data;
      this.status = status;
      this.$modal.show('reject-documents');
    },
    actionDocument() {
      const payload = {
        order_id: this.document.order_id,
        document_id: this.document.document_id,
        owner_id: parseInt(this.sessionInfo.id, 10),
        created_by: 2,
        status: this.status,
      };
      if (this.status === 3) {
        payload.reason = this.declineReason;
      }
      return new Promise((resolve, reject) => {
        axios
          .patch(`${this.auth}orders/v2/freight/order/documents`, payload, this.config)
          .then(response => {
            this.notify(3, 1, `Successfully ${this.status === 3 ? 'rejected' : 'approved'} document.`);
            this.$modal.hide('reject-documents');
            this.declineReason = '';
            this.document = '';
            this.status = '';
            this.fetchTimeline();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `There was an error ${this.status === 3 ? 'rejecting' : 'approving'} the document: ${error.response.data.reason}`);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
  },
};
</script>

<style>

</style>
