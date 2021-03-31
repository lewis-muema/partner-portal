<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="freight-dashboard-empty-row" v-if="!loadingStatus && timeline.length === 0">
      <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/partner_portal/images/log.png" class="freight-log-img" alt="log">
      <div>{{ $t('freightDashboard.no_documents') }}</div>
    </div>
    <div class="freight-dashboard" v-else>
      <div class="freight-dashboard-top-row">
        <p class="freight-dashboard-title">{{ $t('freightDashboard.recent_activity') }}</p>
      </div>
      <div class="loading" v-if="loadingStatus && timeline.length === 0"></div>
      <div class="freight-dashboard-row freight-dashboard-timeline-rows" v-for="(time, index) in timeline" :key="index">
        <p>{{ time.message }}</p>
        <p @click="showDocument(time.data.url)" v-if="time.actionable" class="freight-dashboard-links">{{ $t('freightDashboard.view_document') }} <i class="el-icon-arrow-right"></i></p>
        <p @click="showOrder(time.data.order_id)" class="freight-dashboard-links" v-else>{{ $t('freightDashboard.view_order') }} <i class="el-icon-arrow-right"></i></p>
        <div v-if="time.actionable && time.data.created_by !== 'OWNER'" class="freight-dashboard-buttons">
          <button class="partner-documents-approve-button" @click="approve(time.data, 2)">{{ $t('freightDashboard.approve') }}</button>
          <button class="partner-documents-decline-button" @click="decline(time.data, 3)">{{ $t('freightDashboard.reject') }}</button>
        </div>
        <p class="freight-dashboard-time">{{ formatTime(time.date_time) }}</p>
      </div>
    </div>
    <modal name="preview-documents" :height="600" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">{{ $t('freightDashboard.preview_document') }}</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('preview-documents')"></i>
        </div>
      <iframe :src="documentPreview" width="100%" height="100%" title="Document preview"></iframe>
      </div>
    </modal>
    <modal name="reject-documents" :height="350" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">{{ $t('freightDashboard.decline_document') }}</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('reject-documents')"></i>
        </div>
      <textarea name="" id="" cols="30" rows="10" placeholder="Please write a reason why you want to decline this document" class="reject-documents-textarea" v-model="declineReason"></textarea>
      <div class="reject-documents-buttons">
        <button class="partner-documents-approve-button" @click="actionDocument()">{{ $t('freightDashboard.decline') }}</button>
        <button class="partner-documents-decline-button" @click="$modal.hide('reject-documents')">{{ $t('freightDashboard.cancel') }}</button>
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
      loaderMessage: this.$t('freightDashboard.no_logs'),
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
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/activity_log/${this.sessionInfo.id}/2`, this.config)
          .then(response => {
            this.timeline = response.data.data;
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
        document_id: this.document.document_id,
        transporter_id: this.sessionInfo.id,
        status: this.status === 2 ? 1 : -1,
      };
      if (this.status === 3) {
        payload.reason = this.declineReason;
      }
      return new Promise((resolve, reject) => {
        axios
          .put(`${this.auth}freight-service/shipments/quotations/documents/${this.status === 3 ? 'decline' : 'approve'}`, payload, this.config)
          .then(response => {
            this.notify(3, 1, `${this.$t('freightDashboard.successfully')} ${this.status === 3 ? this.$t('freightDashboard.rejected') : this.$t('freightDashboard.approved')} ${this.$t('freightDashboard.document')}.`);
            this.$modal.hide('reject-documents');
            this.declineReason = '';
            this.document = '';
            this.status = '';
            this.fetchTimeline();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `${this.$t('freightDashboard.error')} ${this.status === 3 ? this.$t('freightDashboard.rejecting') : this.$t('freightDashboard.approving')} ${this.$t('freightDashboard.the_document')}: ${error.response.data.reason}`);
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
