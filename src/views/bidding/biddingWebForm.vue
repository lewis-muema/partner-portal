<template>
  <div id="bidding">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <!-- CONFIRMATION MODAL -->
    <div class="modal-container">
      <modal name="bid-details-modal" class="bid-details-modal" :height="500" transition="slide" :pivot-y="0.3" :pivot-x="0.65">
        <div class="card">
          <div class="card-head">
            <h1 class="card-heading">{{ $t('biddingWebForm.confirm_offer') }}</h1>
            <button class="close" data-dismiss="modal" aria-label="Close" @click="hide('bid-details-modal')">
              <i class="fas fa-times icon"></i>
            </button>
          </div>
          <h2 class="card-subheading">{{ $t('biddingWebForm.how_many_trucks') }}</h2>
          <p class="card-content">{{ bidDetails.available_trucks }} {{ $t('biddingWebForm.trucks') }}</p>
          <div v-if="formData.is_negotiable === false">
            <h2 class="card-subheading">{{ $t('biddingWebForm.clients_price_offer_per_truck') }}</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ formData.offer_amount }}
            </p>
            <h2 class="card-subheading">{{ $t('biddingWebForm.total_shipment_amount') }}</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * formData.offer_amount }}
            </p>
          </div>
          <div v-else>
            <h2 class="card-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.amount_per_truck }}
            </p>
            <h2 class="card-subheading">{{ $t('biddingWebForm.total_shipment_amount') }}</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * bidDetails.amount_per_truck }}
            </p>
          </div>
          <div v-if="rejectBid" class="btns">
            <input @click="rejectOffer" type="button" value="Reject Offer" class="reject-btn" />
            <p class="edit-btn orange" @click="hide('bid-details-modal')">{{ $t('biddingWebForm.edit_bid') }}</p>
          </div>

          <div v-else class="btns">
            <input @click="bidOffer" type="button" value="Confirm Offer" class="submit-btn" />
            <p class="edit-btn orange" @click="hide('bid-details-modal')">{{ $t('biddingWebForm.edit_bid') }}</p>
          </div>
        </div>
      </modal>
    </div>
    <!-- BID SUCCESS MESSAGE -->
    <div class="bid-status-ok">
      <div class="bid-web-form">
        <div v-if="!rejected" v-show="success" class="success-card">
          <div>
            <span @click="success = false"> <i class="fas fa-check-circle"></i> </span>
            <span class="success-message">{{ $t('biddingWebForm.bid_successfully_submitted') }} </span>
          </div>
          <span @click="success = false"> <i class="fas fa-times"></i> </span>
        </div>

        <!-- BID DETAILS -->
        <h1 class="bid-heading">{{ $t('biddingWebForm.shipment_details') }}</h1>
        <div class="bid" v-if="Object.keys(formData).length > 0">
          <div class="bid-header">
            <div class="bid-map">
              <img :src="createStaticMapUrl()" class="map" />
            </div>
          </div>

          <div class="bid-details">
            <div class="bid-details-shipment">
              <div class="bid-information">
                <div v-if="formData.quotation.status === 1"><p title="Hang tight! your bid is yet to be reviewed" class="status status-review">Under Review</p></div>
                <div v-else-if="formData.quotation.status === 2">
                  <p class="status status-awarded">{{ $t('biddingWebForm.awarded') }}</p>
                </div>
                <div v-else-if="formData.quotation.status === -1">
                  <p class="status status-rejected">{{ $t('biddingWebForm.failed') }}</p>
                </div>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.pickup') }}</h2>
                <p class="bid-details-content">{{ formData.pickup.name }}</p>
                <h2 class="bid-details-content">{{ $t('biddingWebForm.load_picked_at') }} {{ formData.pickup_facility }}</h2>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.destination') }}</h2>
                <p class="bid-details-content">{{ formData.destination.name }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.type_of_load') }}</h2>
                <p class="bid-details-content">{{ formData.carrier_type }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.date_of_pickup') }}</h2>
                <p class="bid-details-content">{{ formData.pickup_time }}</p>
              </div>
              <hr />

              <div class="bid-details-truck">
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.number_of_trucks_wanted') }}</h2>
                <p class="bid-details-content">{{ formData.total_trucks }} {{ $t('biddingWebForm.trucks') }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.type_of_truck') }}</h2>
                <p class="bid-details-content">{{ formData.cargo_type }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.weight_of_load') }}</h2>
                <p class="bid-details-content">{{ formData.tonnes_per_truck }} {{ $t('biddingWebForm.tonnes') }}</p>

                <div v-if="formData.cargo_type_options.length > 1">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.return_container') }}</h2>
                  <p class="bid-details-content">{{ formData.cargo_type_options[0].value === true ? this.$t('biddingWebForm.yes_container_returned') : this.$t('biddingWebForm.no_containers_returned') }}</p>
                  <p class="bid-details-subheading">Number of 20ft containers being moved</p>
                  <h2 class="bid-details-content">{{ formData.cargo_type_options[1].value }}</h2>
                  <p class="bid-details-subheading">Number of 40ft containers being moved</p>
                  <h2 class="bid-details-content">{{ formData.cargo_type_options[2].value }}</h2>
                </div>
                <div v-if="formData.offer_amount > 0 && formData.is_negotiable">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.clients_price_offer') }}</h2>
                  <p class="bid-details-content">{{ formData.currency }} {{ formData.offer_amount }}</p>
                </div>
              </div>
            </div>

            <hr />
            <!-- Bidding section -->
            <!-- Initial bid -->
            <div v-if="initialSubmit === true && rejected === false">
              <h2 class="bid-submitted-heading">{{ $t('biddingWebForm.your_bids') }}</h2>
              <h2 class="bid-details-subheading">{{ $t('biddingWebForm.trucks_available') }}</h2>
              <p class="bid-details-content">{{ bidInfo.available_trucks }} {{ bidInfo.available_trucks === 1 ? 'Truck' : 'Trucks' }}</p>
              <h2 class="bid-details-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
              <div v-if="formData.is_negotiable === false">
                <p class="bid-details-content">{{ formData.currency }} {{ formData.offer_amount }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ bidInfo.available_trucks * formData.offer_amount }}</p>
              </div>
              <div v-else>
                <p class="bid-details-content">{{ formData.currency }} {{ bidInfo.amount_per_truck }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ bidInfo.available_trucks * bidInfo.amount_per_truck }}</p>
              </div>
            </div>
            <div v-else-if="rejected">
              <p class="bid-details-content">{{ $t('biddingWebForm.successfully_rejected_bid') }}</p>
              <i>
                <p class="timestamp">{{ $t('biddingWebForm.forfeit_submitted') }} {{ formData.quotation.date_created }}</p>
              </i>
            </div>
            <!-- BID IS NEGOTIABLE AND HAS OFFER AMOUNT OR WHEN THERE IS NO OFFER_AMOUNT  -->
            <div v-else-if="formData.quotation.status === 0">
              <div class="bid-details" v-if="formData.status === 0">
                <div v-if="(formData.is_negotiable && formData.offer_amount > 0) || formData.offer_amount === null" class="bid-section">
                  <h2 class="bid-details-heading">{{ $t('biddingWebForm.enter_your_bid') }}</h2>
                  <div class="bidding-form">
                    <h2 class="bid-details-content">{{ $t('biddingWebForm.trucks_available') }}</h2>
                    <small class="truck-validate" v-show="truckValidate"> {{ $t('biddingWebForm.truck_cannot_be_less') }}</small>
                    <div class="bidding-form-trucks">
                      <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="truckValidation" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                      <input class="bidding-form-trucks-input" type="text" :value="bidDetails.available_trucks" placeholder="0" />
                      <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                    </div>
                  </div>
                  <div class="bidding-amount">
                    <h2 class="bid-details-content">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
                    <div class="bidding-amount-currency-section">
                      <select class="bidding-amount-currency border-radius__left" name="currency" id="currency">
                        <option :value="formData.currency">{{ formData.currency }}</option>
                      </select>
                      <input type="number" v-model="bidDetails.amount_per_truck" class="bidding-amount-input border-radius__right" />
                    </div>
                  </div>
                  <input type="submit" :disabled="(bidDetails.available_trucks && bidDetails.amount_per_truck === null) || (bidDetails.available_trucks && bidDetails.amount_per_truck === '0')" value="Submit Bid" class="submit-btn" @click.prevent="show" />
                </div>

                <!-- BID WHEN OFFER IS NON-NEGOTIABLE AND HAS AN OFFER AMOUNT -->
                <div v-if="formData.offer_amount > 0 && formData.is_negotiable === false">
                  <h2 class="bid-details-heading">{{ $t('biddingWebForm.offer') }}</h2>
                  <p class="bid-details-content">{{ $t('biddingWebForm.clients_price_offer') }}</p>
                  <form>
                    <p class="bid-details-content black">{{ formData.currency }} {{ formData.offer_amount }} {{ $t('biddingWebForm.per_truck') }}</p>
                    <span class="truck-validate" v-show="truckValidate">{{ $t('biddingWebForm.truck_cannot_be_less') }}</span>
                    <div class="bidding-form-trucks">
                      <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="truckValidation" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                      <input class="bidding-form-trucks-input" type="number" v-model="bidDetails.available_trucks" />
                      <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                    </div>

                    <input type="button" :disabled="bidDetails.available_trucks <= 0" value="Accept Offer" class="submit-btn" @click="formValidation" />
                    <p class="bid-ultimatum">{{ $t('biddingWebForm.or') }}</p>
                    <input type="button" :disables="bidDetails.available_trucks === 0" value="Reject Offer" class="reject-btn" @click="rejectedOffer" />
                  </form>
                </div>
              </div>
            </div>
            <div v-else>
              <h2 class="bid-submitted-heading">{{ $t('biddingWebForm.your_bid') }}</h2>

              <div v-if="(formData.is_negotiable === false && formData.quotation.status == -1) || (formData.is_negotiable === null && formData.quotation.status == -1)">
                <p class="bid-details-content">{{ $t('biddingWebForm.successfully_rejected_bid') }}</p>
              </div>

              <div v-else-if="(formData.is_negotiable === false && formData.offer_amount === null) || (formData.is_negotiable === null && formData.offer_amount === null)">
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.trucks_available') }}</h2>
                <p class="bid-details-content">{{ formData.quotation.trucks_available }} {{ formData.quotation.trucks_available === 1 ? 'Truck' : 'Trucks' }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ formData.quotation.price_per_truck }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ formData.quotation.trucks_available * formData.quotation.price_per_truck }}</p>
              </div>

              <div v-else-if="formData.is_negotiable === true && formData.offer_amount > 0">
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.trucks_available') }}</h2>
                <p class="bid-details-content">{{ formData.quotation.trucks_available }} {{ formData.quotation.trucks_available === 1 ? 'Truck' : 'Trucks' }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
                <p class="bid-details-content">
                  <b>{{ formData.currency }}</b> {{ formData.quotation.price_per_truck }}
                </p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">
                  <b>{{ formData.currency }}</b> {{ formData.quotation.trucks_available * formData.quotation.price_per_truck }}
                </p>
              </div>

              <div v-else-if="formData.is_negotiable === false && formData.offer_amount > 0">
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.trucks_available') }}</h2>
                <p class="bid-details-content">{{ formData.quotation.trucks_available }} {{ formData.quotation.trucks_available === 1 ? 'Truck' : 'Trucks' }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
                <p class="bid-details-content">
                  <b>{{ formData.currency }}</b> {{ formData.offer_amount }}
                </p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">
                  <b>{{ formData.currency }}</b> {{ formData.quotation.trucks_available * formData.offer_amount }}
                </p>
              </div>

              <i>
                <p class="timestamp">{{ $t('biddingWebForm.bid_submitted_on') }} {{ this.date }}</p>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import Mixpanel from 'mixpanel';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  title: 'Partner Portal - Freight Bidding Webform',
  components: {
    errorHandler,
    notify,
  },
  data() {
    return {
      auth: process.env.VUE_APP_AUTH,
      negotiable: false,
      bidDetails: {
        amount_per_truck: null,
        available_trucks: 0,
      },
      trucks: 0,
      bid_amount: null,
      total_amount: 0,
      errorMessage: '',
      rejectBid: null,
      rejected: false,
      bidInfo: {},
      submitted: false,
      confirmed: false,
      truckValidate: false,
      initialSubmit: false,
      amountValidate: false,
      success: false,
      date: '',
      errObj: '',
      formData: {},
      requests: {},
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      errorObj: '',
    };
  },
  mounted() {
    if (this.$route.params.shipment_id !== undefined && this.$route.params.owner_id !== undefined) {
      this.getBid();
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    show() {
      this.rejectBid = false;
      this.$modal.show('bid-details-modal');
    },
    hide(name) {
      this.rejectBid = false;
      this.$modal.hide(name);
    },
    truckValidation() {
      this.bidDetails.available_trucks--;
      this.truckValidate = true;
      if (this.bidDetails.available_trucks <= 0) {
        setTimeout(() => {
          this.truckValidate = false;
        }, 2000);
      }
    },
    formValidation() {
      this.acceptOffer();

      if (this.bidDetails.available_trucks <= 0 || this.bidDetails.available_trucks <= 0) {
        this.formValidate = true;
        setTimeout(() => {
          this.amountValidate = false;
        }, 2000);
      }
    },
    submitBid() {
      this.hide('bid-details-modal');
    },
    createStaticMapUrl() {
      const google_key = process.env.GOOGLE_API_KEY;
      const from_cordinates = this.formData.pickup.coordinates;
      const to_cordinates = this.formData.destination.coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=300x250&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    acceptOffer() {
      this.$modal.show('bid-details-modal');
    },
    rejectedOffer() {
      this.$modal.show('bid-details-modal');
      this.rejectBid = true;
    },
    rejectOffer() {
      this.rejected = true;
      this.bidOffer();
    },
    async bidOffer() {
      this.hide('bid-details-modal');
      this.date = new Date().toLocaleString();
      let bidStatus = 0;
      if (this.formData.is_negotiable === false && !this.rejected) {
        bidStatus = 1;
      } else if (this.formData.is_negotiable === false && this.rejected) {
        bidStatus = -1;
      }

      this.bidInfo = {
        quotation_id: parseInt(this.$route.params.shipment_id, 0),
        amount_per_truck: parseInt(this.bidDetails.amount_per_truck, 0),
        available_trucks: this.bidDetails.available_trucks,
        transporter_id: parseInt(this.$route.params.owner_id, 0),
        status: bidStatus,
      };
      const payload = JSON.stringify(this.bidInfo);
      this.initialSubmit = true;
      await axios
        .patch(`${this.auth}freight-service/shipments/quotations?authkey=${process.env.BIDDING_API_KEY}`, payload, this.config)
        .then(res => {
          if (res.status === 200) {
            this.success = true;
          }
        })
        .catch(err => {
          this.errObj = err;
        });
    },
    async getBid() {
      axios
        .get(`${this.auth}freight-service/shipments/quotations/${this.$route.params.shipment_id}/${this.$route.params.owner_id}?authkey=${process.env.BIDDING_API_KEY}`)
        .then(res => {
          this.requests = res;
          this.formData = res.data.data;
          if (this.formData.quotation.status === 0) {
            this.submitted = false;
          } else {
            this.submitted = true;
          }
          if (res.data.quotation.status === 0) {
            mixpanel.track('Shipments Request Viewed', {
              transporterId: parseInt(this.$route.params.owner_id, 0),
              phone: res.data.client_phone,
              email: null,
              name: res.data.quotation.name,
              source: this.$route.query.utm_source,
              shipmentId: parseInt(this.$route.params.shipment_id, 0),
              quotationId: this.data.id,
              pickup: res.data.pickup.name,
              destination: res.destination.name,
              carrierType: res.data.carrier_type,
              cargoType: res.data.cargo_type,
              pickupFacility: res.data.pickup_facility,
              trucksNeeded: res.data.total_trucks,
              clientType: 'Web',
              device: this.$route.query.utm_source === email ? 'email' : 'sms',
            });
          } else if (res.data.quotation.status === 1) {
            mixpanel.track('Bids Placed', {
              transporterId: parseInt(this.$route.params.owner_id, 0),
              phone: res.data.client_phone,
              email: null,
              name: res.data.quotation.name,
              source: this.$route.query.utm_source,
              shipmentId: parseInt(this.$route.params.shipment_id, 0),
              quotationId: this.data.id,
              pickup: res.data.pickup.name,
              destination: res.destination.name,
              carrierType: res.data.carrier_type,
              cargoType: res.data.cargo_type,
              pickupFacility: res.data.pickup_facility,
              trucksNeeded: res.data.total_trucks,
              clientType: 'Web',
              device: this.$route.query.utm_source === email ? 'email' : 'sms',
            });
          } else if (res.data.quotation.status === -1) {
            mixpanel.track('Shipment Request Rejected', {
              transporterId: parseInt(this.$route.params.owner_id, 0),
              phone: res.data.client_phone,
              email: null,
              name: res.data.quotation.name,
              source: this.$route.query.utm_source,
              shipmentId: parseInt(this.$route.params.shipment_id, 0),
              quotationId: this.data.id,
              pickup: res.data.pickup.name,
              destination: res.destination.name,
              carrierType: res.data.carrier_type,
              cargoType: res.data.cargo_type,
              pickupFacility: res.data.pickup_facility,
              trucksNeeded: res.data.total_trucks,
              reason: null,
              reasonId: null,
              clientType: 'Web',
              device: this.$route.query.utm_source === email ? 'email' : 'sms',
            });
          }
        })
        .catch(error => {
          this.errObj = error;
        });
    },
  },
};
</script>

<style>
@import '../../../public/css/bidding.css';
</style>
