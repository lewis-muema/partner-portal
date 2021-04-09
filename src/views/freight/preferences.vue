<template>
  <div class="preferences-container">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">Locations that you dont want to service</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('location')">Add locations</button>
      <div v-if="locationData.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">Name of the location</div>
          <div class="preferences-table-column preferences-header">Actions</div>
        </div>
        <div v-for="(location, index) in locationData" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ location.location_name }}</div>
          <div class="preferences-table-column preferences-link" @click="deletePreference(location.id)">Delete</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        <div class="loading" v-if="loadingStatus"></div>
        <div v-else>There are no locations</div>
      </div>
    </div>
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">Type of loads that you don’t want to deliver</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('load')">Add loads</button>
      <div v-if="loadData.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">Type of load</div>
          <div class="preferences-table-column preferences-header">Actions</div>
        </div>
        <div v-for="(load, index) in loadData" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ load.cargo_type }}</div>
          <div class="preferences-table-column preferences-link" @click="deletePreference(load.id)">Delete</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        <div class="loading" v-if="loadingStatus"></div>
        <div v-else>There are no loads</div>
      </div>
    </div>

    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">Vehicle Management</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addVehicleDialog()">Add Vehicles</button>

      <div class="loading preferences-empty-table" v-if="loadingVehicle"></div>
      <div v-else>
        <div class="">
          <div v-if="rows.length > 0">
            <div class="vehicleContain hidden-sm-down" v-if="windowWidth > 768">
              <table class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
                <datatable class="savings__row" :columns="columns" :rows="rows" v-if="rows" :per-page="[10, 20, 30, 40, 50]" :default-per-page="10" :clickable="false" :sortable="true" :exact-search="false" :exportable="false" :printable="false"></datatable>
              </table>
            </div>

            <div class="vehicleContain hidden-md-up" v-for="row in rows" :key="row.registration_no" v-else>
              <div class="table-responsive mobile-table">
                <div class="row-mobile">
                  <div class="thead-mobile">Number Plate</div>
                  <div class="thead-mobile-row">{{ row.registration_no }}</div>
                </div>
                <div class="row-mobile">
                  <div class="thead-mobile">Status</div>
                  <!--eslint-disable-next-line-->
                  <div class="thead-mobile-row" v-html="row.options"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="preferences-empty-table" v-else>
            <div>There are no vehicles</div>
          </div>
        </div>
      </div>
    </div>

    <modal name="add-preference" :height="250" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Add {{ type }}</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('add-preference')"></i>
        </div>
        <div>
          <p class="request-advance-input-labels">Select {{ type }}</p>
          <gmap-autocomplete
            v-if="type === 'location'"
            id="location"
            :options="map_options"
            placeholder="Enter a location"
            :select-first-on-enter="true"
            class="request-advance-inputs order-creation-location-inputs"
            @place_changed="setLocation($event)"
          />
          <el-select v-model="preference" class="request-advance-inputs" v-if="type === 'load'">
            <el-option :value="item.id" :label="item.cargo_type" v-for="(item, index) in cargo_types" :key="index"></el-option>
          </el-select>
        </div>
        <button :class="sendStatus && !submitStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button" @click="submitPreference">
          <i class="el-icon-loading" v-if="submitStatus"></i>
          Add {{ type }}
        </button>
      </div>
    </modal>

    <!-- Add freight vehicles -->

    <modal name="add-vehicle" class="add_vehicle" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-vehicles-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Add vehicles</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('add-vehicle')"></i>
        </div>
        <div class="add-vehicles-outer">
          <div class="vehicle-details-borderline">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the type of your vehicle ?</p>
              <el-select v-model="vehicle_data[0].vendor_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.label" v-for="(item, index) in vendor_type" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the type of truck?</p>
              <el-select v-model="vehicle_data[0].carrier_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.carrier_type" v-for="(item, index) in freight_carrier_types" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the size of your truck ?</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[0].vehicle_size" v-mask="truckSizeMask" type="text" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the exact load size of your truck ?</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[0].load_capacity" v-mask="loadWeightMask" type="text" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Vehicle Number Plate</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].registration_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Vehicle Logbook Number</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].log_book_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Name of Insurance Company</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].insurance_name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Insurance Cert No</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].insurance_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Insurance Policy Number</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].policy_no" />
            </div>
          </div>
          <div class="vehicle-details-borderline" v-for="n in extra_vehicle" :key="n" :data-index="n">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the type of your vehicle ?</p>
              <el-select v-model="vehicle_data[n].vendor_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.label" v-for="(item, index) in vendor_type" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the type of truck?</p>
              <el-select v-model="vehicle_data[n].carrier_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.carrier_type" v-for="(item, index) in freight_carrier_types" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the size of your truck ?</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[n].vehicle_size" type="number" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">What is the exact load size of your truck ?</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[n].load_capacity" type="number" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Vehicle Number Plate</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].registration_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Vehicle Logbook Number</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].log_book_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Name of Insurance Company</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].insurance_name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Insurance Cert No</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].insurance_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">Insurance Policy Number</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].policy_no" />
            </div>
            <div class="vehicle-inner-detail" @click="removeVehicle(n)">
              <i class="el-icon-close el-icon-delete-vehicle"> <span class="remove-vehicle">Remove Vehicle</span></i>
            </div>
          </div>
          <div class="vehicle-inner-detail" @click="addVehicle()">
            <i class="el-icon-plus el-icon-add-vehicle"> <span class="add-vehicle">Add Vehicle</span></i>
          </div>
        </div>
        <div class="vehicle-inner-detail"><input type="checkbox" class="signature--checkbox" name="" value="false" v-model="verify_consent" /><span>I Allow Sendy Ltd to verify my insurance documents</span></div>
        <button class="partner-request-advance-button-active upload-documents-modal-button" @click="submitVehicle">
          <i class="el-icon-loading" v-if="submitStatus"></i>
          Add vehicles
        </button>
      </div>
    </modal>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import DataTable from 'vue-materialize-datatable';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';

