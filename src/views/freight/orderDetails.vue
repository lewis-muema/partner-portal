<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab">
      <div class="loading" v-if="loadingStatus"></div>
      <div class="truckflow__container-outer" v-else>
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
                <p class="map__details-pickup par">{{ data.pickup.name }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-dest heading-freight uppercase">destination</p>
                <p class="map__details-dest par">{{ data.destination.name }}</p>
              </div>
              <div class="map-details-row">
                <p class="order__amount heading-freight uppercase">order amount</p>
                <p class="order__amount par">{{ data.currency }} {{ currencyFormat() }}</p>
              </div>
            </div>
            <div class="order__column-freight">
              <div class="map-details-row">
                <p class="map__details-distance heading-freight uppercase">client</p>
                <p class="map__details-distance par">{{ data.client_name }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">pickup time</p>
                <p class="map__details-date par">{{ timeFormat(data.pick_up_time) }}</p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">type of truck needed</p>
                <p class="map__details-date par">{{ data.carrier_type }}</p>
              </div>
            </div>
            <div class="order__column-freight">
              <div class="map-details-row">
                <p class="map__details-distance heading-freight uppercase">weight of the load</p>
                <p class="map__details-distance par">{{ data.tonnes_per_truck }} Tonnes per truck </p>
              </div>
              <div class="map-details-row">
                <p class="map__details-date heading-freight uppercase">type of load</p>
                <p class="map__details-date par">{{ data.load_type ? data.load_type : 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div class="partner-documents-container">
            <p class="partner-documents-upload-title">Documents</p>
            <button class="partner-documents-upload-button" @click="$modal.show('upload-documents')">Upload document</button>
            <div class="partner-documents-upload-rows" v-if="data.quotation.documents.length">
              <span class="partner-documents-upload-header partner-documents-third-row">Type of document</span>
              <span class="partner-documents-upload-header partner-documents-third-row">Date</span>
              <span class="partner-documents-upload-header partner-documents-third-row">Actions</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Status</span>
            </div>
            <div class="partner-documents-upload-rows" v-for="(document, index) in data.quotation.documents" :key="`${document.document_name}-${index}`">
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ document.document_name }}</span>
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ timeFormat(document.date_created) }}</span>
              <span class="partner-documents-upload-columns partner-documents-third-row partner-document-view-trigger" @click="showPreview(document.document_url)">View document ></span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row" v-if="document.status === 'PENDING' && document.actionable">
                <button class="partner-documents-approve-button" @click="triggerAction(2, document)">Approve</button>
                <button class="partner-documents-decline-button" @click="triggerAction(3, document)">Decline</button>
              </span>
              <span v-else class="partner-documents-upload-columns partner-documents-fourth-row">{{ document.message }}<br /><span class="reject-documents-reason" v-if="document.status === 'DECLINED'">Reason: {{ document.reason }}</span></span>
            </div>
            <div class="partner-documents-upload-empty" v-if="data.quotation.documents.length === 0">
              No uploaded documents at the time
            </div>
          </div>
          <div class="partner-documents-container">
            <p class="partner-documents-upload-title">Auxillary Services</p>
            <div class="request-advances-info">
              <i class="el-icon-info request-advances-info-icon"></i>
              <div>
                <div>To request for <b>fuel advance</b>, the purchase order and bill of lading documents should uploaded and approved by both parties. <br /></div>
                <div>For <b>cash advance</b>, the interchange document (for return container orders), clients delivery notes and invoice documents should be uploaded and approved by both parties.</div>
              </div>
            </div>
            <div>
              <button :class="fuelActiveStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="$modal.show('request-fuel-advance')">Request fuel advance</button>
              <button :class="cashActiveStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" @click="$modal.show('request-cash-advance')">Request cash advance</button>
            </div>
            <div v-if="(data.fuel_advances && data.fuel_advances.length > 0) || (data.cash_advances && data.cash_advances.length > 0)">
            <div class="partner-documents-upload-rows">
              <span class="partner-documents-upload-header partner-documents-fourth-row">Type of request</span>
              <span class="partner-documents-upload-header partner-documents-third-row">Amount</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Details</span>
              <span class="partner-documents-upload-header partner-documents-fourth-row">Status</span>
            </div>
            <div class="partner-documents-upload-rows" v-for="(advance, index) in data.fuel_advances" :key="`fuel-${index}`">
              <span class="partner-documents-upload-columns partner-documents-fourth-row">Fuel</span>
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ data.currency }} {{ advance.amount }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.fuel_station_name }} ({{ advance.fuel_station_address }}) <br />{{ advance.fuel_type }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.status }}</span>
            </div>
            <div class="partner-documents-upload-rows" v-for="(advance, index) in data.cash_advances" :key="`cash-${index}`">
              <span class="partner-documents-upload-columns partner-documents-fourth-row">Cash</span>
              <span class="partner-documents-upload-columns partner-documents-third-row">{{ data.currency }} {{ advance.amount }}</span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row"></span>
              <span class="partner-documents-upload-columns partner-documents-fourth-row">{{ advance.status }}</span>
            </div>
            </div>
            <div class="partner-documents-upload-empty" v-else>
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
                <option v-for="(document, index) in documents" :key="index" :value="document.documentType">
                  {{ document.documentType }}
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
          <modal name="request-fuel-advance" :height="550" :width="400" transition="slide" :pivot-y="0.5">
            <div class="upload-documents-modal">
              <div class="upload-documents-modal-top-row">
                <p class="upload-documents-modal-top-row-title">Request fuel payment</p>
                <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('request-fuel-advance')"></i>
              </div>
              <div>
                <div class="request-payment-info">
                  <i class="el-icon-info request-payment-info-icon"></i>
                  You can request a maximum of {{ data.currency }} {{ data.advance_limit }}
                </div>
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
              <button :class="fuelSubmitStatus && !requestLoadingStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button" @click="submitFuelRequest">
                <i class="el-icon-loading" v-if="requestLoadingStatus"></i>
                Request fuel advance
              </button>
            </div>
          </modal>
          <modal name="request-cash-advance" :height="300" :width="400" transition="slide" :pivot-y="0.5">
            <div class="upload-documents-modal">
              <div class="upload-documents-modal-top-row">
                <p class="upload-documents-modal-top-row-title">Request advance cash payment</p>
                <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('request-cash-advance')"></i>
              </div>
              <div>
                <div class="request-payment-info">
                  <i class="el-icon-info request-payment-info-icon"></i>
                  You can request a maximum of {{ data.currency }} {{ data.advance_limit }}
                </div>
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
              <button :class="cashSubmitStatus && !requestLoadingStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button" @click="submitCashRequest">
                <i class="el-icon-loading" v-if="requestLoadingStatus"></i>
                Request cash advance
              </button>
            </div>
          </modal>
          <modal name="preview-documents" :height="600" :width="800" transition="slide" :pivot-y="0.5">
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
              <button class="partner-documents-approve-button" @click="actionDocument(3)">Decline</button>
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
  title: 'Partner Portal - Freight Order Details',
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
      documents: [],
      documentType: 'Invoice',
      documentName: '',
      uploadFileName: '',
      uploadStatus: false,
      uploadProgress: false,
      requestStatus: true,
      requestLoadingStatus: false,
      sendStatus: false,
      documentPreview: '',
      activeDoc: {},
      declineReason: '',
      fuel_types: [],
      addresses: [],
      stations: [],
      amount: '',
      station: '',
      fuel: '',
      address: '',
    };
  },
  computed: {
    document_type() {
      const document = this.documents.filter(obj => obj.documentType === this.documentType);
      return document[0].id;
    },
    fuelSubmitStatus() {
      return (this.amount && this.fuel && this.address);
    },
    cashSubmitStatus() {
      return this.amount !== '';
    },
    fuelActiveStatus() {
      const fuelData = this.data.aux_services ? this.data.aux_services.filter(obj => obj.id === 1) : [];
      return fuelData.length > 0 ? fuelData[0].active : false;
    },
    cashActiveStatus() {
      const cashData = this.data.aux_services ? this.data.aux_services.filter(obj => obj.id === 2) : [];
      return cashData.length > 0 ? cashData[0].active : false;
    },
  },
  watch: {
    station(val) {
      if (val !== '') {
        this.getStationAddresses(val);
      }
    },
    amount(val) {
      setTimeout(() => {
        this.amount = val > parseInt(this.data.advance_limit, 10) ? parseInt(this.data.advance_limit, 10) : val;
      }, 100);
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchOrder();
      this.fetchDocumentTypes();
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
      const from_cordinates = path.pickup.coordinates;
      const to_cordinates = path.destination.coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=300x250&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    timeFormat(date) {
      return this.formatedTime(date);
    },
    currencyFormat(id) {
      const amount = this.data.offer_amount;
      return amount ? amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0] : 'N/A';
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
            this.notify(3, 0, `There was an error uploading your document: ${err.message}`);
          } else {
            this.uploadDocuments(photoKey);
            this.uploadStatus = false;
            this.uploadFileName = '';
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    triggerAction(status, doc) {
      this.activeDoc = doc;
      if (status === 3) {
        this.$modal.show('reject-documents');
      } else {
        this.actionDocument(status);
      }
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
    submitFuelRequest() {
      this.requestLoadingStatus = true;
      const payload = {
        quotation_id: this.data.quotation.quotation_id,
        fuel_type_id: this.fuel,
        fuel_station_id: this.address,
        amount: this.amount,
      };
      return new Promise((resolve, reject) => {
        axios
            .post(`${this.auth}freight-service/fuel_advance`, payload, this.config)
            .then(response => {
              this.notify(3, 1, `${response.data.message}`);
              this.$modal.hide('request-fuel-advance');
              this.fuel = '';
              this.amount = '';
              this.address = '';
              this.fetchOrder();
              this.requestLoadingStatus = false;
              resolve(response);
            })
            .catch(error => {
              this.notify(3, 0, `There was an error submitting your advance: ${error.response.data.message}`);
              this.errorObj = error.response;
              this.requestLoadingStatus = false;
              resolve(error);
            });
        });
    },
    submitCashRequest() {
      this.requestLoadingStatus = true;
      const payload = {
        quotation_id: this.data.quotation.quotation_id,
        amount: this.amount,
      };
      return new Promise((resolve, reject) => {
        axios
            .post(`${this.auth}freight-service/cash_advance`, payload, this.config)
            .then(response => {
              this.notify(3, 1, `${response.data.message}`);
              this.$modal.hide('request-cash-advance');
              this.amount = '';
              this.fetchOrder();
              this.requestLoadingStatus = false;
              resolve(response);
            })
            .catch(error => {
              this.notify(3, 0, `There was an error submitting your advance: ${error.response.data.message}`);
              this.errorObj = error.response;
              this.requestLoadingStatus = false;
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
    fetchOrder() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/shipments/quotations/${this.$route.params.order}/${this.sessionInfo.id}`, this.config)
          .then(response => {
            this.data = response.data.data;
            this.loadingStatus = false;
            this.fetchAuxiliaryServices();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `${error.response.message}`);
            this.data = {};
            this.loadingStatus = false;
            this.$router.push('/freight/orders');
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchAuxiliaryServices() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/shipments/quotation/advances/${this.$route.params.order}`, this.config)
          .then(response => {
            this.data.cash_advances = response.data.data.cash_advances;
            this.data.fuel_advances = response.data.data.fuel_advances;
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `${error.response.message}`);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchDocumentTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/document_types`, this.config)
          .then(response => {
            this.documents = response.data.data;
            resolve(response);
          })
          .catch(error => {
            this.documents = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    uploadDocuments(url) {
      const payload = {
        quotation_id: this.data.quotation.quotation_id,
        document_type: this.document_type,
        document_name: this.document_type === 1 ? this.documentName : this.documentType,
        url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${url}`,
        transporter_id: this.data.owner_id,
       };
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}freight-service/shipments/quotations/documents`, payload, this.config)
          .then(response => {
            this.notify(3, 1, 'Successfully uploaded document.');
            this.$modal.hide('upload-documents');
            this.fetchOrder();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `There was an error uploading your document: ${error.response.data.reason}`);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    actionDocument(status) {
      const payload = {
        document_id: this.activeDoc.document_id,
        transporter_id: this.sessionInfo.id,
        status: status === 2 ? 1 : -1,
      };
      if (status === 3) {
        payload.reason = this.declineReason;
      }
      return new Promise((resolve, reject) => {
        axios
          .put(`${this.auth}freight-service/shipments/quotations/documents/`, payload, this.config)
          .then(response => {
            this.notify(3, 1, `Successfully ${status === 3 ? 'rejected' : 'approved'} document.`);
            this.$modal.hide('reject-documents');
            this.declineReason = '';
            this.fetchOrder();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `There was an error ${status === 3 ? 'rejecting' : 'approving'} the document`);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
  },
};
</script>

<style>
.capitalize-text {
  text-transform: capitalize;
}
</style>
