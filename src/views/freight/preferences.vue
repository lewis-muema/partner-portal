<template>
  <div class="preferences-container">
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
          <el-select v-model="preference" class="request-advance-inputs">
            <el-option :value="item.id" :label="item.name" v-for="(item, index) in preferences" :key="index"></el-option>
          </el-select>
        </div>
        <button :class="sendStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button">Add {{ type }}</button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      preferences: [],
      preference: [],
      type: '',
      sendStatus: false,
    };
  },
  methods: {
    addPreference(type) {
      this.type = type;
      this.preferences = type === 'location' ? this.locations : this.loads;
      this.$modal.show('add-preference');
    },
    deleteLocation(id) {
      console.log(id);
    },
  },
};
</script>

<style>

</style>
