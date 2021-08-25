<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <modal name="driver-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modLabel">{{ $t('vehicles.assign_driver') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('driver-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body vehicles__column-flex">
          <!-- redirect user to complete application on the onboarding platform !-->
          <button
            type="button"
            class="btn btn-secondary modBtn vehicles__assign--list-btn"
            data-toggle="modal"
            data-target="#driModal"
            data-dismiss="modal"
            @click="confirmOwner();"
          > {{ $t('vehicles.assign_me_driver') }}</button>

          <button
            type="button"
            class="btn btn-secondary modBtn vehicles__assign--list-btn"
            data-toggle="modal"
            data-target="#driverModal"
            data-dismiss="modal"
            @click="confirm();"
          >{{ $t('vehicles.assign_another_driver') }}</button>
        </div>
      </div>
    </modal>
    <modal name="driver-owner-modal" :height="500" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="odLabel">{{ $t('vehicles.driver_details') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('driver-owner-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body vehicles__mod-up">
          <div class="vehicles__driver-error snap-error" id="upErr"></div>

          <div class="vehicles__driver--card-wrap" id="idCard">
            <label for="driPicPreview">{{ $t('vehicles.passport_size_photo') }}</label>
            <div class="vehicles__doccard-img-holder vehicles__driver--passport-photo-wrap">
              <img
                src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                alt="Driver Photo"
                class="vehicles__driver--passport-img"
                id="driPicPreview"
              />
              <button
                type="button"
                name="button"
                id="driPic"
                class="btn btn-outline-primary btn-fake vehicles__driver--btn-upload"
                @click="transfer('driPicImg')"
              >{{ $t('vehicles.click_here') }}</button>
            </div>

            <input
              type="file"
              name
              value
              class="form-control"
              :placeholder="$t('vehicles.driver_photo')"
              accept="image/*"
              id="driPicImg"
              style="display:none;"
              @change="upload('driPicImg');"
            />
          </div>

          <label for="driDlNumber">{{ $t('vehicles.driving_licence') }}</label>
          <input
            type="text"
            name
            value
            class="form-control"
            :placeholder="$t('vehicles.driving_licence') "
            id="driDlNumber"
          />

          <label for="driLocation">{{ $t('vehicles.location') }}</label>
          <input
            type="text"
            name
            value
            class="form-control"
            :placeholder="$t('vehicles.operation_location')"
            id="driLocation"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-toggle="modal"
            data-dismiss="modal"
            @click="hide('driver-owner-modal')"
          >{{ $t('vehicles.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            id="createDiverOwnerButton"
            @click="createOwnerDriver()"
          >{{ $t('vehicles.submit') }}</button>
        </div>
      </div>
    </modal>
    <modal name="driver-invite-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modLabel">{{ $t('vehicles.driver_details') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('driver-invite-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="vehicles__driver-error" id="upErr2"></div>

          <vue-tel-input
            v-model="driverTel"
            v-bind="bindProps"
            id="phoneno"
            class="vehicles__driver-input"
          ></vue-tel-input>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            @click="hide('driver-invite-modal')"
          >{{ $t('vehicles.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#fabConfirm"
            data-dismiss="modal"
            @click="confirmDriver();"
          >{{ $t('vehicles.request_driver') }}</button>
        </div>
      </div>
    </modal>
    <modal name="confirm-driver-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title" id="arLabel">{{ $t('vehicles.confirm_driver_request') }}</span>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('invite-cancel-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="vehicles__driver-error" id="upErr2"></div>
          <span
            id="confDes"
          >{{ $t('vehicles.are_you_sure_request') }} {{ this.driverTel }} ?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="cancCancel"
            @click="hide('invite-cancel-modal')"
          >{{ $t('vehicles.back') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-dismiss="modal"
            id="cancConfirm"
            @click="inviteDriver()"
          >{{ $t('vehicles.confirm_driver') }}</button>
        </div>
      </div>
    </modal>
    <modal name="invite-cancel-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title" id="arLabel">{{ $t('vehicles.confirm_allocation') }}</span>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('invite-cancel-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="vehicles__driver-error" id="upErr3"></div>
          <span id="confDes">{{ $t('vehicles.are_sure_cancel_invite') }}</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="cancCancel"
            @click="hide('invite-cancel-modal')"
          >{{ $t('vehicles.back') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-dismiss="modal"
            id="cancConfirm"
            @click="cancelInvite()"
          >{{ $t('vehicles.cancel_invite') }}</button>
        </div>
      </div>
    </modal>
    <modal name="add-vehicle-modal" :height="'90%'" :width="'70%'" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mLabel">{{ $t('vehicles.add_vehicle') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('add-vehicle-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mod-form">
          <div class="vehicles__documents-error" id="upErr4"></div>

          <label for="selVendor">{{ $t('vehicles.bike_something_else') }}</label>
          <select class="form-control" id="selVendor" v-model="vendorType">
            <option value="1" selected>{{ $t('vehicles.bike') }}</option>
            <option value="2">{{ $t('vehicles.pickup') }}</option>
            <option value="3">Van</option>
            <option value="12">{{ $t('vehicles.tuk_tuk') }}</option>
            <option value="6">3T {{ $t('vehicles.truck') }}</option>
            <option value="10">5T {{ $t('vehicles.truck') }}</option>
            <option value="13">7T {{ $t('vehicles.truck') }}</option>
            <option value="14">10T {{ $t('vehicles.truck') }}</option>
            <option value="17">14T {{ $t('vehicles.truck') }}</option>
            <option value="18">20T {{ $t('vehicles.truck') }}</option>
            <option value="19">24T {{ $t('vehicles.truck') }}</option>
            <option value="20">28T {{ $t('vehicles.truck') }}</option>
          </select>
          <label for="selMake">{{ $t('vehicles.what_make') }}</label>
          <input
            type="text"
            name
            value
            class="form-control"
            placeholder="Make"
            id="selMake"
            v-model="make"
          />
          <label for="selModel">{{ $t('vehicles.what_model') }}</label>
          <input
            type="text"
            name
            value
            class="form-control"
            placeholder="Model"
            id="selModel"
            v-model="model"
          />
          <label for="selYear">{{ $t('vehicles.year_of_manufacture') }}</label>
          <input
            type="text"
            name
            value
            class="form-control"
            placeholder="Year"
            id="selYear"
            v-model="mfg"
          />
          <label for="selBox" id="selBoxLabel">{{ $t('vehicles.have_box') }}</label>
          <select class="form-control" id="selBox" v-model="box">
            <option value="0" selected>{{ $t('vehicles.no') }}</option>
            <option value="1">{{ $t('vehicles.yes') }}</option>
          </select>
          <label for="selFridge" id="selFridgeLabel"> {{ $t('vehicles.covered_or_open') }}</label>
          <select class="form-control" id="selFridge" v-model="covered">
            <option value="0" selected>{{ $t('vehicles.open') }}</option>
            <option value="1">{{ $t('vehicles.covered') }}</option>
          </select>
          <label for="selLog">{{ $t('vehicles.log_book_number') }}</label>
          <input
            type="text"
            name
            value
            class="form-control log-book"
           :placeholder="$t('vehicles.log_book_number')"
            id="selLog"
            v-model="logBook"
          />
          <label for="selReg">{{ $t('vehicles.enter_reg_no') }}</label>
          <input
            type="text"
            name
            value
            class="form-control reg-no"
            :placeholder="$t('vehicles.reg_no')"
            id="selReg"
            v-model="regNo"
          />
          <label for="selInsu">{{ $t('vehicles.insurance_number') }}</label>
          <input
            type="text"
            name
            value
            class="form-control insu-no"
            :placeholder="$t('vehicles.insurance_number')"
            id="selInsu"
            v-model="insuNo"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="clearInp"
            @click="$modal.hide('add-vehicle-modal')"
          >{{ $t('vehicles.cancel') }}</button>
          <button type="button" class="btn btn-primary modBtn" id="addNext" @click="logDocs();" :disabled="!(insuValid && logBookValid && regNoValid)">{{ $t('vehicles.next') }}</button>
        </div>
      </div>
    </modal>
    <modal
      name="vehicle-documents-modal"
      :height="400"
      :width="500"
      transition="slide"
      :pivot-y="0"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="odLabel">{{ $t('vehicles.vehicle_documents') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('vehicle-documents-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body vehicles__mod-up">
          <div class="vehicles__doccard-error" id="upErr"></div>

          <div class="vehicles__documents-card" id="logCard">
            <div class="vehicles__doccard-text">{{ $t('vehicles.upload_log_book_image') }}</div>
            <div class="vehicles__doccard-img-holder">
              <img
                src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                alt="Log Book"
                class="doccard-img"
                id="logPreview"
              />
              <button
                type="button"
                name="button"
                id="logBimgFake"
                class="btn btn-outline-primary btn-fake"
                @click="transfer('logBimg')"
              >{{ $t('vehicles.click_here') }}</button>
            </div>

            <input
              type="file"
              name
              value
              class="form-control"
              :placeholder="$t('vehicles.log_book')"
              accept="image/*"
              id="logBimg"
              style="display:none;"
              @change="upload('logBimg')"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-toggle="modal"
            data-target="#vehModal"
            data-dismiss="modal"
            @click="nextModal('vehicle-documents-modal', 'add-vehicle-modal')"
          >{{ $t('vehicles.back') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#vehUpModal"
            data-dismiss="modal"
            id="lgNext"
            disabled
            @click="nextModal('vehicle-documents-modal', 'vehicle-image-modal')"
          >{{ $t('vehicles.next') }}</button>
        </div>
      </div>
    </modal>
    <modal name="vehicle-image-modal" :height="400" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="odLabel">{{ $t('vehicles.vehicle_documents') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('vehicle-image-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body vehicles__mod-up">
          <div class="vehicles__documents-card" id="vehCard">
            <div class="vehicles__doccard-text">{{ $t('vehicles.upload_vehicle_image') }}</div>
            <div class="vehicles__doccard-img-holder">
              <img
                src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                alt="Vehicle"
                class="doccard-img"
                id="vehPreview"
              />
              <button
                type="button"
                name="button"
                id="vehImgFake"
                class="btn btn-outline-primary btn-fake"
                @click="transfer('vehImag')"
              >{{ $t('vehicles.click_here') }} </button>
            </div>
            <input
              type="file"
              name
              value
              class="form-control"
              :placeholder="$t('vehicles.vehicle_image')"
              accept="image/*"
              id="vehImag"
              style="display:none;"
              @change="upload('vehImag')"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-toggle="modal"
            data-target="#logUpModal"
            data-dismiss="modal"
            @click="nextModal('vehicle-image-modal', 'vehicle-documents-modal')"
          >{{ $t('vehicles.back') }}</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#vehAddModal"
            data-dismiss="modal"
            id="vehFin"
            disabled
            @click="nextModal('vehicle-image-modal', 'confirm-documents-modal')"
          >{{ $t('vehicles.confirm') }}</button>
        </div>
      </div>
    </modal>
    <modal
      name="confirm-documents-modal"
      :height="600"
      :width="500"
      transition="slide"
      :pivot-y="0"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="vehAddLabel">{{ $t('vehicles.confirm_vehicle_addition') }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hide('confirm-documents-modal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body vehicles__mod-up">
          <div class="vehicles__documents-error vehicles__add-confirm" id="upErr5"></div>

          <div class="vehicles__addc-title">{{ $t('vehicles.confirm_details_correct') }}</div>
          <div class="row vehicles__addc-content">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <p class="color-black font-14">
                {{ $t('vehicles.vehicle_type') }} :
                <span id="addcVend" class="color-black font-14">{{ vendorName }}</span>
              </p>
              <p class="color-black font-14">
                {{ $t('vehicles.make') }} :
                <span id="addcMake" class="color-black font-14">{{ make }}</span>
              </p>
              <p class="color-black font-14">
                {{ $t('vehicles.model') }} :
                <span id="addcModel" class="color-black font-14">{{ model }}</span>
              </p>
              <p class="color-black font-14">
                {{ $t('vehicles.model_year') }} :
                <span id="addcYear" class="color-black font-14">{{ mfg }}</span>
              </p>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <p id="addcBoxDes" class="color-black font-14">
                {{ $t('vehicles.box') }} :
                <span id="addcBox" class="color-black font-14">{{ boxOption }}</span>
              </p>
              <p class="color-black font-14">
                {{ $t('vehicles.registration') }} :
                <span id="addcReg" class="color-black font-14">{{ regNo }}</span>
              </p>
              <p class="color-black font-14">
               {{ $t('vehicles.log_book_number') }} :
                <span id="addcLogno" class="color-black font-14">{{ logBook }}</span>
              </p>
              <p class="color-black font-14">
                {{ $t('vehicles.insurance_number') }}  :
                <span id="addcInsu" class="color-black font-14">{{ insuNo }}</span>
              </p>
            </div>
          </div>
          <div class="row vehicles__addc-content">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <img
                :src="`https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/${logName}`"
                alt="Log Book"
                class="acc-img"
                id="logaccPreview"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <img
                :src="`https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/${vehImgName}`"
                alt="Vehicle"
                class="acc-img"
                id="vehaccPreview"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-toggle="modal"
            data-target="#vehUpModal"
            data-dismiss="modal"
            @click="nextModal('confirm-documents-modal', 'vehicle-image-modal')"
          >{{ $t('vehicles.back') }} </button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            id="endAdd"
            @click="sendDocuments()"
          >{{ $t('vehicles.finish') }} </button>
        </div>
      </div>
    </modal>
    <div class="print">
      <div class="printContain hidden-sm-down" v-if="windowWidth > 768">
        <table id="disp" class="table table-bordered hidden-sm-down" width="100%" cellspacing="0">
          <datatable
            class="savings__row"
            :columns="columns"
            :rows="rows"
            :title="$t('vehicles.vehicles_for', { name: this.sessionInfo.name})"
            v-if="rows"
            :per-page="[10, 20, 30, 40, 50]"
            :default-per-page="10"
            :clickable="false"
            :sortable="true"
            :exact-search="true"
            :exportable="true"
            :locale="language"
          ></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-for="row in rows" :key="row.registration_no" v-else>
        <div class="table-responsive mobile-table">
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.make') }} </div>
            <div class="thead-mobile-row">{{ row.make }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.model') }} </div>
            <div class="thead-mobile-row">{{ row.model }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.registration_no') }} </div>
            <div class="thead-mobile-row">{{ row.registration_no }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.active_driver_name') }}</div>
            <div class="thead-mobile-row">{{ row.name }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile"> {{ $t('vehicles.active_driver_phone') }}</div>
            <div class="thead-mobile-row">{{ row.phone_no }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.active_driver_balance') }}</div>
            <div class="thead-mobile-row">{{ row.rb }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.invite_driver') }}</div>
            <div class="thead-mobile-row">{{ row.rider_phone }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">{{ $t('vehicles.options') }}</div>
            <!--eslint-disable-next-line-->
            <div class="thead-mobile-row" v-html="row.options"></div>
          </div>
        </div>
      </div>
      <div class="fab-container">
        <div class="fab">
          <div class="fab-buttons" @click="showVehicleModal()">
            <span class="fab-buttons__link" data-tooltip="Add Vehicle" @click="showVehicleModal()">
              <p class="vehicle-tool-tip">{{ $t('vehicles.add_vehicle') }}</p>
            </span>
            <i class="icon-material fa fa-car"></i>
          </div>
          <div class="fab-action-button" @click="showVehicleModal()">
            <i class="fab-action-button__icon material-icons">add</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import VueTelInput from 'vue-tel-input';
import S3 from 'aws-s3';
import DataTable from 'vue-materialize-datatable';
import axios from 'axios';
import moment from 'moment';
import validator from '@sendyit/validation';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

let s3 = '';

export default {
  title: 'Partner Portal - Vehicles',
  components: {
    VueTelInput,
    verifier,
    datatable: DataTable,
    errorHandler,
  },
  data() {
    return {
      vendorName: '',
      vendorType: '1',
      make: '',
      model: '',
      mfg: '',
      box: '0',
      boxOption: '',
      covered: '0',
      logBook: '',
      regNo: '',
      insuNo: '',
      logName: 'grey_bg_01.jpg',
      vehImgName: 'grey_bg_01.jpg',
      cancelAllocationId: '',
      vehicleAllocation: '',
      showModal: false,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      columns: [{ label: '', field: 'first' }, { label: this.$t('vehicles.make'), field: 'make' }, { label: this.$t('vehicles.model'), field: 'model' }, { label: this.$t('vehicles.registration'), field: 'registration_no' }, { label: this.$t('vehicles.active_driver_phone'), field: 'phone_no' }, { label: this.$t('vehicles.active_driver_name'), field: 'name' }, { label: this.$t('vehicles.invited_driver'), field: 'rider_phone' }, { label: this.$t('vehicles.driver_balance'), field: 'rb' }, { label: this.$t('vehicles.option'), field: 'options', html: true }],
      page: 1,
      rows: [],
      from: '',
      to: '',
      error: '',
      windowWidth: '',
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('vehicles.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['KE', 'UG', 'TZ'],
        onlyCountries: [],
        ignoredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        wrapperClasses: '',
        inputClasses: '',
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      driverTel: '',
      ownerDriverTel: '',
      errorObj: '',
      insuValid: false,
      logBookValid: false,
      regNoValid: false,
    };
  },
  computed: {
    language() {
      if (localStorage.getItem('language')) {
        return localStorage.getItem('language').split('-')[0];
      }
      return 'en';
    },
  },
  watch: {
    insuNo(val) {
      this.insuNo = this.insuNo.toUpperCase();
      this.insuValid = validator('InsuranceCertificate', val, localStorage.countryCode.toLowerCase(), '.insu-no');
    },
    logBook(val) {
      this.logBook = this.logBook.toUpperCase();
      this.logBookValid = validator('LogBook', val, localStorage.countryCode.toLowerCase(), '.log-book');
    },
    regNo(val) {
      this.regNo = this.regNo.toUpperCase();
      let BU = 'MBUNumberPlate';
      const vendor = parseInt(this.vendorType, 10);
      if ([1, 12, 22, 21, 23, 24, 26, 27, 28].includes(vendor)) {
        BU = 'MBUNumberPlate';
      } else if ([2, 3, 5, 6, 10, 13, 14, 17].includes(vendor)) {
        BU = 'EBUNumberPlate';
      } else if ([18, 19, 20, 25].includes(vendor)) {
        BU = 'FBUNumberPlate';
      }
      this.regNoValid = validator(BU, this.regNo, localStorage.countryCode.toLowerCase(), '.reg-no');
    },
    vendorType() {
      this.regNoValid = false;
      this.regNo = '';
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.fetchVehicles();
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
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
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    document.body.removeEventListener('click', this.logger);
  },
  methods: {
    fetchVehicles() {
      const date = new Date();
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      this.rows = [];
      this.displayFetchingStatus(this.$t('vehicles.fetching_vehicles'), 0);
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/vehicles`, payload, this.config)
        .then(response => {
          if (response.data.vehicles) {
            this.removeFetchingStatus();
            this.populateTable(response);
            document.body.addEventListener('click', this.logger);
          } else {
            this.rows = [];
            this.displayFetchingStatus(this.$t('vehicles.no_vehicles_found'), 0);
          }
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    populateTable(response) {
      const record = [];
      response.data.vehicles.forEach((row, i) => {
        const riderRow = this.sortRidersActions(row);
        let vehicleRow = '';
        const invitedPhone = this.sortAllocationStatus(row);
        let riderRb = '';
        if (riderRow.rb) {
          riderRb = `${riderRow.rb.split(' ')[0]} ${Math.floor(riderRow.rb.split(' ')[1] * -1)}`;
        }
        if (row.vehicle) {
          vehicleRow = row.vehicle;
        }
        record.push({
          first: '',
          make: vehicleRow.make,
          model: vehicleRow.model,
          registration_no: vehicleRow.registration_no,
          phone_no: riderRow.phone_no,
          name: riderRow.riderName,
          rider_phone: invitedPhone,
          rb: riderRb,
          options: riderRow.action,
          insurance: riderRow.insurance_no,
        });
      });
      this.rows = record;
    },
    sortRidersActions(row) {
      let riderRow = [];
      if (row.rider) {
        riderRow = row.rider;
        if (riderRow.f_name) {
          riderRow.riderName = `${riderRow.f_name} ${riderRow.s_name}`;
        }
        if (row.allocation && row.allocation[0].allocation_status === 1) {
          riderRow.action = `<span class="cancel-allocation" id="${row.allocation[0].temp_rider_allocation_id}">${this.$t('vehicles.cancel_allocation')}</span>`;
        } else {
          riderRow.action = `<span class="reassign-driver" id="${row.vehicle.id}">${this.$t('vehicles.reassign_driver')}</span>`;
        }
      } else {
        if (row.allocation && row.allocation[0].allocation_status === 1) {
          riderRow.action = `<span class="cancel-allocation" id="${row.allocation[0].temp_rider_allocation_id}">${this.$t('vehicles.cancel_allocation')}</span>`;
        } else {
          riderRow.action = `<span class="add-driver" id="${row.vehicle.id}">${this.$t('vehicles.add_driver')}</span>`;
        }
      }
      return riderRow;
    },
    sortAllocationStatus(row) {
      let allocationRow = [];
      let invitedPhone = '';
      if (row.allocation) {
        allocationRow = row.allocation[0];
        if (allocationRow.allocation_status === 1) {
          invitedPhone = `${allocationRow.rider_phone} (${this.$t('vehicles.pending')})`;
        } else if (allocationRow.allocation_status === 2) {
          invitedPhone = `${allocationRow.rider_phone} (${this.$t('vehicles.accepted')})`;
        } else if (allocationRow.allocation_status === 3) {
          invitedPhone = `${allocationRow.rider_phone} (${this.$t('vehicles.rejected')})`;
        }
      }
      return invitedPhone;
    },
    displayFetchingStatus(message, time) {
      setTimeout(() => {
        if (document.getElementsByTagName('tbody').length > 0) {
          const list = document.getElementsByTagName('tbody')[0];
          list.innerHTML = `<tr class="records-placeholder"><td colspan="9" style="text-align: center;">${message}</td></tr>`;
        }
      }, time);
    },
    removeFetchingStatus() {
      const element = document.querySelector('.records-placeholder');
      if (typeof element !== 'undefined' && element !== null) {
        element.parentNode.removeChild(element);
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    logger(event) {
      if (event.target.className === 'add-driver' || event.target.className === 'reassign-driver') {
        this.vehicleAllocation = event.target.id;
        this.show();
      } else if (event.target.className === 'cancel-allocation') {
        this.cancelAllocationId = event.target.id;
        this.showCancel();
      }
    },
    show() {
      this.$modal.show('driver-modal');
    },
    showCancel() {
      this.$modal.show('invite-cancel-modal');
    },
    hide(name) {
      this.$modal.hide(name);
    },
    nextModal(modal1, modal2) {
      this.$modal.hide(modal1);
      this.$modal.show(modal2);
    },
    confirm() {
      this.$modal.hide('driver-modal');
      this.$modal.show('driver-invite-modal');
    },
    confirmOwner() {
      this.$modal.hide('driver-modal');
      this.$modal.show('driver-owner-modal');
    },
    transfer(id) {
      document.getElementById(id).click();
    },
    logDocs() {
      if (this.vendorType && this.make && this.model && this.mfg && this.box && this.covered && this.logBook && this.regNo && this.insuNo) {
        this.nextModal('add-vehicle-modal', 'vehicle-documents-modal');
        this.vendorName = $('#selVendor')
          .find('option:selected')
          .text();
        this.boxOption = $('#selBox')
          .find('option:selected')
          .text();
      } else {
        $('#upErr4')
          .html(this.$t('vehicles.please_enter_all'))
          .fadeIn('slow');
        setTimeout(() => {
          $('#upErr4').fadeOut('slow');
        }, 5000);
      }
    },
    sendDocuments() {
      const payload = {
        vendor: this.vendorName,
        vendor_type: this.vendorType,
        make: this.make,
        vendor: this.vendorName,
        model: this.model,
        manufacture_year: this.mfg,
        box: this.box,
        refrigerated: this.covered,
        log_book_no: this.logBook,
        insurance_no: this.insuNo,
        registration_no: this.regNo,
        log_book: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/${this.logName}`,
        vehicle: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/${this.vehImgName}`,
        owner_id: this.sessionInfo.id,
        trailer_no: 0,
        kwartos_code: 0,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/add_vehicle`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            this.fetchVehicles();
            $('#upErr5')
              .html(response.data.msg)
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr5').fadeOut('slow');
              this.$modal.hide('confirm-documents-modal');
            }, 2000);
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          $('#upErr5')
              .html(this.$t('vehicles.something_went_wrong', { message: error.response.data.message }))
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr5').fadeOut('slow');
            }, 5000);
        });
    },
    upload(id) {
      const files = document.getElementById(id)['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert(this.$t('vehicles.please_choose_file'));
      }
      this.loadingLabel(id);
      const file = files[0];
      const fileType = files[0]['type'];
      const fileName = this.sanitizeFilename(file.name);
      console.log(fileName);
      const albumPhotosKey = `${encodeURIComponent('photo')}/`;
      const photoKey = albumPhotosKey + fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          if (err) {
            console.log('There was an error uploading your photo: ', err.message);
            this.resetLabel(id, 0);
          } else {
            console.log('Successfully uploaded photo.');
            this.generatePreview(id, fileName);
            this.resetLabel(id, 1);
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    loadingLabel(id) {
      switch (id) {
        case 'logBimg': {
          this.disableLoadingPreviews('logBimgFake', 'lgNext');
          break;
        }
        case 'vehImag': {
          this.disableLoadingPreviews('vehImgFake', 'vehFin');
          break;
        }
        case 'driPicImg': {
          this.disableLoadingPreviews('driPic', 'createDiverOwnerButton');
          break;
        }
        default:
      }
    },
    disableLoadingPreviews(className, buttonName) {
      $(`#${className}`).html(this.$t('vehicles.uploading'));
      $(`#${buttonName}`)
        .prop('disabled', true)
        .css('background-color', 'gray');
      $(`#${className}`).prop('disabled', true);
    },
    generatePreview(id, name) {
      switch (id) {
        case 'logBimg': {
          this.logName = name;
          this.fetchPreviewImage('logBimg', name, 'logPreview');
          break;
        }
        case 'vehImag': {
          this.vehImgName = name;
          this.fetchPreviewImage('vehImag', name, 'vehPreview');
          break;
        }
        case 'driPicImg': {
          this.fetchPreviewImage('driPicImg', name, 'driPicPreview');
          break;
        }
        default:
      }
    },
    fetchPreviewImage(id, name, target) {
      $(`#${id}`).attr('name', name);
      const src = `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/${name}`;
      $(`#${target}`).attr('src', src);
    },
    resetLabel(id, cod) {
      if (cod === 1) {
        switch (id) {
          case 'logBimg': {
            this.successfulLabelReset('logBimgFake', 'lgNext');
            break;
          }
          case 'vehImag': {
            this.successfulLabelReset('vehImgFake', 'vehFin');
            break;
          }
          case 'driPicImg': {
            this.successfulLabelReset('driPic', 'createDiverOwnerButton');
            break;
          }
          default:
        }
      } else {
        switch (id) {
          case 'logBimg': {
            this.failedLabelReset('logBimgFake', 'lgNext');
            break;
          }
          case 'vehImag': {
            this.failedLabelReset('vehImgFake', 'vehFin');
            break;
          }
          case 'driPicImg': {
            this.failedLabelReset('driPic', 'createDiverOwnerButton');
            break;
          }
          default:
        }
      }
    },
    successfulLabelReset(id, button) {
      $(`#${id}`).html(this.$t('vehicles.click_here_to_change'));
      $(`#${button}`)
        .prop('disabled', false)
        .css('background-color', '#EE7D00');
      $(`#${id}`).prop('disabled', false);
    },
    failedLabelReset(id, button) {
      $(`#${id}`).html(this.$t('vehicles.image_upload_failed'));
      $(`#${button}`)
        .prop('disabled', false)
        .css('background-color', '#0275d8');
    },
    sanitizeFilename(name) {
      const temp_name = new Date().getTime() + name.toLowerCase().replace(/\s/g, '');
      return temp_name;
    },
    confirmDriver() {
      if (this.driverTel) {
        this.driverTel = this.driverTel.replace(/ /g, '');
        if (this.driverTel.length === 13) {
          this.$modal.hide('driver-invite-modal');
          this.$modal.show('confirm-driver-modal');
        } else {
          $('#upErr2')
            .html(this.$t('vehicles.enter_valid_phone'))
            .fadeIn('slow');
          setTimeout(() => {
            $('#upErr2').fadeOut('slow');
          }, 5000);
        }
      } else {
        $('#upErr2')
          .html(`${this.$t('vehicles.please_enter_phone')}<br>`)
          .fadeIn('slow');
        setTimeout(() => {
          $('#upErr2').fadeOut('slow');
        }, 5000);
      }
    },
    inviteDriver() {
      const payload = {
        rider_phone: this.driverTel,
        vehicle_id: this.vehicleAllocation,
      };
      $('#upErr2')
        .html(this.$t('vehicles.sending_driver_invite'))
        .fadeIn('slow');
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/allocate_rider`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            $('#upErr2').fadeOut('slow');
            this.$modal.hide('confirm-driver-modal');
            this.fetchVehicles();
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          $('#upErr2').fadeOut('slow');
          $('#upErr2')
            .html(error.response.data.message)
            .fadeIn('slow');
          setTimeout(() => {
            $('#upErr2').fadeOut('slow');
          }, 3000);
        });
    },
    cancelInvite() {
      const payload = {
        temp_rider_allocation_id: this.cancelAllocationId,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/cancel_allocation`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            this.$modal.hide('invite-cancel-modal');
            this.fetchVehicles();
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          $('#upErr3').fadeOut('slow');
          $('#upErr3')
            .html(error.response.data.message)
            .fadeIn('slow');
          setTimeout(() => {
            $('#upErr3').fadeOut('slow');
          }, 3000);
        });
    },
    createOwnerDriver() {
      let photo = $('#driPicPreview').attr('src');
      const dl_no = $('#driDlNumber').val();
      const neighborhood = $('#driLocation').val();
      if (photo === '' || dl_no === '' || neighborhood === '' || photo.includes('grey_bg_01')) {
        $('#upErr')
          .text(this.$t('vehicles.please_enter_phone'))
          .fadeIn('slow');
        setTimeout(() => {
          $('#upErr').fadeOut('slow');
        }, 3000);
        return false;
      }
      photo = photo.substring(photo.length, photo.lastIndexOf('/') + 1);
      const rider_details = {
        photo,
        dl_no,
        neighborhood,
      };
      const owner_id = this.sessionInfo.id;
      const payload = {
        vehicle_id: this.vehicleAllocation,
        rider_details,
        owner_id,
      };
      this.sendOwnerDriverRequest(payload);
    },
    sendOwnerDriverRequest(payload) {
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/create_owner_rider`, payload, this.config)
        .then(response => {
          this.$modal.hide('driver-owner-modal');
          this.fetchVehicles();
        })
        .catch(error => {
          this.errorObj = error.response;
          $('#upErr')
            .html(error.response.data.message)
            .fadeIn('slow');
          setTimeout(() => {
            $('#upErr').fadeOut('slow');
          }, 10000);
        });
    },
    showVehicleModal() {
      this.$modal.show('add-vehicle-modal');
    },
  },
};
</script>

<style>
.slide-enter-active,
.slide-leave {
  transition: all 0.5s;
  transform: translateY(0%);
}
.slide-enter,
.slide-leave-active {
  transition: all 0.5s;
  transform: translateY(-100%);
}
</style>
