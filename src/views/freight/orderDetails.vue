<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab">
      <div class="truckflow__container-outer">
        <div class="partner-order-container" :class="'row-' + data.id" v-if="Object.keys(data).length > 0">
          <div class="map-details--go-back-freight" @click="$router.push('/freight/orders')">
            <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
            <span class="map-details-go-back--span">Back</span>
          </div>
          <div colspan="8" class="expanded-row-freight">
            <div class="map__column-freight">
              <img :src="createStaticMapUrl(data)" class="map-freight" />
            </div>
            <div class="order__column-freight">
              <div class="map-details-row">
                <p class="map__details-pickup heading-freight uppercase">pickup location</p>
                <p class="map__details-pickup par">{{ data.pickup }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-dest heading-freight uppercase">destination</p>
                <p class="map__details-dest par">{{ data.destination }}</p>
              </div>
              <div class="map-details-row">
                <p class="order__amount heading-freight uppercase">order amount</p>
                <p class="order__amount par">{{ data.currency }} {{ currencyFormat() }}</p>
              </div>
            </div>
            <div class="order__column-freight">
              <div class="map-details-row">
                <p class="map__details-distance heading-freight uppercase">client</p>
                <p class="map__details-distance par">{{ data.client }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">pickup time</p>
                <p class="map__details-date par">{{ timeFormat() }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">type of truck needed</p>
                <p class="map__details-date par">{{ data.truck }}</p>
              </div>
            </div>
            <div class="order__column-freight">
              <div class="map-details-row">
                <p class="map__details-distance heading-freight uppercase">weight of the load</p>
                <p class="map__details-distance par">{{ data.load_weight }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">type of load</p>
                <p class="map__details-date par">{{ data.load_type }}</p>
              </div>
            </div>
          </div>
          <div class="partner-documents-container">
            <p class="partner-documents-upload-title">Documents</p>
            <button class="partner-documents-upload-button" @click="$modal.show('upload-documents')">Upload document</button>
            <div class="partner-documents-upload-rows" v-if="data.documents.length > 0">
              <span class="partner-documents-upload-header partner-documents-third-row">Type of document</span>
              <span class="partner-documents-upload-header partner-documents-third-row">Date</span>
              <span class="partner-documents-upload-header partner-documents-third-row">Actions</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Status</span>
            </div>
            <div class="partner-documents-upload-rows" v-for="(document, index) in data.documents" :key="index">
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ document.name }}</span>
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ document.date_uploaded }}</span>
              <span class="partner-documents-upload-columns partner-documents-third-row partner-document-view-trigger" @click="showPreview(document.document_url)">View document ></span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row" v-if="document.approval_status === 'Pending'">
                <button class="partner-documents-approve-button">Approve</button>
                <button class="partner-documents-decline-button" @click="$modal.show('reject-documents')">Decline</button>
              </span>
              <span v-else class="partner-documents-upload-columns partner-documents-fourth-row">{{ document.approval_status }}<br /><span class="reject-documents-reason">{{ document.approval_status === 'Declined' ? `Reason: ${document.reason}` : '' }}</span></span>
            </div>
            <div class="partner-documents-upload-empty" v-if="data.documents.length === 0">
              No uploaded documents at the time
            </div>
          </div>
          <div class="partner-documents-container">
            <p class="partner-documents-upload-title">Auxillary Services</p>
            <div>
              <button :class="requestStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="$modal.show('request-fuel-advance')">Request fuel advance</button>
              <button :class="requestStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="$modal.show('request-cash-advance')">Request cash advance</button>
            </div>
            <div class="partner-documents-upload-rows" v-if="data.advances.length > 0">
              <span class="partner-documents-upload-header partner-documents-fourth-row">Type of request</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Amount</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Details</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Status</span>
            </div>
            <div class="partner-documents-upload-rows" v-for="(advance, index) in data.advances" :key="index">
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.type }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.currency }} {{ advance.amount }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row" v-if="advance.type === 'Fuel'">{{ advance.station_name }}({{ advance.station_address }}) <br />{{ advance.fuel_type }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row" v-else></span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.status }}</span>
            </div>
            <div class="partner-documents-upload-empty" v-if="data.advances.length === 0">
              No fuel and cash advance request at the moment
            </div>
          </div>
          <modal name="upload-documents" :height="500" :width="400" transition="slide" :pivot-y="0.5">
            <div class="upload-documents-modal">
              <div class="upload-documents-modal-top-row">
                <p class="upload-documents-modal-top-row-title">Upload document</p>
                <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('upload-documents')"></i>
              </div>
              <p class="upload-documents-modal-top-input-labels">Select type of document</p>
              <select name="" id="" class="upload-documents-modal-top-inputs" v-model="documentType">
                <option v-for="(document, index) in documents" :key="index" :value="document.name">
                  {{ document.name }}
                </option>
              </select>
              <p v-if="documentType === 'Other'" class="upload-documents-modal-top-input-labels">Name of the document</p>
              <input type="text" class="upload-documents-modal-top-inputs" v-if="documentType === 'Other'" v-model="documentName">
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
              <button :class="uploadStatus && !uploadProgress ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button" @click="triggerUpload()">
                <i class="el-icon-loading" v-if="uploadProgress"></i>
                Upload document
              </button>
            </div>
          </modal>
          <modal name="request-fuel-advance" :height="500" :width="400" transition="slide" :pivot-y="0.5">
            <div class="upload-documents-modal">
              <div class="upload-documents-modal-top-row">
                <p class="upload-documents-modal-top-row-title">Request fuel payment</p>
                <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('request-fuel-advance')"></i>
              </div>
              <div>
                <p class="request-advance-input-labels">Enter amount</p>
                <el-input
                  type="text"
                  class="request-advance-inputs"
                  v-model="amount"
                  onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
                >
                  <template class="pricing-prepend" slot="prepend">
                    {{ data.currency }}
                  </template>
                </el-input>
              </div>
              <div>
                <p class="request-advance-input-labels">Choose fueling Station</p>
                <el-select
                  class="request-advance-inputs"
                  v-model="station"
                  name="" id="fuel-station"
                >
                  <el-option
                    :value="station.station_name"
                    v-for="(station, index) in stations"
                    :key="index"
                    :label="station.station_name"
                  >{{ station.station_name }}</el-option>
                </el-select>
              </div>
              <div>
                <p class="request-advance-input-labels">Station address</p>
                <el-select
                  class="request-advance-inputs"
                  v-model="address"
                  name=""
                  id="station-address"
                >
                  <el-option
                    :value="address.id"
                    v-for="(address, index) in addresses"
                    :key="index"
                    :label="address.name"
                  >{{ address.name }}</el-option>
                </el-select>
              </div>
              <div>
                <p class="request-advance-input-labels">Fuel type</p>
                <el-select
                  class="request-advance-inputs"
                  v-model="fuel"
                  name=""
                  id="fuel-type"
                >
                  <el-option
                    :value="fuel.id"
                    v-for="(fuel, index) in fuel_types"
                    :key="index"
                    :label="fuel.name"
                  >{{ fuel.name }}</el-option>
                </el-select>
              </div>
              <button :class="sendStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button">Request fuel advance</button>
            </div>
          </modal>
          <modal name="request-cash-advance" :height="250" :width="400" transition="slide" :pivot-y="0.5">
            <div class="upload-documents-modal">
              <div class="upload-documents-modal-top-row">
                <p class="upload-documents-modal-top-row-title">Request advance cash payment</p>
                <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('request-cash-advance')"></i>
              </div>
              <div>
                <p class="request-advance-input-labels">Enter amount</p>
                <el-input
                  type="text"
                  class="request-advance-inputs"
                  v-model="amount"
                  onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
                >
                  <template class="pricing-prepend" slot="prepend">
                    {{ data.currency }}
                  </template>
                </el-input>
              </div>
              <button :class="sendStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button">Request cash advance</button>
            </div>
          </modal>
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
            <textarea name="" id="" cols="30" rows="10" placeholder="Please write a reason why you want to decline this document" class="reject-documents-textarea"></textarea>
            <div class="reject-documents-buttons">
              <button class="partner-documents-approve-button">Decline</button>
              <button class="partner-documents-decline-button" @click="$modal.hide('reject-documents')">Cancel</button>
            </div>
            </div>
          </modal>
        </div>
      </div>
    </div>
    <notify />
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import S3 from 'aws-s3';
import 'file-viewer';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';

