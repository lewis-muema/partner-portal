<template>
  <div>
    <p class="order-creation-title">Place Order</p>
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
      <p class="request-advance-input-labels">Select the client to assign this order</p>
      <clientSearch :type="'biz'" />
    </div>
    <div>
      <p class="request-advance-input-labels">Select the carrier type</p>
      <el-select
        name=""
        id="request-advance-input-carrier"
        class="request-advance-inputs"
        v-model="carrier"
      >
        <el-option v-for="(carrier, index) in carrierTypes" :key="index" :value="carrier.id" :label="carrier.carrier_type"></el-option>
      </el-select>
    </div>
    <div>
      <p class="request-advance-input-labels">Will the container be returned?</p>
      <el-select
        name=""
        id="request-advance-input-return"
        class="request-advance-inputs"
        v-model="containerReturn"
      >
        <el-option value="Yes">Yes</el-option>
        <el-option value="No">No</el-option>
      </el-select>
    </div>
    <div>
      <p class="request-advance-input-labels">Upload the {{ documentNameFilter(0) }}</p>
      <div class="partner-upload-module" @click="transfer(documents[0].id)" v-if="documents[0].percentage === 0">
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
        @change="triggerUpload(0)"
      />
      <div class="order-creation-porgress" v-if="documents[0].percentage > 0">
        <div>
          <i class="fa fa-file-pdf pdf-icon"></i>
        </div>
        <div class="order-creation-progress-section">
          <div class="order-creation-progress-title">{{ documentName(documents[0].id) }}<i class="el-icon-close upload-cancel" @click="cancelUpload(0)"></i></div>
          <div><progress class="order-creation-progress-bar" id="file" :value="documents[0].percentage" max="100"></progress></div>
        </div>
      </div>
    </div>
    <div>
      <p class="request-advance-input-labels">Upload the {{ documentNameFilter(1) }}</p>
      <div class="partner-upload-module" @click="transfer(documents[1].id)" v-if="documents[1].percentage === 0">
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
        @change="triggerUpload(1)"
      />
      <div class="order-creation-porgress" v-if="documents[1].percentage > 0">
        <div>
          <i class="fa fa-file-pdf pdf-icon"></i>
        </div>
        <div class="order-creation-progress-section">
          <div class="order-creation-progress-title">{{ documentName(documents[1].id) }}<i class="el-icon-close upload-cancel" @click="cancelUpload(1)"></i></div>
          <div><progress class="order-creation-progress-bar" id="file" :value="documents[1].percentage" max="100"></progress></div>
        </div>
      </div>
    </div>
    <div v-for="(doc, index) in documents" :key="index">
      <div v-if="index > 1">
        <p class="request-advance-input-labels">Upload {{ doc.document_name }}</p>
        <div class="order-creation-porgress" v-if="doc.percentage > 0">
          <div>
            <i class="fa fa-file-pdf pdf-icon"></i>
          </div>
          <div class="order-creation-progress-section">
            <div class="order-creation-progress-title">{{ doc.file_name }}<i class="el-icon-close upload-cancel" @click="cancelCustomUpload(index)"></i></div>
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
          <option v-for="(document, index) in uploadDocuments" :key="index" :value="document.document_name">
            {{ document.document_name }}
          </option>
        </select>
        <p v-if="documentType === 'Other'" class="upload-documents-modal-top-input-labels">Name of the document</p>
        <input type="text" class="upload-documents-modal-top-inputs" v-if="documentType === 'Other'" v-model="documentTitle">
        <p class="upload-documents-modal-top-input-labels">Upload document</p>
        <div class="partner-upload-module" @click="transfer('upload-doc')">
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
          id="upload-doc"
          @change="activateUpload()"
        />
      </div>
    </modal>
    <div>
      <button class="order-creation-button" :class="submitStatus && !uploadProgress ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="submitRequest">
        <i class="el-icon-loading" v-if="uploadProgress"></i>
        Place Order
      </button>
    </div>
    <notify />
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import notify from '../../components/notification';
import clientSearch from './clientSearch';

let s3 = '';
let interval = '';

