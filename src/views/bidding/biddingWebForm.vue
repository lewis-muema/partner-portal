  <template >
  <div id="bidding">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <!-- CONFIRMATION MODAL -->
    <div class="modal-container">
      <modal name="bid-details-modal" class="bid-details-modal" :height="500" transition="slide" :pivot-y="0">
        <div class="card">
          <div class="card-head">
            <h1 class="card-heading">Confirm Offer</h1>
            <button class="close" data-dismiss="modal" aria-label="Close" @click="hide('bid-details-modal')">
              <i class="fas fa-times icon"></i>
            </button>
          </div>
          <h2 class="card-subheading">How many trucks do you want to avail for this order?</h2>
          <p class="card-content">{{ bidDetails.available_trucks }} Trucks</p>
          <div v-if="bid">
            <h2 class="card-subheading">What is your bid amount per truck?</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.amount_per_truck }}
            </p>
            <h2 class="card-subheading">Total shipment amount</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * bidDetails.amount_per_truck }}
            </p>
          </div>
          <div v-else>
            <h2 class="card-subheading">The client’s price offer per truck</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ formData.client_price }}
            </p>
            <h2 class="card-subheading">Total shipment amount</h2>
            <p class="card-content">
              <b>{{ formData.currency }}</b> {{ bidDetails.available_trucks * formData.client_price }}
            </p>
          </div>

          <div class="btns">
            <input @click="bidOffer" type="button" value="Confirm Offer" class="submit-btn" />
            <p class="edit-btn" @click="hide('bid-details-modal')">Edit Bid</p>
          </div>
        </div>
      </modal>
    </div>
    <!-- BID SUCCESS MESSAGE -->
    <div class="bid-web-form">
      <div v-show="success" class="success-card">
        <i class="far fa-check-circle"></i>
        <span class="success-message">Congrats! you have accepted the offer</span>
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
              <h2 class="bid-details-subheading">Pick up</h2>
              <p class="bid-details-content">{{ formData.pickup.name }}</p>
              <p class="bid-details-content dark">The load will be picked at {{ formData.pickup.more.Vicinity }}</p>
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
              <h2 class="bid-details-subheading">Weight of truck</h2>
              <p class="bid-details-content">{{ formData.tonnes_per_truck }}</p>
              <h2 class="bid-details-subheading">Return container?</h2>
              <p class="bid-details-content">{{ formData.is_return ? 'Yes, containers will be returned' : 'No, containers will not be returned' }}</p>
              <div v-if="negotiable">
                <h2 class="bid-details-subheading">The client's price offer</h2>
                <p class="bid-details-content">USD {{ formData.offer_amount }}</p>
              </div>
            </div>
          </div>

          <hr />
          <!-- Bidding section -->
          <div v-if="!submitted">
            <div v-if="bid" class="bid-section">
              <h2 class="bid-details-heading">Enter your bid</h2>
              <form class="bidding-form">
                <h2 class="bid-details-content">How many trucks do you have available for this order?</h2>
                <div class="bidding-form-trucks">
                  <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="bidDetails.available_trucks--" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                  <input class="bidding-form-trucks-input" type="text" :value="bidDetails.available_trucks" placeholder="0" />
                  <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                </div>
                <div class="bidding-amount">
                  <h2 class="bid-details-content">What is your bid amount per truck?</h2>
                  <div class="bidding-amount-currency-section">
                    <select class="bidding-amount-currency border-radius__left" name="currency" id="currency">
                      <option value="USD">USD</option>
                    </select>
                    <input type="number" v-model="bidDetails.amount_per_truck" class="bidding-amount-input border-radius__right" />
                  </div>
                </div>
                <input type="submit" :disabled="(bidDetails.available_trucks && bidDetails.amount_per_truck === null) || (bidDetails.available_trucks && bidDetails.amount_per_truck === '0')" value="Submit Bid" class="submit-btn" @click.prevent="show" />
              </form>
            </div>

            <!-- Bid offer section -->
            <div v-else>
              <h2 class="bid-details-heading">Offer</h2>
              <p class="bid-details-content">The client’s price offer</p>
              <form>
                <p class="bid-details-content black">USD {{ formData.offer_amount }} Per Truck</p>
                <div class="bidding-form-trucks">
                  <button :disabled="bidDetails.available_trucks <= 0" @click.prevent="bidDetails.available_trucks--" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-minus"></i></button>
                  <input class="bidding-form-trucks-input" type="number" v-model="bidDetails.available_trucks" />
                  <button @click.prevent="bidDetails.available_trucks++" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-plus"></i></button>
                </div>
                <input :disables="bidDetails.available_trucks === 0" type="submit" value="Accept Offer" class="submit-btn" @click.prevent="show" />
              </form>
            </div>
          </div>
          <div v-else>
            <h2 class="bid-details-heading">Your bid</h2>
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
      negotiable: false,
      bidDetails: {
        amount_per_truck: null,
        available_trucks: 0,
      },
      submitted: false,
      trucks: 0,
      bid_amount: null,
      total_amount: 0,
      bid: true,
      confirmed: false,
      success: false,
      date: '',
      errObj: '',
      formData: {},
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
    bidOffer() {
      this.hide('bid-details-modal');
      this.date = new Date().toLocaleString();

      const bidInfo = {
        quotation_id: this.formData.quotation.quotation_id,
        amount_per_truck: parseInt(this.bidDetails.amount_per_truck, 0),
        available_trucks: this.bidDetails.available_trucks,
      };

      const payload = JSON.stringify(bidInfo);
      axios
        .patch(`https://authtest.sendyit.com/freight-service/shipments/quotations?authkey=${process.env.BIDDING_API_KEY}`, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.submitted = true;
            this.success = true;
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
          this.formData = res.data.data;
          if (this.formData.offer_amount > 0 && formData.is_negotiable === true) {
            this.bid = true;
            this.negotiable = true;
          }
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
