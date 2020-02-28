<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <modal name="driver-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modLabel">Assign a Driver</h5>
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
          >Assign me as a Driver</button>

          <button
            type="button"
            class="btn btn-secondary modBtn vehicles__assign--list-btn"
            data-toggle="modal"
            data-target="#driverModal"
            data-dismiss="modal"
            @click="confirm();"
          >Assign another Driver</button>
        </div>
      </div>
    </modal>
    <modal name="driver-owner-modal" :height="500" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="odLabel">Driver Details</h5>
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
            <label for="driPicPreview">Passport size photo</label>
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
              >Click here to upload image</button>
            </div>

            <input
              type="file"
              name
              value
              class="form-control"
              placeholder="Driver Photo"
              accept="image/*"
              id="driPicImg"
              style="display:none;"
              @change="upload('driPicImg');"
            />
          </div>

          <label for="driDlNumber">Driving License Number</label>
          <input
            type="text"
            name
            value
            class="form-control"
            placeholder="Driving License Number"
            id="driDlNumber"
          />

          <label for="driLocation">Location</label>
          <input
            type="text"
            name
            value
            class="form-control"
            placeholder="Operation Location"
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
          >Cancel</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            id="createDiverOwnerButton"
            @click="createOwnerDriver()"
          >Submit</button>
        </div>
      </div>
    </modal>
    <modal name="driver-invite-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modLabel">Driver Details</h5>
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
          >Cancel</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#fabConfirm"
            data-dismiss="modal"
            @click="confirmDriver();"
          >Request Driver</button>
        </div>
      </div>
    </modal>
    <modal name="confirm-driver-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title" id="arLabel">Confirm Driver Request</span>
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
          >Are you sure you want to request the driver with phone number {{ this.driverTel }} ?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="cancCancel"
            @click="hide('invite-cancel-modal')"
          >Back</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-dismiss="modal"
            id="cancConfirm"
            @click="inviteDriver()"
          >Confirm driver</button>
        </div>
      </div>
    </modal>
    <modal name="invite-cancel-modal" :height="250" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title" id="arLabel">Confirm Allocation Cancel</span>
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
          <span id="confDes">Are you sure you want to cancel this invite?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="cancCancel"
            @click="hide('invite-cancel-modal')"
          >Back</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-dismiss="modal"
            id="cancConfirm"
            @click="cancelInvite()"
          >Cancel Invite</button>
        </div>
      </div>
    </modal>
    <modal name="add-vehicle-modal" :height="'90%'" :width="'70%'" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mLabel">Add Vehicle</h5>
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
          <div class="form--input-wrap">
            <label for="selVendor">Is this a bike, van, truck or something else?</label>
            <select class="form-control" id="selVendor" v-model="vendorType">
              <option value="1" selected>Bike</option>
              <option value="2">Pickup</option>
              <option value="3">Van</option>
              <option value="12">Tuk Tuk</option>
              <option value="6">3T Truck</option>
              <option value="10">5T Truck</option>
              <option value="13">7T Truck</option>
              <option value="14">10T Truck</option>
              <option value="17">14T Truck</option>
              <option value="25">Freight (Over 18 Tonnes)</option>
            </select>
          </div>

          <div
            class="form--input-wrap"
            v-show="truckVendors.includes(parseInt(computedVendorType,10))"
          >
            <label for="selCarrierType">What is the Type of your Truck?</label>
            <select class="form-control" id="selCarrierType" v-model="carrierType">
              <option value="0" selected>Open</option>
              <option value="1">Closed/Boxed body</option>
              <option value="3">Refrigerated</option>
              <option value="4">Flatbed/Skeleton</option>
              <option value="5">Tipper</option>
              <option value="6">Reefer</option>
              <option value="7">Highside</option>
            </select>
          </div>
          <div class="form--input-wrap" v-show="parseInt(computedVendorType, 10) === 25">
            <label for="selTruckSize">What is the Size of your Truck?</label>
            <input
              type="number"
              min="18"
              max="33"
              class="form-control tonnage-input"
              placeholder="Truck Size"
              id="selTruckSize"
              v-model="truckSize"
              @keyup="matchTruckSize"
              v-mask="'##'"
            />
            <div
              v-show="truckSizeErrorStatus === true"
              class="form--input-wrap validation-error--message"
            >{{ truckValidationErrorMessage }}</div>
          </div>
          <div class="form--input-wrap" v-show="parseInt(computedVendorType, 10) === 25">
            <label for="selLoadCapacity">How many Tonnes can you actually carry?</label>
            <input
              type="text"
              class="form-control tonnage-input"
              placeholder="Load Capacity"
              id="selLoadCapacity"
              v-model="loadCapacity"
              @keyup="matchLoadCapacity"
              v-mask="'##.##'"
            />
            <div
              v-show="loadCapacityErrorStatus === true"
              class="validation-error--message"
            >{{ validationErrorMessage }}</div>
          </div>

          <div class="form--input-wrap">
            <label for="selMake">What is the make?</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Make"
              id="selMake"
              v-model="make"
            />
          </div>
          <div class="form--input-wrap">
            <label for="selModel">What is the model?</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Model"
              id="selModel"
              v-model="model"
            />
          </div>
          <div class="form--input-wrap">
            <label for="selYear">What is the year of manufacture?</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Year"
              id="selYear"
              v-model="mfg"
            />
          </div>
          <div class="form--input-wrap">
            <label
              for="selBox"
              id="selBoxLabel"
              v-show="parseInt(computedVendorType,10) === 1"
            >Does your bike have a box?</label>
            <select
              v-show="parseInt(computedVendorType,10) === 1"
              class="form-control"
              id="selBox"
              v-model="box"
            >
              <option value="0" selected>No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div class="form--input-wrap">
            <label
              for="selFridge"
              id="selFridgeLabel"
              v-show="computedVendorType > 1 && computedVendorType < 25 "
            >Is your vehicle covered or open?</label>
            <select
              class="form-control"
              id="selFridge"
              v-model="covered"
              v-show="computedVendorType > 1 && computedVendorType < 25 "
            >
              <option value="0" selected>Open</option>
              <option value="1">Covered</option>
            </select>
          </div>
          <div class="form--input-wrap">
            <label for="selLog">Enter Log Book Number</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Log Book Number"
              id="selLog"
              v-model="logBook"
            />
          </div>
          <div class="form--input-wrap">
            <label for="selReg">Enter Registration Number</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Registration Number"
              id="selReg"
              v-model="regNo"
            />
          </div>
          <div class="form--input-wrap">
            <label for="selInsu">Enter Insurance Number</label>
            <input
              type="text"
              name
              value
              class="form-control"
              placeholder="Insurance Number"
              id="selInsu"
              v-model="insuNo"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary modBtn"
            data-dismiss="modal"
            id="clearInp"
            @click="$modal.hide('add-vehicle-modal')"
          >Cancel</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            id="addNext"
            @click="logDocs();"
            :disabled="tonnageValidity() !== true"
          >Next</button>
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
          <h5 class="modal-title" id="odLabel">Vehicle Documents</h5>
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
            <div class="vehicles__doccard-text">Upload Log Book Image</div>
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
              >Click here to upload image</button>
            </div>

            <input
              type="file"
              name
              value
              class="form-control"
              placeholder="Log Book"
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
          >Back</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#vehUpModal"
            data-dismiss="modal"
            id="lgNext"
            disabled
            @click="nextModal('vehicle-documents-modal', 'vehicle-image-modal')"
          >Next</button>
        </div>
      </div>
    </modal>
    <modal name="vehicle-image-modal" :height="400" :width="500" transition="slide" :pivot-y="0">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="odLabel">Vehicle Documents</h5>
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
            <div class="vehicles__doccard-text">Upload Vehicle Image</div>
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
              >Click here to upload image</button>
            </div>
            <input
              type="file"
              name
              value
              class="form-control"
              placeholder="Vehicle Image"
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
          >Back</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            data-toggle="modal"
            data-target="#vehAddModal"
            data-dismiss="modal"
            id="vehFin"
            disabled
            @click="nextModal('vehicle-image-modal', 'confirm-documents-modal')"
          >Confirm</button>
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
          <h5 class="modal-title" id="vehAddLabel">Confirm Vehicle Addition</h5>
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

          <div class="vehicles__addc-title">Please confirm that the following details are correct</div>
          <div class="row vehicles__addc-content">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <p class="color-black font-14">
                Vehicle Type :
                <span id="addcVend" class="color-black font-14">{{ vendorName }}</span>
              </p>
              <p class="color-black font-14">
                Make :
                <span id="addcMake" class="color-black font-14">{{ make }}</span>
              </p>
              <p class="color-black font-14">
                Model :
                <span id="addcModel" class="color-black font-14">{{ model }}</span>
              </p>
              <p class="color-black font-14">
                Model Year :
                <span id="addcYear" class="color-black font-14">{{ mfg }}</span>
              </p>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <p id="addcBoxDes" class="color-black font-14">
                Box :
                <span id="addcBox" class="color-black font-14">{{ boxOption }}</span>
              </p>
              <p class="color-black font-14">
                Registration :
                <span id="addcReg" class="color-black font-14">{{ regNo }}</span>
              </p>
              <p class="color-black font-14">
                Log Book Number :
                <span id="addcLogno" class="color-black font-14">{{ logBook }}</span>
              </p>
              <p class="color-black font-14">
                Insurance Number :
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
          >Back</button>
          <button
            type="button"
            class="btn btn-primary modBtn"
            id="endAdd"
            @click="sendDocuments()"
          >Finish</button>
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
            :title="`Vehicles for ${this.sessionInfo.name}`"
            v-if="rows"
            :per-page="[10, 20, 30, 40, 50]"
            :default-per-page="10"
            :clickable="false"
            :sortable="true"
            :exact-search="true"
            :exportable="true"
          ></datatable>
        </table>
      </div>
      <div class="printContain hidden-md-up" v-for="row in rows" :key="row.registration_no" v-else>
        <div class="table-responsive mobile-table">
          <div class="row-mobile">
            <div class="thead-mobile">Make</div>
            <div class="thead-mobile-row">{{ row.make }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Model</div>
            <div class="thead-mobile-row">{{ row.model }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Registration No</div>
            <div class="thead-mobile-row">{{ row.registration_no }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Active Driver Name</div>
            <div class="thead-mobile-row">{{ row.name }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Active Driver Phone</div>
            <div class="thead-mobile-row">{{ row.phone_no }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Active Driver Balance</div>
            <div class="thead-mobile-row">{{ row.rb }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Invited Driver</div>
            <div class="thead-mobile-row">{{ row.rider_phone }}</div>
          </div>
          <div class="row-mobile">
            <div class="thead-mobile">Options</div>
            <!--eslint-disable-next-line-->
            <div class="thead-mobile-row" v-html="row.options"></div>
          </div>
        </div>
      </div>
      <div class="fab-container">
        <div class="fab">
          <div class="fab-buttons" @click="showVehicleModal()">
            <span class="fab-buttons__link" data-tooltip="Add Vehicle" @click="showVehicleModal()">
              <p class="vehicle-tool-tip">Add vehicle</p>
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
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';
import truckValidationMixin from '../mixins/truckValidationMixin';

let s3 = '';

export default {
  title: 'Partner Portal - Vehicles',
  components: {
    VueTelInput,
    verifier,
    datatable: DataTable,
    errorHandler,
  },
  mixins: [truckValidationMixin],
  data() {
    return {
      carrierType: 2,
      truckVendors: [6, 10, 13, 14, 17, 25],
      vendorName: '',
      vendorType: 1,
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
        },
      },
      columns: [{ label: '', field: 'first' }, { label: 'Make', field: 'make' }, { label: 'Model', field: 'model' }, { label: 'Registration', field: 'registration_no' }, { label: 'Active Driver Phone', field: 'phone_no' }, { label: 'Active Driver Name', field: 'name' }, { label: 'Invited Driver', field: 'rider_phone' }, { label: 'Driver Balance', field: 'rb' }, { label: 'Options', field: 'options', html: true }],
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
        placeholder: 'Enter a phone number',
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
    };
  },
  computed: {
    computedVendorType() {
      return this.vendorType;
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
      const riderIds = [];
      this.sessionInfo.riders.forEach((row, i) => {
        riderIds.push(parseInt(row.rider_id, 10));
      });
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      this.rows = [];
      this.displayFetchingStatus('Fetching vehicles', 0);
      axios
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/vehicles`, payload, this.config)
        .then(response => {
          if (response.data.msg) {
            this.removeFetchingStatus();
            this.populateTable(response);
            document.body.addEventListener('click', this.logger);
          } else {
            this.rows = [];
            this.displayFetchingStatus('No vehicles found', 0);
          }
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    populateTable(response) {
      const record = [];
      response.data.msg.forEach((row, i) => {
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
        if (row.allocation && row.allocation[0].allocation_status === '1') {
          riderRow.action = `<span class="cancel-allocation" id="${row.allocation[0].temp_rider_allocation_id}">Cancel allocation</span>`;
        } else {
          riderRow.action = `<span class="reassign-driver" id="${row.vehicle.id}">Reassign driver</span>`;
        }
      } else {
        if (row.allocation && row.allocation[0].allocation_status === '1') {
          riderRow.action = `<span class="cancel-allocation" id="${row.allocation[0].temp_rider_allocation_id}">Cancel allocation</span>`;
        } else {
          riderRow.action = `<span class="add-driver" id="${row.vehicle.id}">Add driver</span>`;
        }
      }
      return riderRow;
    },
    sortAllocationStatus(row) {
      let allocationRow = [];
      let invitedPhone = '';
      if (row.allocation) {
        allocationRow = row.allocation[0];
        if (allocationRow.allocation_status === '1') {
          invitedPhone = `${allocationRow.rider_phone} (Pending)`;
        } else if (allocationRow.allocation_status === '2') {
          invitedPhone = `${allocationRow.rider_phone} (Accepted)`;
        } else if (allocationRow.allocation_status === '3') {
          invitedPhone = `${allocationRow.rider_phone} (Rejected)`;
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
          .html('Please enter all details')
          .fadeIn('slow');
        setTimeout(() => {
          $('#upErr4').fadeOut('slow');
        }, 5000);
      }
    },
    sendDocuments() {
      const payload = {
        carrier_type: this.carrierType,
        load_capacity: this.loadCapacity,
        vehicle_size: this.truckSize,
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
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/add_vehicle`, payload, this.config)
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
          } else {
            $('#upErr5')
              .html(`Something went wrong while adding the vehicle. Please try again. ${response.data.msg}.`)
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr5').fadeOut('slow');
            }, 5000);
          }
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    upload(id) {
      const files = document.getElementById(id)['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
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
      $(`#${className}`).html('Uploading...');
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
      $(`#${id}`).html('Click here to change image');
      $(`#${button}`)
        .prop('disabled', false)
        .css('background-color', '#f57f20');
      $(`#${id}`).prop('disabled', false);
    },
    failedLabelReset(id, button) {
      $(`#${id}`).html('Image upload failed, please try again');
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
            .html('Please enter a valid phone number')
            .fadeIn('slow');
          setTimeout(() => {
            $('#upErr2').fadeOut('slow');
          }, 5000);
        }
      } else {
        $('#upErr2')
          .html('Please enter a phone number<br>')
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
        .html('Sending driver invite.')
        .fadeIn('slow');
      axios
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/allocate_rider`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            $('#upErr2').fadeOut('slow');
            this.$modal.hide('confirm-driver-modal');
            this.fetchVehicles();
          } else {
            $('#upErr2').fadeOut('slow');
            $('#upErr2')
              .html(response.data.msg)
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr2').fadeOut('slow');
            }, 3000);
          }
        })
        .catch(() => {
          this.errorObj = error.response;
        });
    },
    cancelInvite() {
      const payload = {
        temp_rider_allocation_id: this.cancelAllocationId,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/cancel_allocation`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            this.$modal.hide('invite-cancel-modal');
            this.fetchVehicles();
          } else {
            $('#upErr3').fadeOut('slow');
            $('#upErr3')
              .html(response.data.msg)
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr3').fadeOut('slow');
            }, 3000);
          }
        })
        .catch(() => {
          this.errorObj = error.response;
        });
    },
    createOwnerDriver() {
      let photo = $('#driPicPreview').attr('src');
      const dl_no = $('#driDlNumber').val();
      const neighborhood = $('#driLocation').val();
      if (photo === '' || dl_no === '' || neighborhood === '' || photo.includes('grey_bg_01')) {
        $('#upErr')
          .text('Please fill all the fields')
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
        .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/create_owner_rider`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            this.$modal.hide('driver-owner-modal');
            this.fetchVehicles();
          } else {
            $('#upErr')
              .html(response.data.msg)
              .fadeIn('slow');
            setTimeout(() => {
              $('#upErr').fadeOut('slow');
            }, 3000);
          }
        })
        .catch(() => {
          this.errorObj = error.response;
        });
    },
    showVehicleModal() {
      this.$modal.show('add-vehicle-modal');
    },
  },
};
</script>

<style scoped>
.validation-error--message {
  color: #f17f3a;
}
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
.form-control {
  display: block;
  width: 100%;
  height: 38px;
  margin-bottom: 10px;
}
.modal-body label {
  color: #333;
  font-weight: 400;
}
</style>
