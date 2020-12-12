<template>
  <div>
    <p class="order-creation-title">Create Order</p>
    <div>
      <p class="request-advance-input-labels">Pick up location</p>
      <gmap-autocomplete
        id="pickup"
        :options="map_options"
        placeholder="Enter a pickup location"
        :select-first-on-enter="true"
        class="request-advance-inputs order-creation-location-inputs"
        @place_changed="setLocation($event, 0)"
      />
    </div>
    <div>
      <p class="request-advance-input-labels">Destination</p>
      <gmap-autocomplete
        id="destination"
        :options="map_options"
        placeholder="Enter a pickup location"
        :select-first-on-enter="true"
        class="request-advance-inputs order-creation-location-inputs"
        @place_changed="setLocation($event, 1)"
      />
    </div>
    <div>
      <p class="request-advance-input-labels">Pick up time for your order</p>
      <el-date-picker
        v-model="schedule_time"
        class="request-advance-inputs"
        type="datetime"
        format="dd-MM-yyyy h:mm a"
        placeholder="As soon as possible"
        prefix-icon="el-icon-date"
        :default-time="default_value"
        :picker-options="dueDatePickerOptions"
        @change="dispatchScheduleTime"
      />
    </div>
    <div>
      <p class="request-advance-input-labels">What is the weight of the load</p>
      <el-input
        type="text"
        class="request-advance-inputs"
        v-model="weight"
        onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
      >
        <template class="pricing-prepend" slot="append">
          Tonnes
        </template>
      </el-input>
    </div>
    <div>
      <p class="request-advance-input-labels">What is the cost for this order?</p>
      <el-input
        type="text"
        class="request-advance-inputs"
        v-model="amount"
        onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
      >
        <template class="pricing-prepend" slot="prepend">
          {{ sessionInfo.default_currency }}
        </template>
      </el-input>
    </div>
    <div>
      <p class="request-advance-input-labels">Select the transporter to assign this order</p>
      <el-input
        type="text"
        class="request-advance-inputs"
        v-model="transporter"
      >
      </el-input>
    </div>
    <div>
      <p class="request-advance-input-labels">Will the container be returned?</p>
      <el-select
        name=""
        id=""
        class="request-advance-inputs"
        v-model="containerReturn"
      >
        <el-option value="Yes">Yes</el-option>
        <el-option value="No">No</el-option>
      </el-select>
    </div>
    <div>
      <p class="request-advance-input-labels">Upload the terms of the delivery</p>
      <div class="partner-upload-module" @click="transfer('upload-terms-doc')" v-if="documents[0].percentage === 0">
        <p class="upload-documents-modal-click-text"><i class="el-icon-upload upload-documents-modal-click-icon"></i> Upload document</p>
      </div>
      <input
        type="file"
        name
        value
        class="form-control"
        placeholder="Log Book"
        accept="application/pdf"
        style="display:none;"
        id="upload-terms-doc"
        @change="triggerUpload('terms of delivery', 'upload-terms-doc', 0)"
      />
      <div class="order-creation-porgress" v-if="documents[0].percentage > 0">
        <div>
          <i class="fa fa-file-pdf pdf-icon"></i>
        </div>
        <div class="order-creation-progress-section">
          <div class="order-creation-progress-title">{{ documentName('upload-terms-doc') }}<i class="el-icon-close upload-cancel" @click="cancelUpload('terms of delivery', 'upload-terms-doc', 0)"></i></div>
          <div><progress class="order-creation-progress-bar" id="file" :value="documents[0].percentage" max="100"></progress></div>
        </div>
      </div>
    </div>
    <div>
      <p class="request-advance-input-labels">Upload the bill of lading</p>
      <div class="partner-upload-module" @click="transfer('upload-bill-doc')" v-if="documents[1].percentage === 0">
        <p class="upload-documents-modal-click-text"><i class="el-icon-upload upload-documents-modal-click-icon"></i> Upload document</p>
      </div>
      <input
        type="file"
        name
        value
        class="form-control"
        placeholder="Log Book"
        accept="application/pdf"
        style="display:none;"
        id="upload-bill-doc"
        @change="triggerUpload('bill of lading', 'upload-bill-doc', 1)"
      />
      <div class="order-creation-porgress" v-if="documents[1].percentage > 0">
        <div>
          <i class="fa fa-file-pdf pdf-icon"></i>
        </div>
        <div class="order-creation-progress-section">
          <div class="order-creation-progress-title">{{ documentName('upload-bill-doc') }}<i class="el-icon-close upload-cancel" @click="cancelUpload('bill of lading', 'upload-bill-doc', 1)"></i></div>
          <div><progress class="order-creation-progress-bar" id="file" :value="documents[1].percentage" max="100"></progress></div>
        </div>
      </div>
    </div>
    <div v-for="(doc, index) in documents" :key="index">
      <div v-if="index > 1">
        <p class="request-advance-input-labels">Upload {{ doc.name }}</p>
        <div class="order-creation-porgress" v-if="doc.percentage > 0">
          <div>
            <i class="fa fa-file-pdf pdf-icon"></i>
          </div>
          <div class="order-creation-progress-section">
            <div class="order-creation-progress-title">{{ doc.document_name }}<i class="el-icon-close upload-cancel" @click="cancelCustomUpload(index)"></i></div>
            <div><progress class="order-creation-progress-bar" id="file" :value="doc.percentage" max="100"></progress></div>
          </div>
        </div>
      </div>
    </div>
    <div class="upload-documents-add-trigger" @click="$modal.show('upload-documents')">
      <i class="el-icon-circle-plus upload-documents-add-trigger-icon" @click="$modal.hide('upload-documents')"></i> Add document
    </div>
    <modal name="upload-documents" :height="400" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Upload document</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('upload-documents')"></i>
        </div>
        <p class="upload-documents-modal-top-input-labels">Select type of document</p>
        <select name="" id="" class="upload-documents-modal-top-inputs" v-model="documentType">
          <option v-for="(document, index) in uploadDocuments" :key="index" :value="document.name">
            {{ document.name }}
          </option>
        </select>
        <p v-if="documentType === 'Other'" class="upload-documents-modal-top-input-labels">Name of the document</p>
        <input type="text" class="upload-documents-modal-top-inputs" v-if="documentType === 'Other'" v-model="documentTitle">
        <p class="upload-documents-modal-top-input-labels">Upload document</p>
        <div class="partner-upload-module" @click="transfer('upload-doc')">
          <p class="upload-documents-modal-click-text" v-if="!uploadStatus"><i class="el-icon-upload upload-documents-modal-click-icon"></i> Upload document</p>
          <p class="upload-documents-modal-click-text" v-else>File selected: {{ uploadFileName }}</p>
        </div>
        <input
          type="file"
          name
          value
          class="form-control"
          placeholder="Log Book"
          accept="application/pdf"
          style="display:none;"
          id="upload-doc"
          @change="activateUpload()"
        />
      </div>
    </modal>
    <div>
      <button class="order-creation-button" :class="submitStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="submitRequest">
        Create order
      </button>
    </div>
    <notify />
  </div>
