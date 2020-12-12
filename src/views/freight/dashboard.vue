<template>
  <div class="freight-dashboard">
    <div class="freight-dashboard-top-row">
      <p class="freight-dashboard-title">Recent activity</p>
    </div>
    <div class="freight-dashboard-row freight-dashboard-timeline-rows" v-for="(time, index) in timeline" :key="index">
      <p>{{ time.action }}</p>
      <p @click="showDocument(time.document_url)" v-if="time.status === 'pending'" class="freight-dashboard-links">View document <i class="el-icon-arrow-right"></i></p>
      <p @click="showOrder(time.order)" class="freight-dashboard-links" v-else>View order <i class="el-icon-arrow-right"></i></p>
      <div v-if="time.status === 'pending'" class="freight-dashboard-buttons">
        <button class="partner-documents-approve-button">Approve</button>
        <button class="partner-documents-decline-button">Reject</button>
      </div>
      <p class="freight-dashboard-time">{{ formatTime(time.date_time) }}</p>
    </div>
    <div class="freight-dashboard-empty-row" v-if="timeline.length === 0">
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
  </div>
</template>

<script>
import timezone from '../../mixins/timezone';

export default {
  mixins: [timezone],
  data() {
    return {
      timeline: [],
      documentPreview: '',
    };
  },
  created() {
    this.fetchTimeline();
  },
  methods: {
    fetchTimeline() {
      this.timeline = [
        {
          action: 'Copia Limited has sent you a terms of engament document for your approval',
          date_time: '2020-12-10T09:00:00.000Z',
          order: 'AEX12FG34-S23',
          status: 'pending',
          document_url: 'https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/freight_docs/Signed-goods-received-note_3_1607596577906.pdf',
        },
        {
          action: 'Your fuel advance request for the order from Mombasa to Kisumu has been approved',
          date_time: '2020-12-10T13:00:00.000Z',
          order: 'AEX12FG34-S24',
          status: 'approved',
        },
        {
          action: 'Your terms of engagement document for the order from Nairobi to Kisumu has been declined',
          date_time: '2020-12-10T15:00:00.000Z',
          order: 'AEX12FG34-S23',
          status: 'declined',
        },
        {
          action: 'Your terms of engagement document for the order from Nairobi to Kisumu has been declined',
          date_time: '2020-12-05T10:00:00.000Z',
          order: 'AEX12FG34-S26',
          status: 'declined',
        },
      ];
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
  },
};
</script>

<style>

</style>
