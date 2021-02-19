  <template >
  <div id="bidding">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <!-- CONFIRMATION MODAL -->
    <div class="modal-container">
      <modal v-if="rejected" name="bid-details-modal" class="bid-details-modal" :height="270" transition="slide" :pivot-y="0.3" :pivot-x="0.65">
        <div class="card">
          <div class="card-head">
            <h1 class="card-heading">Reject Offer</h1>
            <button class="close" data-dismiss="modal" aria-label="Close" @click="hide('bid-details-modal')">
              <i class="fas fa-times icon"></i>
            </button>
          </div>
          <div v-if="formData.offer_amount">
            <h2 class="card-subheading">The client’s price offer per truck</h2>
            <p class="card-content">{{ formData.currency }} {{ formData.offer_amount }}</p>
            <h2 class="card-subheading">Are you sure you want to reject this bid?</h2>
            <div class="btns">
              <input @click="bidOffer" type="button" value="Reject Offer" class="reject-btn" />
              <p class="edit-btn orange" @click="hide('bid-details-modal')">Edit Bid</p>
            </div>
          </div>
        </div>
      </modal>
      <modal v-else name="bid-details-modal" class="bid-details-modal" :height="500" transition="slide" :pivot-y="0.3" :pivot-x="0.65">
        <div class="card">
          <div class="card-head">
            <h1 class="card-heading">Confirm Offer</h1>
            <button class="close" data-dismiss="modal" aria-label="Close" @click="hide('bid-details-modal')">
              <i class="fas fa-times icon"></i>
            </button>
          </div>
          <h2 class="card-subheading">How many trucks do you want to avail for this order?</h2>
          <p class="card-content">{{ bidDetails.available_trucks }} Trucks</p>
          <div v-if="formData.offer_amount">
            <h2 class="card-subheading">The client’s price offer per truck</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ formData.offer_amount }}
            </p>
            <h2 class="card-subheading">Total shipment amount</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * formData.offer_amount }}
            </p>
          </div>
          <div v-else>
            <h2 class="card-subheading">What is your bid amount per truck?</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.amount_per_truck }}
            </p>
            <h2 class="card-subheading">Total shipment amount</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * bidDetails.amount_per_truck }}
            </p>
          </div>

          <div class="btns">
            <input @click="bidOffer" type="button" value="Confirm Offer" class="submit-btn" />
            <p class="edit-btn orange" @click="hide('bid-details-modal')">Edit Bid</p>
          </div>
        </div>
      </modal>
    </div>
    <!-- BID SUCCESS MESSAGE -->
    <div v-if="!rejected" class="bid-status-ok">
      <div class="bid-web-form">
        <div v-show="success" class="success-card">
          <span class="success-message">Offer successfully accepted! Please wait to hear from the customer</span>
          <span @click="success = false"> <i class="fas fa-times"></i> </span>
        </div>
        <!-- BID DETAILS -->
        <h1 class="bid-heading">Shipment Details</h1>
        <div class="bid" v-if="Object.keys(formData).length > 0">
          <div class="bid-header">
            <div class="bid-map">
              <img :src="createStaticMapUrl()" class="map" />
            </div>
          </div>

          <div class="bid-details">
            <div class="bid-details-shipment">
              <div class="bid-information">
                <div class="bid-status-indicator" v-if="status >= 0">
                  <h2 class="bid-details-subheading">Bid Status</h2>
                  <div v-if="(status = 1)"><p class="success-status pending">Under Review</p></div>
                  <div v-else-if="(status = 2)">
                    <p class="success-status awarded">Awarded</p>
                  </div>
                  <div v-else-if="(status = -1)"><p class="success-status failed">Failed</p></div>
                </div>
                <h2 class="bid-details-subheading">Pick up</h2>
                <p class="bid-details-content">{{ formData.pickup.name }}</p>
                <h2 class="bid-details-content">The load will be picked at {{ formData.pickup_facility }}</h2>
                <h2 class="bid-details-subheading">Destination</h2>
                <p class="bid-details-content">{{ formData.destination.name }}</p>
                <h2 class="bid-details-subheading">Type of load</h2>
                <p class="bid-details-content">{{ formData.carrier_type }}</p>
                <h2 class="bid-details-subheading">Date of Pick up</h2>
                <p class="bid-details-content">{{ formData.pickup_time }}</p>
              </div>
              <div class="bid-details-truck">
                <h2 class="bid-details-subheading">Number of Trucks wanted</h2>
                <p class="bid-details-content">{{ formData.total_trucks }} Trucks</p>
                <h2 class="bid-details-subheading">Type of Truck</h2>
                <p class="bid-details-content">{{ formData.cargo_type }}</p>
                <h2 class="bid-details-subheading">Weight of load per truck</h2>
                <p class="bid-details-content">{{ formData.tonnes_per_truck }} Tonnes</p>
                <h2 class="bid-details-subheading">Return container?</h2>
                <p class="bid-details-content">{{ formData.is_return === true ? 'Yes, containers will be returned' : 'No, containers will not be returned' }}</p>
                <div v-show="formData.offer_amount > 0 && formData.is_negotiable">
                  <h2 class="bid-details-subheading">The client's price offer</h2>
                  <p class="bid-details-content">{{ formData.currency }} {{ formData.offer_amount }}</p>
                </div>
              </div>
            </div>

            <hr />
            <!-- Bidding section -->
            <!-- BID IS NEGOTIABLE AND HAS OFFER AMOUNT OR WHEN THERE IS NO OFFER_AMOUNT  -->
            <div class="bid-details" v-if="formData.status === 0 && !submitted">
              <div v-if="(formData.is_negotiable && formData.offer_amount > 0) || formData.offer_amount === null" class="bid-section">
                <h2 class="bid-details-heading">Enter your bid</h2>
                <div class="bidding-form">
                  <h2 class="bid-details-content">How many trucks do you have available for this order?</h2>
                  <div class="bidding-form-trucks">
                    <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="bidDetails.available_trucks--" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                    <input class="bidding-form-trucks-input" type="text" :value="bidDetails.available_trucks" placeholder="0" />
                    <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                  </div>
                </div>
                <div class="bidding-amount">
                  <h2 class="bid-details-content">What is your bid amount per truck?</h2>
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
              <div v-if="formData.offer_amount > 0 && !formData.is_negotiable">
                <h2 class="bid-details-heading">Offer</h2>
                <p class="bid-details-content">The client’s price offer</p>
                <form>
                  <p class="bid-details-content black">{{ formData.currency }} {{ formData.offer_amount }} Per Truck</p>
                  <div class="bidding-form-trucks">
                    <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="bidDetails.available_trucks--" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                    <input class="bidding-form-trucks-input" type="number" v-model="bidDetails.available_trucks" />
                    <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                  </div>
                  <input :disabled="(bidDetails.available_trucks && bidDetails.amount_per_truck === null) || (bidDetails.available_trucks && bidDetails.amount_per_truck === '0')" value="Accept Offer" class="submit-btn" @click="acceptOffer" />
                  <p class="bid-ultimatum">OR</p>
                  <input :disables="bidDetails.available_trucks === 0" value="Reject Offer" class="reject-btn" @click="rejectedOffer" />
                </form>
              </div>
            </div>

            <div v-else-if="submitted">
              <div v-if="rejected">
                <p class="bid-details-content">You have successfully rejected the bid</p>
              </div>
              <div v-else>
                <h2 class="bid-submitted-heading">Your bid</h2>
                <h2 class="bid-details-subheading">How many trucks do you have available for this order?</h2>
                <p class="bid-details-content">{{ bidDetails.available_trucks }} Trucks</p>
                <h2 class="bid-details-subheading">What is your bid amount per truck?</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ bidDetails.amount_per_truck }}</p>
                <h2 class="bid-details-subheading">Your total bid amount</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ bidDetails.amount_per_truck * bidDetails.available_trucks }}</p>
                <i>
                  <p class="timestamp">Bid submitted on {{ date }}</p>
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- AFTER BID HAS BEEN SUBMITTED -->

    <!-- <div v-if="formData.status === 1" class="bid-status">
      <i class="far fa-clock fa-6x"></i>
      <h1>Bid placed successfully and is being reviewed</h1>
    </div>
    <div v-if="formData.status === 2" class="bid-status">
      <i class="far fa-check-circle fa-6x"></i>
      <h1>Congratulations, you have been awarded the shipment</h1>
    </div>
    <div v-if="formData.status === -1" class="bid-status">
      <i class="far fa-times-circle fa-6x"></i>
      <h1>Unfortunately your bid offer was not selected</h1>
    </div> -->
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
  title: 'Partner Portal - Freight Bidding Webform',
  components: {
    errorHandler,
    notify,
  },
  data() {
    return {
      negotiable: true,
      bidDetails: {
        amount_per_truck: null,
        available_trucks: 0,
      },
      submitted: false,
      trucks: 0,
      bid_amount: null,
      total_amount: 0,
      errorMessage: '',
      status: 0,
      rejected: null,
      confirmed: false,
      success: false,
      date: '',
      errObj: '',
      formData: {},
      requests: {},
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
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
      this.$modal.show('bid-details-modal');
    },
    hide(name) {
      this.$modal.hide(name);
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
      this.rejected = false;
    },
    rejectedOffer() {
      this.$modal.show('bid-details-modal');
      this.rejected = true;
      this.status = -1;
    },
    bidOffer() {
      this.hide('bid-details-modal');
      this.date = new Date().toLocaleString();
      let bidStatus = null;
      if (this.rejected) {
        bidStatus = -1;
      } else if (!this.rejected) {
        bidStatus = 1;
      }
      if (this.formData.offer_amount === 0 || this.formData.offer_amount === null) {
        bidStatus = 0;
      }

      const bidInfo = {
        quotation_id: parseInt(this.$route.params.shipment_id, 0),
        amount_per_truck: parseInt(this.bidDetails.amount_per_truck, 0),
        available_trucks: this.bidDetails.available_trucks,
        transporter_id: parseInt(this.$route.params.owner_id, 0),
        status: bidStatus,
      };

      const payload = JSON.stringify(bidInfo);
      axios
        .patch(`https://authtest.sendyit.com/freight-service/shipments/quotations?authkey=${process.env.BIDDING_API_KEY}`, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.submitted = true;
            this.success = true;
            this.status = 1;
          }
        })
        .catch((err) => {
          this.errObj = err;
        });
    },
    async getBid() {
      axios
        .get(`https://authtest.sendyit.com/freight-service/shipments/quotations/${this.$route.params.shipment_id}/${this.$route.params.owner_id}?authkey=${process.env.BIDDING_API_KEY}`)
        .then((res) => {
          this.requests = res;
          this.formData = res.data.data;
          this.status = this.formData.status;
        })
        .catch((error) => {
          this.errObj = error;
        });
    },
  },
};
</script>

<style >
@import '../../../public/css/bidding.css';
</style>