</template>

<script>
import moment from 'moment';
import notify from '../../components/notification';

let s3 = '';
let interval = '';

export default {
  components: {
    notify,
  },
  data() {
    return {
      amount: '',
      pickup: '',
      destination: '',
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      schedule_time: '',
      default_value: moment().format('HH:mm:ss'),
      containerReturn: '',
      transporter: '',
      weight: '',
      documents: [{
        id: 'upload-terms-doc',
        percentage: 0,
      },
      {
        id: 'upload-bill-doc',
        percentage: 0,
      }],
      submitStatus: true,
      map_options: {
        componentRestrictions: {
          country: ['ke', 'ug', 'tz'],
        },
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
      uploadDocuments: [
        {
          name: 'Invoice',
          id: 1,
        },
        {
          name: 'Signed goods received note',
          id: 2,
        },
        {
          name: 'Signed client’s delivery note',
          id: 3,
        },
        {
          name: 'Original interchange',
          id: 4,
        },
        {
          name: 'Other',
          id: 5,
        },
      ],
      documentType: 'Invoice',
      documentTitle: '',
      uploadFileName: '',
      uploadStatus: false,
    };
  },
  computed: {
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
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
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    setLocation(evt, index) {
      console.log(evt);
    },
    dispatchScheduleTime(evt) {
      console.log(evt);
    },
    documentName(id) {
      const files = document.getElementById(id) ? document.getElementById(id)['files'] : [];
      if (files.length) {
        const file = files[0];
        return file.name;
      }
      return '';
    },
    activateUpload() {
      const files = document.getElementById('upload-doc')['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      const file = files[0];
      const fileType = files[0]['type'];
      const title = this.documentType === 'Other' ? this.documentTitle : this.documentType;
      const fileName = this.sanitizeFilename(file.name, title.replace(/ /g, '-'));
      const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
      const photoKey = albumPhotosKey + fileName;
      this.documents.push({
        id: 'upload-doc',
        name: this.documentType === 'Other' ? this.documentTitle : this.documentType,
        percentage: 0,
        document_name: file.name,
        upload_document_name: fileName,
        document_url: photoKey,
      });
      this.$modal.hide('upload-documents');
      const index = this.documents.length - 1;
      interval = setInterval(() => {
        this.documents.forEach((row, i) => {
          if (index === i) {
            row.percentage = row.percentage <= 99 ? row.percentage += 1 : 99;
          }
        });
      }, 100);
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          clearInterval(interval);
          if (this.documents[index]) {
            if (err) {
              this.notify(3, 0, `There was an error uploading your photo: ${err.message}`);
              this.documents[index].percentage = 0;
            } else {
              this.notify(3, 1, 'Successfully uploaded document.');
              this.documents[index].percentage = 100;
              this.documentTitle = '';
            }
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    triggerUpload(type, id, index) {
      const files = document.getElementById(id)['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      interval = setInterval(() => {
        this.documents.forEach((row, i) => {
          if (index === i) {
            row.percentage = row.percentage <= 99 ? row.percentage += 1 : 99;
          }
        });
      }, 100);
      const file = files[0];
      const fileType = files[0]['type'];
      const fileName = this.sanitizeFilename(file.name, type.replace(/ /g, '-'));
      const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
      const photoKey = albumPhotosKey + fileName;
      this.documents[index].document_name = file.name;
      this.documents[index].document_url = photoKey;
      this.documents[index].name = type;
      this.documents[index].upload_document_name = fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          clearInterval(interval);
          if (this.documentName(id)) {
            if (err) {
              this.notify(3, 0, `There was an error uploading your photo: ${err.message}`);
              this.documents[index].percentage = 0;
            } else {
              this.notify(3, 1, 'Successfully uploaded document.');
              this.documents[index].percentage = 100;
            }
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    cancelUpload(type, id, index) {
      document.getElementById(id).value = '';
      this.documents[index].percentage = 0;
      clearInterval(interval);
    },
    cancelCustomUpload(index) {
      this.documents.splice(index, 1);
    },
    submitRequest() {
      const activeDocuments = [];
      this.documents.forEach(row => {
        if (row.percentage > 0) {
          activeDocuments.push(row);
        }
      });
      console.log(activeDocuments);
    },
    sanitizeFilename(name, type) {
      const temp_name = `${type}_${this.sessionInfo.id}_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
    transfer(id) {
      if ((this.documentTitle && this.documentType === 'Other') || this.documentType !== 'Other' || id === 'upload-terms-doc' || id === 'upload-bill-doc') {
        document.getElementById(id).click();
      } else {
        this.notify(3, 0, 'Please enter the name of the document');
      }
    },
  },
};
</script>

<style>

</style>