export default {
  title: 'Partner Portal - Freight Preferences',
  components: {
    verifier,
    errorHandler,
    notify,
    datatable: DataTable,
  },
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
        types: ['(regions)'],
      },
      errorObj: '',
      locations: [],
      loads: [],
      cargo_types: [],
      preferences: [],
      preference: '',
      location: '',
      type: '',
      submitStatus: false,
      windowWidth: '',
      columns: [
        { label: 'Number Plate', field: 'registration_no' },
        { label: 'Status', field: 'options', html: true },
      ],
      rows: [],
      freight_carrier_types: [],
      extra_vehicle: 0,
      vehicle_data: [
        {
          vendor_type: '',
          carrier_type: '',
          vehicle_size: '',
          load_capacity: '',
          log_book_no: '',
          registration_no: '',
          insurance_name: '',
          insurance_no: '',
          policy_no: '',
        },
      ],
      vendor_type: [
        {
          label: 'Freight Truck (Over 18T Trucks)',
          id: 25,
        },
      ],
      loadWeightMask: '##.##',
      truckSizeMask: '##',
      verify_consent: false,
      loadingVehicle: true,
    };
  },
  computed: {
    sendStatus() {
      return this.type === 'load' ? this.preference !== '' : this.location !== '';
    },
    loadData() {
      const data = [];
      this.preferences.forEach(row => {
        if (row.preference_type === 'CARGO_TYPE') {
          data.push(row);
        }
      });
      return data;
    },
    locationData() {
      const data = [];
      this.preferences.forEach(row => {
        if (row.preference_type === 'LOCATION_TYPE') {
          data.push(row);
        }
      });
      return data;
    },
  },
  watch: {
    type(val) {
      this.preference = '';
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchCargoTypes();
      this.fetchOwnerPreferences();
      this.fetchVehicles();
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.fetchCarrierTypes();
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    setLocation(place) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      this.location = {
        owner_id: parseInt(this.sessionInfo.owner_id, 10),
        address_components: place.address_components,
        location_name: place.name,
      };
    },
    addPreference(type) {
      this.type = type;
      this.$modal.show('add-preference');
    },
    fetchCargoTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}freight-service/cargo_types`, this.config)
          .then(response => {
            this.cargo_types = response.data.data;
            resolve(response);
          })
          .catch(error => {
            this.cargo_types = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchOwnerPreferences() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}partners/transporter_pref_list?owner_id=${this.sessionInfo.owner_id}`, this.config)
          .then(response => {
            this.preferences = response.data.owner_preferences;
            this.loadingStatus = false;
            resolve(response);
          })
          .catch(error => {
            this.loads = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    submitPreference() {
      this.submitStatus = true;
      const payload = this.type === 'load' ? {
        owner_id: parseInt(this.sessionInfo.owner_id, 10),
        cargo_type_id: this.preference,
      }
      : this.location;
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}partners/transporter_preferences`, payload, this.config)
          .then(response => {
            this.notify(3, 1, 'Preference added successfully');
            this.fetchOwnerPreferences();
            this.preference = '';
            this.location = '';
            this.$modal.hide('add-preference');
            this.submitStatus = false;
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, 'Could not save preference');
            this.submitStatus = false;
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    deletePreference(id) {
      const payload = {
        preference_id: id,
      };
      return new Promise((resolve, reject) => {
        axios
          .delete(`${this.auth}partners/transporter_preferences`, {
            headers: this.config.headers,
            data: payload,
          })
          .then(response => {
            this.notify(3, 1, 'Preference deleted successfully');
            this.fetchOwnerPreferences();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, 'Could not delete preference');
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    fetchCarrierTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}partner-api/parcel/carrier-types`, this.config)
          .then(response => {
            this.freight_carrier_types = response.data;
            resolve(response);
          })
          .catch(error => {
            this.freight_carrier_types = [];
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    addVehicleDialog() {
      this.$modal.show('add-vehicle');
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    fetchVehicles() {
      this.loadingVehicle = true;
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.owner_id,
      });
      this.rows = [];
      axios
        .get(`${process.env.VUE_APP_AUTH}partner-api/onboarding/freight/vehicle-applicants?page=1&pending=1&parcelOwnerId=${parseInt(this.sessionInfo.owner_id, 10)}`, this.config)
        .then(response => {
          if (response.data.data.length > 0) {
            this.populateTable(response);
          } else {
            this.rows = [];
            this.loadingVehicle = false;
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.loadingVehicle = false;
        });
    },
    populateTable(response) {
      const record = [];
      response.data.data.forEach((row, i) => {
        const riderRow = this.sortRidersActions(row);
        record.push({
          registration_no: row.registration_no,
          options: riderRow.action,
        });
      });
      this.rows = record;
      this.loadingVehicle = false;
    },
    sortRidersActions(row) {
      const riderRow = [];
      if (row.review_status === 1) {
        riderRow.action = `<span class="vehicle_approval" id="${row.id}">Approved</span>`;
      } else if (row.review_status === 2) {
        riderRow.action = `<span class="vehicle_ongoing_verification" id="${row.id}">Ongoing verification</span>`;
      } else if (row.review_status === 3) {
        riderRow.action = `<span class="vehicle_inconsistency" id="${row.id}">Vehicle marked for inconsistency</span>`;
      } else if (row.review_status === 4) {
        riderRow.action = `<span class="vehicle_reupload" id="${row.id}">Documents uploaded : Awaiting verification</span>`;
      } else {
        riderRow.action = `<span class="vehicle_awaiting_verification" id="${row.id}">Awaiting verification</span>`;
      }
      return riderRow;
    },
    addVehicle() {
      this.vehicle_data.push({
        vendor_type: '',
        carrier_type: '',
        vehicle_size: '',
        load_capacity: '',
        registration_no: '',
        insurance_name: '',
        insurance_no: '',
        policy_no: '',
        log_book_no: '',
      });
      this.extra_vehicle++;
    },
    removeVehicle(index) {
      this.extra_vehicle--;
      this.vehicle_data.splice(index, 1);
    },
    clearStoredVehicles() {
      this.$modal.hide('add-vehicle');
      this.vehicle_data = [
        {
          vendor_type: '',
          carrier_type: '',
          vehicle_size: '',
          load_capacity: '',
          registration_no: '',
          insurance_name: '',
          insurance_no: '',
          policy_no: '',
          log_book_no: '',
        },
      ];
      this.extra_vehicle = 0;
    },
    submitVehicle() {
      for (let i = 0, iLen = this.vehicle_data.length; i < iLen; i += 1) {
        const vehicleArray = {
          vehicles: this.vehicle_data,
          parcel_owner_id: parseInt(this.sessionInfo.owner_id, 10),
        };
        if (this.vehicle_data[i].vendor_type === '' || this.vehicle_data[i].carrier_type === '' || this.vehicle_data[i].vehicle_size === '' || this.vehicle_data[i].load_capacity === '' || this.vehicle_data[i].registration_no === '' || this.vehicle_data[i].insurance_name === '' || this.vehicle_data[i].insurance_no === '' || this.vehicle_data[i].policy_no === '' || this.vehicle_data[i].log_book_no === '') {
          this.notify(3, 0, 'Please fill all entries');
        } else if (this.vehicle_data[i].vehicle_size < 18 || this.vehicle_data[i].vehicle_size > 33) {
          this.notify(3, 0, 'Vehicle size should be between 18 and 33 Tonnes');
        } else if (this.vehicle_data[i].load_capacity >= this.vehicle_data[i].vehicle_size) {
          this.notify(3, 0, 'Truck loading capacity should be less than the Truck size');
        } else if (!this.verify_consent) {
          this.notify(3, 0, 'Agree Sendy Ltd to verify my insurance documents to proceed');
        } else {
          vehicleArray.vehicles.map(v => Object.assign(v, { verify_consent: this.verify_consent }));
          const payload = vehicleArray;
          return new Promise((resolve, reject) => {
            axios
              .post(`${this.auth}partner-api/onboarding/freight/add-vehicle`, payload, this.config)
              .then(response => {
                this.notify(3, 1, 'Vehicle(s) added successfully');
                this.clearStoredVehicles();
                this.fetchVehicles();
                resolve(response);
              })
              .catch(error => {
                this.notify(3, 0, 'Could not add vehicles');
                this.errorObj = error.response;
                resolve(error);
              });
          });
        }
      }
    },
  },
};
</script>

<style>
.add-vehicle-input {
  width: 100%;
  display: block;
  padding: 0;
  border-radius: 4px;
  height: 42px;
  line-height: 1.25;
  border-width: thin;
  border-color: #b1b1b1;
  border-style: solid;
  box-sizing: border-box;
  padding-left: 15px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3%;
}
.upload-vehicles-modal {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.add_vehicle > div > div.v--modal-box.v--modal {
  min-height: 300px !important;
  height: auto !important;
  top: 160px !important;
}
.add_vehicle > .v--modal-background-click {
  margin-top: -7% !important;
}
.tonnage-flex {
  display: flex;
}
.tonnage-input {
  width: 61% !important;
  margin-right: 11% !important;
}
.vehicleContain {
  overflow: hidden;
  font-size: 13px;
  line-height: 1.2;
  padding-top: 20px;
}
.vehicle-details-borderline {
  border: 1px solid #d8dfe6;
  border-radius: 1px;
  margin-bottom: 6%;
}
.vehicle-inner-detail {
  margin: 3%;
}
.add-vehicles-outer {
  max-height: 500px;
  overflow-x: hidden;
}
.remove-vehicle {
  font-size: 14px;
  color: #f44b54;
  font-weight: 600;
  margin: 0px;
  font-family: 'Nunito' !important;
  cursor: pointer;
}
.el-icon-delete-vehicle {
  color: #f44b54 !important;
  cursor: pointer;
}
.add-vehicle {
  font-size: 14px;
  color: #1782c5;
  font-weight: 600;
  margin: 0px;
  font-family: 'Nunito' !important;
  cursor: pointer;
}
.el-icon-add-vehicle {
  color: #1782c5 !important;
  cursor: pointer;
}
.vehicle_approval {
  color: #1e7d11;
}
.vehicle_ongoing_verification {
  color: #87250b;
}
.vehicle_inconsistency {
  color: #786d11;
}
.vehicle_reupload {
  color: #87250b;
}
.vehicle_awaiting_verification {
  color: #0f4176;
}
</style>
