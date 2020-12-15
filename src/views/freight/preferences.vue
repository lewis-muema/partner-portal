<template>
  <div class="preferences-container">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">Locations that you dont want to service</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('location')">Add locations</button>
      <div v-if="locations.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">Name of the location</div>
          <div class="preferences-table-column preferences-header">Actions</div>
        </div>
        <div v-for="(location, index) in locations" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ location.name }}</div>
          <div class="preferences-table-column preferences-link" @click="deleteLocation(location.id)">Delete</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        There are no locations
      </div>
    </div>
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">Type of loads that you don’t want to deliver</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('load')">Add loads</button>
      <div v-if="loads.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">Type of load</div>
          <div class="preferences-table-column preferences-header">Actions</div>
        </div>
        <div v-for="(load, index) in loads" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ load.name }}</div>
          <div class="preferences-table-column preferences-link" @click="deleteLocation(load.id)">Delete</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        There are no loads
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
          <el-select v-model="preference" class="request-advance-inputs" v-if="type === 'location'">
            <el-option :value="item.id" :label="item.name" v-for="(item, index) in preferences" :key="index"></el-option>
          </el-select>
          <el-select v-model="preference" class="request-advance-inputs" v-if="type === 'load'">
            <el-option :value="item.id" :label="item.cargo_type" v-for="(item, index) in cargo_types" :key="index"></el-option>
          </el-select>
        </div>
        <button :class="sendStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button">Add {{ type }}</button>
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
      errorObj: '',
      locations: [
        {
          name: 'Nairobi',
          id: 1,
        },
        {
          name: 'Mombasa',
          id: 2,
        },
        {
          name: 'Juba',
          id: 3,
        },
      ],
      loads: [
        {
          name: 'Rice',
          id: 1,
        },
        {
          name: 'Spares',
          id: 2,
        },
        {
          name: 'electronics',
          id: 3,
        },
      ],
      cargo_types: [],
      preferences: [],
      preference: '',
      type: '',
      sendStatus: false,
    };
  },
  watch: {
    preference(val) {
      if (val && this.type) {
        this.sendStatus = true;
      } else {
        this.sendStatus = false;
      }
    },
    type(val) {
      this.preference = '';
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchCargoTypes();
    }
  },
  methods: {
    addPreference(type) {
      this.type = type;
      this.$modal.show('add-preference');
    },
    deleteLocation(id) {
      console.log(id);
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
  },
};
</script>

<style>

</style>
