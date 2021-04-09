<template>
  <div class="pending-requests-containers" v-loading="loadingStatus">
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="fuel-blinder" v-if="approvalStatus === false">
      <div class="fuel-request-rejection-dialogue">
        <div class="fuel-request-close-icon" @click="approvalStatus = ''"><i class="fa fa-times"></i></div>
        {{ $t('fuelPending.about_reject_request') }} <br /> {{ $t('fuelPending.please_add_reason') }}
        <el-select class="fuel-request-reason-input" v-model="rejectReason">
          <el-option v-for="(reason, index) in reasons" :key="index" :value="reason" :label="reason"></el-option>
        </el-select>
        <button :class="rejectReason !== '' && loading === false ? 'fuel-request-reason-button-active' : 'fuel-request-reason-button-inactive'" @click="actionFuelAdvance(rowIndex)">{{ $t('fuelPending.confirm') }}</button>
      </div>
    </div>
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="pending-requests-tabs"
      @click="rowIndex = index"
    >
      <div class="pending-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="pending-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="pending-requests-driver-photo"
        />
        <div class="pending-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="pending-requests-driver-name">
          {{ order.driver_details.vehicle_no }}
        </div>
        <div class="pending-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="pending-requests-actions">
        <div class="pending-requests-actions-menu">
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'details'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'details')"
          >
            {{ $t('fuelPending.details') }}
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'action' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'action')"
          >
            {{ $t('fuelPending.action') }}
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'edit' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'edit')"
          >
            {{ $t('fuelPending.edit') }}
          </div>
          <div
            class="pending-requests-actions-menu-items"
            v-if="order.request_details.advanced"
            :class="
              order.activeMenuTab === 'advanced'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'advanced')"
          >
            {{ $t('fuelPending.fuel_advanced') }}
          </div>
        </div>
        <div class="pending-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="pending-requests-actions-table-header">
              <div class="pending-requests-large-column">{{ $t('fuelPending.order') }}</div>
              <div class="pending-requests-standard-column">{{ $t('fuelPending.amount') }}</div>
              <div class="pending-requests-standard-column">{{ $t('fuelPending.station') }}</div>
              <div class="pending-requests-standard-column">{{ $t('fuelPending.fuel_type') }}</div>
              <div class="pending-requests-standard-column">{{ $t('fuelPending.order_type') }}</div>
              <div class="pending-requests-standard-column">{{ $t('fuelPending.percentage') }}</div>
            </div>
            <div class="pending-requests-actions-table-body">
              <div class="pending-requests-large-column">
                <div class="pending-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="pending-requests-pickup">
                  <div class="pending-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="pending-requests-destination">
                  <div class="pending-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'edit'"
            class="pending-requests-edit"
          >
            <div class="pending-requests-edit-top">
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">{{ $t('fuelPending.fuel_amount') }}</span><br />
                <input
                  type="text"
                  class="pending-requests-edit-inputs"
                  v-model="editData[index].request_details.amount"
                  :disabled="order.owner_details.status !== 'pending' || maxFuelAmount === 0"
                  @input="regulateAmount(index)"
                />
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">{{ $t('fuelPending.fueling_station') }}</span><br />
                <select
                  name="station"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="editData[index].request_details.station"
                  @change="
                    changeAddresses(order.request_details.station, index)
                  "
                  :disabled="order.owner_details.status !== 'pending'"
                >
                  <option
                    :value="station.station_name"
                    v-for="(station, index) in stations"
                    :key="index"
                    :label="station.station_name"
                    >{{ station.station_name }}</option>
                </select>
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">{{ $t('fuelPending.station_address') }}</span><br />
                <select
                  name="address"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="editData[index].request_details.address"
                  :disabled="order.owner_details.status !== 'pending'"
                >
                  <option
                    :value="address.name"
                    v-for="(address, index) in addresses"
                    :key="index"
                    :label="address.name"
                    >{{ address.name }}</option>
                </select>
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">{{ $t('fuelPending.fuel_type') }}</span><br />
                <select
                  name="fuel"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="editData[index].request_details.fuel_type"
                  :disabled="order.owner_details.status !== 'pending'"
                >
                  <option
                    :value="fuel.name"
                    v-for="(fuel, index) in fuel_types"
                    :key="index"
                    :label="fuel.name"
                    >{{ fuel.name }}</option></select>
              </div>
            </div>
            <div class="pending-requests-edit-bottom">
              <div v-if="rowIndex === index" class="edit-amount-message">
                {{ editMessage }}
              </div>
              <button class="fuel-submit-override" v-loading="loading && rowIndex === index" :class="!loading && validate(index) ? 'fuel-request-reason-button-active' : 'fuel-request-reason-button-inactive'" @click="editFuelAdvance(index)">Update</button>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'action'"
            class="pending-requests-owner-container"
          >
            <div v-if="editData[index].owner_details.status === 'pending'">
              <div
                class="pending-requests-owner-details approved-question-override"
              >
                {{ $t('fuelPending.confirm_request') }}
              </div>
              <div>
                <input
                  type="radio"
                  id="owner-approval-yes"
                  class="pending-requests-spacer-2"
                  :value="true"
                  v-model="approvalStatus"
                  @change="rowIndex = index"
                />
                <span class="pending-requests-spacer-1">{{ $t('fuelPending.yes') }}</span>
                <input
                  type="radio"
                  id="owner-approval-no"
                  class="pending-requests-spacer-2"
                  :value="false"
                  v-model="approvalStatus"
                  @change="rowIndex = index"
                />
                <span class="pending-requests-spacer-1">{{ $t('fuelPending.no') }}</span>
                <button :class="approvalStatus === true && loading === false ? 'fuel-request-reason-button-active' : 'fuel-request-reason-button-inactive'" v-loading="loading && rowIndex === index" @click="actionFuelAdvance(index)">{{ $t('fuelPending.update') }}</button>
              </div>
            </div>
            <div v-else>
              <span class="approved-fuel-request" v-if="editData[index].owner_details.status === 'approved'">{{ $t('fuelPending.approve_request') }}</span>
              <span class="rejected-fuel-request" v-if="editData[index].owner_details.status === 'rejected'">{{ $t('fuelPending.reject_request') }}</span>
              <span class="edit-action-input" @click="editData[index].owner_details.status = 'pending'">{{ $t('fuelPending.edit_action') }}</span>
            </div>
          </div>
          <div v-if="order.activeMenuTab === 'advanced'">
            <div class="pending-requests-actions-table-header">
              <div class="pending-requests-standard-column-adv">DD/TT</div>
              <div class="pending-requests-large-column-adv">{{ $t('fuelPending.order') }}</div>
              <div class="pending-requests-standard-column-adv">{{ $t('fuelPending.amount') }}</div>
              <div class="pending-requests-standard-column-adv">{{ $t('fuelPending.station') }}</div>
              <div class="pending-requests-standard-column-adv">{{ $t('fuelPending.fuel_type') }}</div>
              <div class="pending-requests-standard-column-adv">{{ $t('fuelPending.order_type') }}</div>
              <div class="pending-requests-standard-column-adv">{{ $t('fuelPending.percentage') }}</div>
            </div>
            <div class="pending-requests-actions-table-body">
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ dateFormat(order.request_details.advanced.request_details.date_time) }}
              </div>
              <div class="pending-requests-large-column-adv">
                <div class="pending-requests-orderno">
                  {{ order.request_details.advanced.request_details.order_no }}
                </div>
                <div class="pending-requests-pickup">
                  <div class="pending-requests-pickup-indicator"></div>
                  {{ order.request_details.advanced.request_details.pick_up }}
                </div>
                <div class="pending-requests-destination">
                  <div class="pending-requests-destination-indicator"></div>
                  {{ order.request_details.advanced.request_details.destination }}
                </div>
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.advanced.request_details.currency }}
                {{ thousandsSeparator(order.request_details.advanced.request_details.amount) }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.advanced.request_details.station }}<br />({{
                  order.request_details.advanced.request_details.address
                }})
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.advanced.request_details.fuel_type }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.advanced.request_details.order_type.charAt(0).toUpperCase() + order.request_details.advanced.request_details.order_type.slice(1).split('_')[0] }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.advanced.request_details.percentage }} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="orders.length === 0 && !loadingStatus" class="no-requests-tab">
      {{ $t('fuelPending.no_requests') }}
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import notify from '../../../../components/notification';
import errorHandler from '../../../../components/errorHandler';
import verifier from '../../../../components/verifier';

