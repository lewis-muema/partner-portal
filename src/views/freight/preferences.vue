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
          <div class="preferences-table-column preferences-body">{{ location.location[0].long_name }}</div>
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
  title: 'Partner Portal - Freight Preferences',
  components: {
    verifier,
    errorHandler,
    notify,
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
        owner_id: parseInt(this.sessionInfo.id, 10),
        address_components: place.address_components,
      };
    },
    addPreference(type) {
      this.type = type;
      this.$modal.show('add-preference');
    },
    fetchCargoTypes() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.auth}/orders/v2/freight/cargo_types`, this.config)
          .then(response => {
            this.cargo_types = response.data.cargo_types;
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
          .get(`${this.auth}orders/v2/freight/owner_preferences/${this.sessionInfo.id}`, this.config)
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
        owner_id: parseInt(this.sessionInfo.id, 10),
        cargo_type_id: this.preference,
      }
      : this.location;
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}orders/v2/freight/owner_preferences`, payload, this.config)
          .then(response => {
            this.notify(3, 1, 'Preference added successfully');
            this.fetchOwnerCargoTypes();
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
          .delete(`${this.auth}orders/v2/freight/owner_preferences`, {
            headers: this.config.headers,
            data: payload,
          })
          .then(response => {
            this.notify(3, 1, 'Preference deleted successfully');
            this.fetchOwnerCargoTypes();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, 'Could not delete preference');
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