export default {
  title: 'Partner Portal - Freight Order Creation',
  components: {
    notify,
    clientSearch,
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
      auth: process.env.VUE_APP_AUTH,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      containerReturn: '',
      transporter: '',
      weight: '',
      documents: [{
        id: 'upload-terms-doc',
        percentage: 0,
        document_type: 2,
      },
      {
        id: 'upload-bill-doc',
        percentage: 0,
        document_type: 3,
      }],
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
      intervals: [],
      carrierTypes: [],
      carrier: '',
      uploadDocuments: [],
      documentType: 'Invoice',
      documentId: 4,
      documentTitle: '',
      uploadFileName: '',
      uploadStatus: false,
      uploadProgress: false,
      pickup: {},
      destination: {},
    };
  },
  computed: {
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    submitStatus() {
      return (this.amount && (this.$store.getters.getCopId || this.$store.getters.getUserId) && Object.keys(this.pickup).length > 0 && Object.keys(this.destination).length > 0 && this.schedule_time && this.weight && this.documents[0].percentage === 100 && this.documents[1].percentage === 100 && this.carrier);
    },
  },
  watch: {
    documentType(val) {
      const document = this.uploadDocuments.filter(obj => obj.document_name === val);
      this.documentId = document.length > 0 ? document[0].document_type : 1;
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchCarrierTypes();
      this.fetchDocumentTypes();
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
    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = place.address_components.findIndex(countryCode => countryCode.types.includes('country'));
      const location = {
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        waypoint_details_status: true,
        type: 'coordinates',
        country_code: place.address_components[countryIndex].short_name,
        more: {
          Estate: '',
          FlatName: '',
          place_idcustom: place.place_id ? place.place_id : '',
          Label: '',
          Road: '',
          landmark: '',
          HouseDoor: '',
          Otherdescription: '',
          Typed: '',
          Vicinity: place.vicinity ? place.vicinity : '',
          Address: place.formatted_address ? place.formatted_address : '',
          viewport: {
            northeast: {
              lat: 0,
              lng: 0,
            },
            southwest: {
              lat: 0,
              lng: 0,
            },
          },
        },
      };
      if (index === 0) {
        this.pickup = location;
      } else {
        this.destination = location;
      }
    },
    documentName(id) {
      const files = document.getElementById(id) ? document.getElementById(id)['files'] : [];
      if (files.length) {
        const file = files[0];
        return file.name;
      }
      return '';
    },
    documentNameFilter(index) {
      const document = this.uploadDocuments.filter(obj => obj.document_type === this.documents[index].document_type);
      return this.uploadDocuments.length > 0 ? document[0].document_name : 'document';
    },
    activateUpload() {
      const files = document.getElementById('upload-doc')['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      const file = files[0];
      const fileType = files[0]['type'];
      const title = this.documentId === 1 ? this.documentTitle : this.documentType;
      const fileName = this.sanitizeFilename(file.name, title.replace(/ /g, '-'));
      const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
      const photoKey = albumPhotosKey + fileName;
      this.documents.push({
        id: 'upload-doc',
        document_name: title,
        document_type: this.documentId,
        percentage: 0,
        file_name: file.name,
        upload_document_name: fileName,
        document_url: photoKey,
      });
      this.$modal.hide('upload-documents');
      const index = this.documents.length - 1;
      interval = setInterval(() => {
        this.documents.forEach((row, i) => {
          if (index === i) {
            row.percentage = row.percentage < 100 ? row.percentage += 1 : 100;
          }
        });
      }, 100);
      this.intervals[index] = interval;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          clearInterval(this.intervals[index]);
          if (this.documents[index]) {
            if (err) {
              this.notify(3, 0, `There was an error uploading your document: ${err.message}`);
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
    triggerUpload(index) {
      const files = document.getElementById(this.documents[index].id)['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      interval = setInterval(() => {
        this.documents.forEach((row, i) => {
          if (index === i) {
            row.percentage = row.percentage < 100 ? row.percentage += 1 : 100;
          }
        });
      }, 100);
      this.intervals[index] = interval;
      const file = files[0];
      const fileType = files[0]['type'];
      const fileName = this.sanitizeFilename(file.name, this.documentNameFilter(index).replace(/ /g, '-'));
      const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
      const photoKey = albumPhotosKey + fileName;
      this.documents[index].file_name = file.name;
      this.documents[index].document_url = photoKey;
      this.documents[index].document_name = this.documentNameFilter(index);
      this.documents[index].upload_document_name = fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          clearInterval(this.intervals[index]);
          if (this.documentName(this.documents[index].id)) {
            if (err) {
              this.notify(3, 0, `There was an error uploading your document: ${err.message}`);
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
    cancelUpload(index) {
      document.getElementById(this.documents[index].id).value = '';
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
          activeDocuments.push({
            document_type: row.document_type,
            document_name: row.document_name,
            url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${row.document_url}`,
          });
        }
      });
      const payload = {
        cop_id: this.$store.getters.getCopId ? parseInt(this.$store.getters.getCopId, 10) : null,
        cop_user_id: null,
        peer_id: this.$store.getters.getUserId ? parseInt(this.$store.getters.getUserId, 10) : null,
        owner_id: parseInt(this.sessionInfo.id, 10),
        created_by: 2,
        pick_up: this.pickup,
        destination: this.destination,
        path: [this.pickup, this.destination],
        pick_up_time: moment(this.schedule_time).format('YYYY-MM-DD HH:mm:ss'),
        load_weight: parseInt(this.weight, 10),
        amount: parseInt(this.amount, 10),
        currency: this.sessionInfo.default_currency,
        return: this.containerReturn === 'yes',
        carrier_type: parseInt(this.carrier, 10),
        documents: activeDocuments,
      };
      this.createOrder(payload);
    },
    createOrder(payload) {
      this.uploadProgress = true;
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}orders/v2/freight/order`, payload, this.config)
          .then(response => {
            this.uploadProgress = false;
            this.notify(3, 1, response.data.message);
            this.$store.commit('setCreateOrderStatus', false);
            resolve(response);
          })
          .catch(error => {
            this.uploadProgress = false;
            this.notify(3, 1, error.response.message);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchCarrierTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}/orders/v2/freight/carrier_types`, this.config)
          .then(response => {
            this.carrierTypes = response.data.carrier_types;
            resolve(response);
          })
          .catch(error => {
            this.carrierTypes = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchDocumentTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}/orders/v2/freight/documents`, this.config)
          .then(response => {
            this.uploadDocuments = response.data.documents;
            resolve(response);
          })
          .catch(error => {
            this.uploadDocuments = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
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