let timer = '';

export default {
  components: {
    notify,
    errorHandler,
    verifier,
  },
  data() {
    return {
      orders: [],
      auth: process.env.VUE_APP_AUTH,
      loadingStatus: false,
      stations: [],
      fuel_types: [],
      addresses: [],
      rejectReason: '',
      reasons: [
        this.$t('fuelPending.has_fuel'),
        this.$t('fuelPending.other_reason'),
      ],
      sessionInfo: '',
      approvalStatus: '',
      rowIndex: '',
      editData: [],
      loading: false,
      errorObj: '',
      maxFuelAmount: 0,
      editMessage: '',
      fetchStatus: false,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      pollActive: false,
    };
  },
  watch: {
    orders: {
      handler(after, before) {
        // console.log(before);
        // console.log(after);
      },
      deep: true,
    },
    rowIndex(val) {
      if (this.orders[val].activeMenuTab === 'edit' && !this.fetchStatus) {
        this.fetchMaxAdvance(this.editData[val].request_details.order_no, val);
      }
    },
    pollActive(val) {
      if (val) {
        this.poll();
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.loadingStatus = true;
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.getFuelStations();
      this.getFuelTypes();
      this.getFuelAdvances();
      this.pollActive = true;
    }
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    changeTab(index, data) {
      if (data === 'edit') {
        this.addresses = this.stations.find(stn => (
            stn.station_name === this.editData[index].request_details.station
          ));
          if (this.addresses) {
            this.addresses = this.addresses.station_addresses;
          }
        setTimeout(() => {
          const addressVal = this.addresses.find(stn => (
            stn.name === this.editData[index].request_details.station
          ));
          if (!addressVal) {
            this.editData[index].request_details.address = this.addresses.length > 0 ? this.addresses[0].name : '';
          } else {
            this.editData[index].request_details.address = addressVal.name;
          }
        }, 500);
        this.fetchMaxAdvance(this.editData[index].request_details.order_no, index);
      }
      this.orders[index].activeMenuTab = data;
    },
    regulateAmount(index) {
      if (this.editData[index].request_details.amount > this.maxFuelAmount) {
        this.editData[index].request_details.amount = this.maxFuelAmount;
      }
    },
    thousandsSeparator(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    changeAddresses(station, index) {
      const addresses = this.stations.find(stn => stn.station_name === this.editData[index].request_details.station);
      this.addresses = addresses.station_addresses;
      this.editData[index].request_details.address = this.addresses.length > 0 ? this.addresses[0].name : '';
    },
    validate(index) {
      const data = this.editData[index].request_details;
      if (this.orders[index].owner_details.status === 'pending' && data.fuel_type && data.amount && data.station && data.address) {
        return true;
      }
      return false;
    },
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    fetchMaxAdvance(order, index) {
      return new Promise((resolve, reject) => {
        this.editMessage = '';
        this.fetchStatus = true;
        axios
            .get(`${this.auth}adonis/aux/fuel/max-advance/${order}`, this.config)
            .then(response => {
              this.fetchStatus = false;
              if (response.status === 200) {
                this.maxFuelAmount = response.data.data.available_advance + this.orders[index].request_details.amount;
                this.editMessage = `${this.$t('fuelPending.max_amount_edit')} ${response.data.data.available_advance + this.orders[index].request_details.amount}`;
              }
            resolve(response);
            })
            .catch(error => {
              this.fetchStatus = false;
              this.errorObj = error.response;
              this.maxFuelAmount = 0;
              this.editMessage = this.$t('fuelPending.total_amount_reached');
            resolve(error);
            });
        });
    },
    getFuelStations() {
      return new Promise((resolve, reject) => {
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-stations`, this.config)
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
    getFuelAdvances() {
      return new Promise((resolve, reject) => {
        const oldOrders = this.orders;
        axios
            .get(`${this.auth}adonis/aux/fuel/fuel-advances?owner_id=${this.sessionInfo.id}&pending=0`, this.config)
            .then(response => {
              if (response.status === 200) {
                const rawData = response.data.data;
                this.editData = [];
                rawData.forEach((row, i) => {
                  row.activeMenuTab = oldOrders.length > 0 && oldOrders.length > i ? oldOrders[i].activeMenuTab : 'details';
                  row.request_details.order_type = row.request_details.order_type.charAt(0).toUpperCase() + row.request_details.order_type.slice(1).split('_')[0];
                  this.editData.push({
                    request_details: {
                      fuel_type: row.request_details.fuel_type,
                      amount: row.request_details.amount,
                      station: row.request_details.station,
                      address: row.request_details.address,
                      order_no: row.request_details.order_no,
                    },
                    owner_details: {
                      status: row.owner_details.status,
                    },
                  });
                  if (row.activeMenuTab === 'edit') {
                    this.changeTab(i, 'edit');
                  }
                });
                this.loadingStatus = false;
                this.orders = rawData;
              }
            resolve(response);
            })
            .catch(error => {
              this.loadingStatus = false;
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    poll() {
      if (this.pollActive) {
        timer = setTimeout(() => {
          this.getFuelAdvances();
          this.poll();
        }, 60000);
      }
    },
    actionFuelAdvance(index) {
      return new Promise((resolve, reject) => {
        this.rowIndex = index;
        const payload = {
          owner_id: parseInt(this.sessionInfo.id, 10),
          order_no: this.orders[this.rowIndex].request_details.order_no,
          approval_status: this.approvalStatus ? 1 : 2,
          fuel_advance_id: this.orders[this.rowIndex].request_details.fuel_advance_id,
        };
        if (!this.approvalStatus) {
          payload.reason = this.rejectReason;
        }
        this.loading = true;
        axios
            .post(`${this.auth}orders/v1/aux/owner_approve_fuel_advance`, payload, this.config)
            .then(response => {
              this.loading = false;
              if (response.status === 200) {
                if (!this.approvalStatus) {
                  this.loadingStatus = true;
                  this.orders = [];
                }
                this.notify(3, 1, response.data.message);
                this.approvalStatus = '';
                this.getFuelAdvances();
              }
            resolve(response);
            })
            .catch(error => {
              this.loading = false;
              this.notify(3, 0, `${this.$t('fuelPending.failed_action')}: ${error.response.data.message}`);
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
    editFuelAdvance(index) {
      return new Promise((resolve, reject) => {
        this.rowIndex = index;
        const fuelVal = this.fuel_types.find(fl => (
          fl.name === this.editData[this.rowIndex].request_details.fuel_type
        )).id;
        const addressVal = this.addresses.find(stn => (
          stn.name === this.editData[this.rowIndex].request_details.address
        )).id;
        const payload = {
          order_no: this.orders[this.rowIndex].request_details.order_no,
          fuel_station_id: addressVal,
          fuel_type: fuelVal,
          amount: parseFloat(this.editData[this.rowIndex].request_details.amount),
          fuel_advance_id: this.orders[this.rowIndex].request_details.fuel_advance_id,
        };
        this.loading = true;
        axios
            .post(`${this.auth}orders/v1/aux/edit_fuel_advance`, payload, this.config)
            .then(response => {
              this.loading = false;
              if (response.status === 200) {
                this.notify(3, 1, response.data.message);
                this.approvalStatus = '';
                this.getFuelAdvances();
              }
            resolve(response);
            })
            .catch(error => {
              this.loading = false;
              this.notify(3, 0, `${this.$t('fuelPending.failed_edit')}:: ${error.response.data.message}`);
              this.errorObj = error.response;
            resolve(error);
            });
        });
    },
  },
};
</script>

<style></style>