let s3 = '';

export default {
  title: 'Partner Portal - My Orders',
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
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      errorObj: '',
      data: {},
      documents: [
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
      documentName: '',
      uploadFileName: '',
      uploadStatus: false,
      uploadProgress: false,
      requestStatus: true,
      sendStatus: false,
      documentPreview: '',
      fuel_types: [],
      addresses: [],
      stations: [],
      amount: '',
      station: '',
      fuel: '',
      address: '',
    };
  },
  computed: {},
  watch: {
    station(val) {
      if (val !== '') {
        this.getStationAddresses(val);
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchOrders();
      this.getFuelStations();
      this.getFuelTypes();
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
    createStaticMapUrl(path) {
      const google_key = process.env.GOOGLE_API_KEY;
      const from_cordinates = path.pickup_coordinates;
      const to_cordinates = path.destination_coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=300x250&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    timeFormat() {
      const orderTime = this.data.pickup_date;
      return this.formatedTime(orderTime);
    },
    currencyFormat(id) {
      const amount = this.data.price;
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
    },
    showPreview(url) {
      this.$modal.show('preview-documents');
      this.documentPreview = url;
    },
    activateUpload() {
      const files = document.getElementById('upload-doc')['files'];
      if (!files.length) {
        this.uploadStatus = false;
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      this.uploadStatus = true;
      const file = files[0];
      this.uploadFileName = file.name;
    },
    triggerUpload() {
      const files = document.getElementById('upload-doc')['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      this.uploadProgress = true;
      const file = files[0];
      const fileType = files[0]['type'];
      const fileName = this.sanitizeFilename(file.name, this.documentType === 'Other' ? this.documentName.replace(/ /g, '-') : this.documentType.replace(/ /g, '-'));
      const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
      const photoKey = albumPhotosKey + fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          document.getElementById('upload-doc').value = '';
          this.uploadProgress = false;
          if (err) {
            this.notify(3, 0, `There was an error uploading your photo: ${err.message}`);
          } else {
            this.notify(3, 1, 'Successfully uploaded document.');
            this.uploadStatus = false;
            this.uploadFileName = '';
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    getStationAddresses(station) {
      this.addresses = this.stations.find(stn => (
          stn.station_name === station
        )).station_addresses;
    },
    getFuelStations() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-stations?country_code=${this.sessionInfo.country_code.toLowerCase()}`, this.config)
            .then(response => {
              if (response.status === 200) {
                this.stations = response.data.data;
              }
            resolve(response);
            })
            .catch(error => {
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    getFuelTypes() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-types`, this.config)
            .then(response => {
              if (response.status === 200) {
                this.fuel_types = response.data.data;
              }
            resolve(response);
            })
            .catch(error => {
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
      document.getElementById(id).click();
    },
    fetchOrders() {
      const orderData = this.$store.getters.getFreightOrders.filter(obj => obj.order_no === this.$route.params.order);
      if (orderData.length > 0) {
        this.data = orderData[0];
      } else {
        this.$router.push('/freight/orders');
      }
      this.loadingStatus = false;
    },
  },
};
</script>

<style>
.capitalize-text {
  text-transform: capitalize;
}
</style>
