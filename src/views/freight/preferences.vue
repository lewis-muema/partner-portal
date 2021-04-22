<template>
  <div class="preferences-container">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">{{ $t('preferences.locations_that_dont') }}</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('location')">{{ $t('preferences.add_location') }}</button>
      <div v-if="locationData.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">{{ $t('preferences.name_location') }}</div>
          <div class="preferences-table-column preferences-header">{{ $t('preferences.action') }}</div>
        </div>
        <div v-for="(location, index) in locationData" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ location.location_name }}</div>
          <div class="preferences-table-column preferences-link" @click="deletePreference(location.id)">{{ $t('preferences.delete') }}</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        <div class="loading" v-if="loadingStatus"></div>
        <div v-else>{{ $t('preferences.no_locations') }}</div>
      </div>
    </div>
    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">{{ $t('preferences.load_type_not_deliver') }}</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addPreference('load')">{{ $t('preferences.add_loads') }}</button>
      <div v-if="loadData.length > 0" class="preferences-table">
        <div class="preferences-table-row">
          <div class="preferences-table-column preferences-header">{{ $t('preferences.type_of_load') }}</div>
          <div class="preferences-table-column preferences-header">{{ $t('preferences.actions') }}</div>
        </div>
        <div v-for="(load, index) in loadData" class="preferences-table-row" :key="index">
          <div class="preferences-table-column preferences-body">{{ load.cargo_type }}</div>
          <div class="preferences-table-column preferences-link" @click="deletePreference(load.id)">{{ $t('preferences.delete') }}</div>
        </div>
      </div>
      <div v-else class="preferences-empty-table">
        <div class="loading" v-if="loadingStatus"></div>
        <div v-else>{{ $t('preferences.there_are_no_loads') }}</div>
      </div>
    </div>

    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">{{ $t('preferences.vehicle_management') }}</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addVehicleDialog()">{{ $t('preferences.add_vehicles') }}</button>

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
                  <div class="thead-mobile">{{ $t('preferences.number_plate') }}</div>
                  <div class="thead-mobile-row">{{ row.registration_no }}</div>
                </div>
                <div class="row-mobile">
                  <div class="thead-mobile">{{ $t('preferences.status') }}</div>
                  <!--eslint-disable-next-line-->
                  <div class="thead-mobile-row" v-html="row.options"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="preferences-empty-table" v-else>
            <div>{{ $t('preferences.no_vehicles') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="preferences-container-sections">
      <p class="request-advance-input-labels">{{ $t('preferences.notification_recipient') }}</p>
      <button class="partner-request-advance-button-active preferences-buttons" @click="addRecipientsDialog()">{{ $t('preferences.add_recipient') }}</button>

      <div class="loading preferences-empty-table" v-if="loadingRecipients"></div>
      <div v-else>
        <div class="">
          <div v-if="recipient_row.length > 0">
            <div class="vehicleContain hidden-sm-down" v-if="windowWidth > 768">
              <table class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
                <datatable class="savings__row" :columns="recipient_columns" :rows="recipient_row" v-if="recipient_row" :per-page="[10, 20, 30, 40, 50]" :default-per-page="10" :clickable="false" :sortable="true" :exact-search="false" :exportable="false" :printable="false">
                  <th slot="thead-tr">
                    Actions
                  </th>
                  <template slot="tbody-tr" slot-scope="props">
                    <td class="delete_recipient" @click="deleteRecipient(props.row)">
                      Delete
                    </td>
                  </template></datatable>
              </table>
            </div>

            <div class="vehicleContain hidden-md-up" v-for="row in recipient_row" :key="row.user_id" v-else>
              <div class="table-responsive mobile-table">
                <div class="row-mobile">
                  <div class="thead-mobile">{{ $t('preferences.name') }}</div>
                  <div class="thead-mobile-row">{{ row.name }}</div>
                </div>
                <div class="row-mobile">
                  <div class="thead-mobile">{{ $t('preferences.phone_number') }}</div>
                  <div class="thead-mobile-row">{{ row.phone }}</div>
                </div>
                <div class="row-mobile">
                  <div class="thead-mobile">{{ $t('preferences.email') }}</div>
                  <div class="thead-mobile-row">{{ row.email }}</div>
                </div>
                <div class="row-mobile">
                  <div class="thead-mobile">{{ $t('preferences.action') }}</div>
                  <!--eslint-disable-next-line-->
                  <div class="thead-mobile-row" v-html="row.options"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="preferences-empty-table" v-else>
            <div>{{ $t('preferences.no_notification_recipient') }}</div>
          </div>
        </div>
      </div>
    </div>

    <modal name="add-preference" :height="250" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-documents-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">{{ $t('preferences.add') }} {{ type }}</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('add-preference')"></i>
        </div>
        <div>
          <p class="request-advance-input-labels">{{ $t('preferences.select') }} {{ type }}</p>
          <gmap-autocomplete v-if="type === 'location'" id="location" :options="map_options" :placeholder="$t('preferences.enter_location')" :select-first-on-enter="true" class="request-advance-inputs order-creation-location-inputs" @place_changed="setLocation($event)" />
          <el-select v-model="preference" class="request-advance-inputs" v-if="type === 'load'">
            <el-option :value="item.id" :label="item.cargo_type" v-for="(item, index) in cargo_types" :key="index"></el-option>
          </el-select>
        </div>
        <button :class="sendStatus && !submitStatus ? 'partner-request-advance-button-active' : 'partner-request-advance-button-inactive'" class="upload-documents-modal-button" @click="submitPreference">
          <i class="el-icon-loading" v-if="submitStatus"></i>
          {{ $t('preferences.add') }} {{ type }}
        </button>
      </div>
    </modal>

    <!-- Add freight vehicles -->

    <modal name="add-vehicle" class="add_vehicle" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-vehicles-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">{{ $t('preferences.add_vehicles') }}</p>
          <i class="el-icon-close upload-documents-modal-top-row-close" @click="$modal.hide('add-vehicle')"></i>
        </div>
        <div class="add-vehicles-outer">
          <div class="vehicle-details-borderline">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.type_of_vehicle') }}</p>
              <el-select v-model="vehicle_data[0].vendor_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.label" v-for="(item, index) in vendor_type" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.type_of_truck') }}</p>
              <el-select v-model="vehicle_data[0].carrier_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.carrier_type" v-for="(item, index) in freight_carrier_types" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.size_of_truck') }}</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[0].vehicle_size" v-mask="truckSizeMask" type="text" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.exact_load_size') }}</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[0].load_capacity" v-mask="loadWeightMask" type="text" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.vehicle_number_plate') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].registration_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.vehicle_logbook_number') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].log_book_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.name_of_insurance') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].insurance_name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.insurance_cert_no') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].insurance_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.insurance_policy_number') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[0].policy_no" />
            </div>
          </div>
          <div class="vehicle-details-borderline" v-for="n in extra_vehicle" :key="n" :data-index="n">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.type_of_vehicle') }}</p>
              <el-select v-model="vehicle_data[n].vendor_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.label" v-for="(item, index) in vendor_type" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.type_of_truck') }}</p>
              <el-select v-model="vehicle_data[n].carrier_type" class="request-advance-inputs">
                <el-option :value="item.id" :label="item.carrier_type" v-for="(item, index) in freight_carrier_types" :key="index"></el-option>
              </el-select>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.size_of_truck') }}</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[n].vehicle_size" type="number" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.exact_load_size') }}</p>
              <div class="tonnage-flex"><input v-model="vehicle_data[n].load_capacity" type="number" class="add-vehicle-input tonnage-input" /> <span>Tonnes</span></div>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.vehicle_number_plate') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].registration_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.vehicle_logbook_number') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].log_book_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.name_of_insurance') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].insurance_name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.insurance_cert_no') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].insurance_no" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.insurance_policy_number') }}</p>
              <input class="add-vehicle-input" v-model="vehicle_data[n].policy_no" />
            </div>
            <div class="vehicle-inner-detail" @click="removeVehicle(n)">
              <i class="el-icon-close el-icon-delete-vehicle">
                <span class="remove-vehicle">{{ $t('preferences.remove_vehicle') }}</span></i>
            </div>
          </div>
          <div class="vehicle-inner-detail" @click="addVehicle()">
            <i class="el-icon-plus el-icon-add-vehicle">
              <span class="add-vehicle">{{ $t('preferences.add_vehicle') }}</span></i>
          </div>
        </div>
        <div class="vehicle-inner-detail">
          <input type="checkbox" class="signature--checkbox" name="" value="false" v-model="verify_consent" /><span> {{ $t('preferences.allow_sendy_verify') }}</span>
        </div>
        <button class="partner-request-advance-button-active upload-documents-modal-button" @click="submitVehicle">
          <i class="el-icon-loading" v-if="submitStatus"></i>
          {{ $t('preferences.add_vehicles') }}
        </button>
      </div>
    </modal>

    <!-- Add freight notification recipients -->

    <modal name="add-recipient-dialog" class="add_vehicle" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-vehicles-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">{{ $t('preferences.add_users') }}</p>
        </div>
        <div class="add-user-info">
          <div class="add-user-info-inner">
            {{ $t('preferences.people_recieve_notifications') }}
            <div class="add-user-extra">
              {{ $t('preferences.add_upto_seven_users') }}
            </div>
          </div>
        </div>
        <div class="add-vehicles-outer" v-if="!summary_tab">
          <div class="vehicle-details-borderline">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.name') }}</p>
              <input class="add-vehicle-input" v-model="recipient_data[0].name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.phone_number') }}</p>
              <vue-tel-input v-model="recipient_data[0].phone" v-bind="bindProps" class="login__phone-input add-vehicle-input" @validate="Valid" @input="setPhoneInputIndex(0)"></vue-tel-input>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.email_address') }}</p>
              <input class="add-vehicle-input" v-model="recipient_data[0].email" />
            </div>
          </div>
          <div class="vehicle-details-borderline" v-for="n in extra_recipient" :key="n" :data-index="n">
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.name') }}</p>
              <input class="add-vehicle-input" v-model="recipient_data[n].name" />
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.phone_number') }}</p>
              <vue-tel-input v-model="recipient_data[n].phone" v-bind="bindProps" class="login__phone-input add-vehicle-input" @validate="Valid" @input="setPhoneInputIndex(n)"></vue-tel-input>
            </div>
            <div class="vehicle-inner-detail">
              <p class="request-advance-input-labels">{{ $t('preferences.email_address') }}</p>
              <input class="add-vehicle-input" v-model="recipient_data[n].email" />
            </div>
            <div class="vehicle-inner-detail" @click="removeRecipient(n)">
              <i class="el-icon-close el-icon-delete-vehicle">
                <span class="remove-vehicle">{{ $t('preferences.remove_user') }}</span></i>
            </div>
          </div>
          <div class="vehicle-inner-detail" @click="addRecipient()" v-if="extra_recipient < 7">
            <i class="el-icon-plus el-icon-add-vehicle">
              <span class="add-vehicle">{{ $t('preferences.add_another_user') }}</span></i>
          </div>
        </div>

        <div class="add-vehicles-outer" v-if="summary_tab">
          <div class="vehicleContain hidden-md-up">
            <div class="table-responsive mobile-table" v-for="row in recipient_data" :key="row.email">
              <div class="row-mobile">
                <div class="thead-mobile">{{ $t('preferences.name') }}</div>
                <div class="thead-mobile-row">{{ row.name }}</div>
              </div>
              <div class="row-mobile">
                <div class="thead-mobile">{{ $t('preferences.phone_number') }}</div>
                <div class="thead-mobile-row">{{ row.phone }}</div>
              </div>
              <div class="row-mobile">
                <div class="thead-mobile">{{ $t('preferences.email_address') }}</div>
                <div class="thead-mobile-row">{{ row.email }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="add-recipient-btn-outer" v-if="!summary_tab">
          <div class="set-div-flex"></div>
          <div class="close-recipients-dialog" @click="$modal.hide('add-recipient-dialog')">
            {{ $t('preferences.cancel') }}
          </div>
          <button class="partner-request-advance-button-active add-recipients-modal-button" @click="nextTab(true)">
            {{ $t('preferences.save') }}
          </button>
        </div>

        <div class="add-recipient-btn-outer" v-else>
          <div class="set-div-flex"></div>
          <div class="close-recipients-dialog" @click="nextTab(false)">
            {{ $t('preferences.edit') }}
          </div>
          <button class="partner-request-advance-button-active add-recipients-modal-button" @click="submitNotificationRecipients()">
            {{ $t('preferences.confirm') }}
          </button>
        </div>
      </div>
    </modal>

    <!-- Add freight notification recipients -->

    <modal name="delete-recipient-dialog" class="notification_recipient" :width="400" transition="slide" :pivot-y="0.5">
      <div class="upload-vehicles-modal">
        <div class="upload-documents-modal-top-row">
          <p class="upload-documents-modal-top-row-title">Delete User</p>
        </div>
        <div class="remove-recipient-info">
          <div class="">
            Are you sure you want to delete<span>{{ singleRecipientData.name }} ?</span>
          </div>
        </div>
        <div class="add-recipient-btn-outer">
          <div class="set-div-flex"></div>
          <div class="close-recipients-dialog cancel-notification" @click="closeDeleteRecipientDialog()">
            No
          </div>
          <button class="partner-request-advance-button-active add-recipients-modal-button" @click="submitDeleteRequest()">
            Yes , Delete User
          </button>
        </div>
      </div>
    </modal>

    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import DataTable from 'vue-materialize-datatable';
import VueTelInput from 'vue-tel-input';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';
import 'vue-tel-input/dist/vue-tel-input.css';

export default {
  title: 'Partner Portal - Freight Preferences',
  components: {
    verifier,
    errorHandler,
    notify,
    datatable: DataTable,
    VueTelInput,
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
          'Accept-Language': localStorage.getItem('language'),
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
          label: this.$t('preferences.freight_truck_over'),
          id: 25,
        },
      ],
      loadWeightMask: '##.##',
      truckSizeMask: '##',
      verify_consent: false,
      loadingVehicle: true,
      loadingRecipients: true,
      recipient_data: [
        {
          name: '',
          phone: '',
          email: '',
          phoneValidity: false,
        },
      ],
      recipient_columns: [
        { label: this.$t('preferences.name'), field: 'name' },
        { label: this.$t('preferences.phone_number'), field: 'phone' },
        { label: this.$t('preferences.email'), field: 'email' },
      ],
      recipient_row: [],
      extra_recipient: 0,
      summary_tab: false,
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('login.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: [],
        onlyCountries: [],
        ignoredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 20,
        wrapperClasses: '',
        inputClasses: '',
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
        validCharactersOnly: true,
      },
      phoneInputIndex: 0,
      singleRecipientData: {},
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
      this.fetchRecipients();
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.fetchCarrierTypes();
      this.getCountries();
    }
  },
  methods: {
    getCountries() {
      axios.get(`${this.auth}staffapi/countries`).then(res => {
        const countries = res.data.map(country => country.country_code);
        this.bindProps.onlyCountries = countries;
      });
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    /* eslint-disable */
    Valid: function({ number, isValid, country }) {
      if (number !== '') {
        this.recipient_data[this.phoneInputIndex].phoneValidity = isValid;
      }
    },
    setPhoneInputIndex(index) {
      this.phoneInputIndex = index;
    },
    setLocation(place) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      this.location = {
        owner_id: parseInt(this.sessionInfo.id, 10),
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
          .get(`${this.auth}partners/transporter_pref_list?owner_id=${this.sessionInfo.id}`, this.config)
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
      const payload =
        this.type === 'load'
          ? {
              owner_id: parseInt(this.sessionInfo.id, 10),
              cargo_type_id: this.preference,
            }
          : this.location;
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}partners/transporter_preferences`, payload, this.config)
          .then(response => {
            this.notify(3, 1, this.$t('preferences.preference_added_successfully'));
            this.fetchOwnerPreferences();
            this.preference = '';
            this.location = '';
            this.$modal.hide('add-preference');
            this.submitStatus = false;
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, this.$t('preferences.not_save_preference'));
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
            this.notify(3, 1, this.$t('preferences.preference_deleted'));
            this.fetchOwnerPreferences();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, this.$t('preferences.not_delete_preference'));
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
    addRecipientsDialog() {
      this.getCountries();
      this.$modal.show('add-recipient-dialog');
    },
    nextTab(val) {
      let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (val) {
        for (let i = 0, iLen = this.recipient_data.length; i < iLen; i += 1) {
          if (this.recipient_data[i].name === '' || this.recipient_data[i].phone === '' || this.recipient_data[i].email === '') {
            this.notify(3, 0, this.$t('preferences.fill_all_entries'));
          } else if (this.recipient_data[i].phone !== '' && !this.recipient_data[i].phoneValidity) {
            this.notify(3, 0, 'Kindly provide a valid phone number');
          } else if (this.recipient_data[i].email !== '' && !this.recipient_data[i].email.match(mailformat)) {
            this.notify(3, 0, 'Kindly provide a valid email address');
          } else {
            this.summary_tab = val;
          }
        }
      } else {
        this.summary_tab = val;
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    fetchVehicles() {
      this.loadingVehicle = true;
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      this.rows = [];
      axios
        .get(`${process.env.VUE_APP_AUTH}partner-api/onboarding/freight/vehicle-applicants?page=1&pending=1&parcelOwnerId=${parseInt(this.sessionInfo.id, 10)}`, this.config)
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
    addRecipient() {
      this.recipient_data.push({
        name: '',
        phone: '',
        email: '',
        phoneValidity: false,
      });
      this.extra_recipient++;
    },
    removeRecipient(index) {
      this.extra_recipient--;
      this.recipient_data.splice(index, 1);
    },
    clearRecipients() {
      this.$modal.hide('add-recipient-dialog');
      this.recipient_data = [
        {
          name: '',
          phone: '',
          email: '',
          phoneValidity: false,
        },
      ];
      this.extra_recipient = 0;
      this.summary_tab = false;
    },
    fetchRecipients() {
      this.loadingRecipients = true;
      this.recipient_row = [];
      axios
        .get(`${process.env.VUE_APP_AUTH}partner-api/parcel/partner-users?page=1&status=1&status=2&ownerId=${parseInt(this.sessionInfo.id, 10)}`, this.config)
        .then(response => {
          if (response.data.data.length > 0) {
            this.populateRecipientsTable(response);
          } else {
            this.recipient_row = [];
            this.loadingRecipients = false;
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.loadingRecipients = false;
        });
    },
    populateRecipientsTable(response) {
      const data = [];
      response.data.data.forEach((row, i) => {
        const riderRow = this.sortRecipientActions(row);
        data.push({
          name: row.name,
          phone: row.phone,
          email: row.email,
          id: row.id,
          options: riderRow.action,
        });
      });
      this.recipient_row = data;
      this.loadingRecipients = false;
    },
    sortRecipientActions(row) {
      const recipientRow = [];
      recipientRow.action = `<span class="delete_recipient" id="${row.id}">Delete</span>`;
      return recipientRow;
    },
    sortRidersActions(row) {
      const riderRow = [];
      if (row.review_status === 1) {
        riderRow.action = `<span class="vehicle_approval" id="${row.id}">${this.$t('preferences.approved')}</span>`;
      } else if (row.review_status === 2) {
        riderRow.action = `<span class="vehicle_ongoing_verification" id="${row.id}">${this.$t('preferences.ongoing_verification')}</span>`;
      } else if (row.review_status === 3) {
        riderRow.action = `<span class="vehicle_inconsistency" id="${row.id}">${this.$t('preferences.marked_for_inconsistency')}</span>`;
      } else if (row.review_status === 4) {
        riderRow.action = `<span class="vehicle_reupload" id="${row.id}">${this.$t('preferences.documents_uploaded')}</span>`;
      } else {
        riderRow.action = `<span class="vehicle_awaiting_verification" id="${row.id}">${this.$t('preferences.waiting_verification')}</span>`;
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
          parcel_owner_id: parseInt(this.sessionInfo.id, 10),
        };
        if (this.vehicle_data[i].vendor_type === '' || this.vehicle_data[i].carrier_type === '' || this.vehicle_data[i].vehicle_size === '' || this.vehicle_data[i].load_capacity === '' || this.vehicle_data[i].registration_no === '' || this.vehicle_data[i].insurance_name === '' || this.vehicle_data[i].insurance_no === '' || this.vehicle_data[i].policy_no === '' || this.vehicle_data[i].log_book_no === '') {
          this.notify(3, 0, this.$t('preferences.fill_all_entries'));
        } else if (this.vehicle_data[i].vehicle_size < 18 || this.vehicle_data[i].vehicle_size > 33) {
          this.notify(3, 0, this.$t('preferences.vehicle_size_should'));
        } else if (this.vehicle_data[i].load_capacity >= this.vehicle_data[i].vehicle_size) {
          this.notify(3, 0, this.$t('preferences.truck_loading_capacity'));
        } else if (!this.verify_consent) {
          this.notify(3, 0, this.$t('preferences.agree_sendy_verify'));
        } else {
          vehicleArray.vehicles.map(v => Object.assign(v, { verify_consent: this.verify_consent }));
          const payload = vehicleArray;
          return new Promise((resolve, reject) => {
            axios
              .post(`${this.auth}partner-api/onboarding/freight/add-vehicle`, payload, this.config)
              .then(response => {
                this.notify(3, 1, this.$t('preferences.vehicles_added'));
                this.clearStoredVehicles();
                this.fetchVehicles();
                resolve(response);
              })
              .catch(error => {
                this.notify(3, 0, this.$t('preferences.not_add_vehicles'));
                this.errorObj = error.response;
                resolve(error);
              });
          });
        }
      }
    },
    submitNotificationRecipients() {
      let data = this.recipient_data;
      for (let key in data) {
        delete data[key].phoneValidity;
      }
      const payload = {
        users: this.recipient_data,
        ownerId: parseInt(this.sessionInfo.id, 10),
      };

      return new Promise((resolve, reject) => {
        axios
          .post(`${this.auth}partner-api/parcel/partner-user`, payload, this.config)
          .then(response => {
            this.notify(3, 1, 'Notification recipient(s) added successfully');
            this.clearRecipients();
            this.fetchRecipients();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, `Could not add notification recipients : ${error.response.data.message}`);
            this.errorObj = error.response;
            resolve(error);
          });
      });
    },
    deleteRecipient(val) {
      this.singleRecipientData = val;
      this.$modal.show('delete-recipient-dialog');
    },
    closeDeleteRecipientDialog() {
      this.$modal.hide('delete-recipient-dialog');
      this.singleRecipientData = {};
    },
    submitDeleteRequest() {
      let payload = {
        status: 3,
      };
      return new Promise((resolve, reject) => {
        axios
          .patch(`${this.auth}partner-api/parcel/partner-user/${this.singleRecipientData.id}`, payload, this.config)
          .then(response => {
            this.notify(3, 1, 'Notification recipient(s) has been deleted successfully');
            this.closeDeleteRecipientDialog();
            this.fetchRecipients();
            resolve(response);
          })
          .catch(error => {
            this.notify(3, 0, 'Could not delete notification recipients');
            this.errorObj = error.response;
            resolve(error);
          });
      });
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
  max-height: 400px;
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
.add-user-info {
  background: #fdedd3;
  border-radius: 4px;
  margin-top: 1%;
  margin-bottom: 3%;
}
.add-user-info-inner {
  padding: 4%;
}
.add-user-extra {
  margin-top: 7%;
}
.add-recipients-modal-button {
  width: 47% !important;
}
.close-recipients-dialog {
  margin: 20px 10px 10px 0px;
  color: #ea7125;
  cursor: pointer;
}
.add-recipient-btn-outer {
  text-align: right;
  display: flex;
}
.set-div-flex {
  flex-grow: 1;
}
.delete_recipient {
  color: #ff0000 !important;
  cursor: pointer !important;
}
.vehicle-details-borderline > div:nth-child(2) > div > div > ul {
  margin-left: -21% !important;
  width: 336px !important;
}
.notification_recipient > .v--modal-background-click {
  margin-top: 0% !important;
}
.notification_recipient > div > div.v--modal-box.v--modal {
  min-height: 200px !important;
  height: auto !important;
  top: 160px !important;
}
.remove-recipient-info {
  margin-top: 5%;
  margin-bottom: 11%;
}
.cancel-notification {
  margin-right: 11% !important;
}
</style>
