  <template >
  <div id="bidding">
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
      <div class="bid">
        <div class="bid-header">
          <div class="bid-map">
            <img :src="createStaticMapUrl()" class="map" />
          </div>
        </div>

        <div class="bid-details">
          <div class="bid-details-shipment">
            <div class="bid-information">
              <h2 class="bid-details-subheading">Pick up</h2>
              <p class="bid-details-content">{{ formData2.data.pickup.name }}</p>
              <p class="bid-details-content dark">The load will be picked at {{ formData2.data.pickup_facility }}</p>
              <h2 class="bid-details-subheading">Destination</h2>
              <p class="bid-details-content">{{ formData2.data.destination.name }}</p>
              <h2 class="bid-details-subheading">Type of load</h2>
              <p class="bid-details-content">{{ formData2.data.carrier_type }}</p>
              <h2 class="bid-details-subheading">Date of Pick up</h2>
              <p class="bid-details-content">{{ formData2.data.pickup_time }}</p>
            </div>
            <div class="bid-details-truck">
              <h2 class="bid-details-subheading">Number of Trucks wanted</h2>
              <p class="bid-details-content">{{ formData.no_of_trucks }} Trucks</p>
              <h2 class="bid-details-subheading">Type of Truck</h2>
              <p class="bid-details-content">{{ formData.type_of_truck }}</p>
              <h2 class="bid-details-subheading">Weight of truck</h2>
              <p class="bid-details-content">{{ formData.weight_of_truck }}</p>
              <h2 class="bid-details-subheading">Return container?</h2>
              <p class="bid-details-content">{{ formData.return_container }}</p>
              <div v-if="negotiable">
                <h2 class="bid-details-subheading">The client's price offer</h2>
                <p class="bid-details-content">{{ formData.currency }} {{ formData.client_price }}</p>
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
                      <option :value="formData.currency">{{ formData.currency }}</option>
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
                <p class="bid-details-content black">{{ formData.currency }} {{ formData.client_price }} Per Truck</p>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
      bid: true,
      confirmed: false,
      success: false,
      date: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      formData: {
        pick_up: 'Mombasa terminus',
        pick_up_coordinates: '-4.021415536607629, 39.57932868582077',
        load_pick_up_point: 'Facility 432',
        destination: 'Bidco offices, Nairobi',
        destination_coordinates: '-1.2812652938755034, 36.85095248655147',
        load_type: 'Rice',
        pick_up_date: '3/4/2020',
        no_of_trucks: '5',
        type_of_truck: 'Flatbed',
        weight_of_truck: 'over 28 Tonnes',
        return_container: 'Yes,container will be returned',
        type: 'bid/offer',
        client_price: 750, // Only sent if the type is bid
        currency: 'USD',
        status: 'pending/accepted',
        bid_amount_per_truck: 800, // Only sent if bid status is accepted
        bid_no_of_trucks: 3, // Only sent if bid status is accepted
        date_submitted: '14:05:00 2/2/2021', // Only sent if bid status is accepted
      },
      formData2: {
        status: true,
        code: 200,
        message: 'Success',
        data: {
          quotation: {
            quotation_id: 39,
            shipment_id: 76,
            transporter_id: 549,
            name: null,
            trucks_available: 4,
            price_per_truck: 35000,
            status: 2,
            bid_status: 'Bid Awarded',
            date_created: null,
          },
          negotiable: null,
          id: 76,
          peer_id: 1081,
          cop_user_id: null,
          cop_id: null,
          pickup: {
            name: 'Nairobi',
            coordinates: '-1.2920659,36.8219462',
            country_code: 'KE',
            type: 'coordinates',
            more: {
              Estate: '',
              FlatName: '',
              place_idcustom: 'ChIJp0lN2HIRLxgRTJKXslQCz_c',
              Label: '',
              HouseDoor: '',
              Otherdescription: '',
              Typed: '',
              Vicinity: 'Not Indicated',
              Address: 'Nairobi, Kenya',
              landmark: '',
              viewport: {
                northeast: {
                  lat: 0.0,
                  lng: 0.0,
                },
                southwest: {
                  lat: 0.0,
                  lng: 0.0,
                },
              },
              Road: '',
            },
          },
          pickup_facility: 'Facility ZV next to Ferry Road',
          pickup_time: '02-15-2021 04:25:54',
          destination: {
            name: 'Nairobi',
            coordinates: '-1.2920659,36.8219462',
            country_code: 'KE',
            type: 'coordinates',
            more: {
              Estate: '',
              FlatName: '',
              place_idcustom: 'ChIJp0lN2HIRLxgRTJKXslQCz_c',
              Label: '',
              HouseDoor: '',
              Otherdescription: '',
              Typed: '',
              Vicinity: 'Not Indicated',
              Address: 'Nairobi, Kenya',
              landmark: '',
              viewport: {
                northeast: {
                  lat: 0.0,
                  lng: 0.0,
                },
                southwest: {
                  lat: 0.0,
                  lng: 0.0,
                },
              },
              Road: '',
            },
          },
          carrier_type: 'Cotton',
          cargo_type: 'Highside',
          is_return: false,
          total_trucks: 20,
          available_trucks: 4,
          tonnes_per_truck: 23,
          offer_amount: null,
          is_negotiable: null,
          bidding_deadline: null,
          status: 0,
          quotations: null,
          awarded_bids: null,
        },
      },
    };
  },
  mounted() {
    this.getBid();
  },
  methods: {
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
      const from_cordinates = this.formData.pick_up_coordinates;
      const to_cordinates = this.formData.destination_coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=300x250&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    bidOffer() {
      this.submitted = true;
      this.success = true;
      this.hide('bid-details-modal');
      this.date = new Date().toLocaleString();

      const bidInfo = {
        quotation_id: 10,
        amount_per_truck: parseInt(this.bidDetails.amount_per_truck, 0),
        available_trucks: this.bidDetails.available_trucks,
      };

      const payload = JSON.stringify(bidInfo);
      console.log(payload);
      axios
        .patch('https://authtest.sendyit.com/freight-service/shipments/quotations', payload)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    },
    getBid() {
      axios.get('https://authtest.sendyit.com/freight-service/shipments/quotations/16/581?authkey=VbgJTYDPsfXGbERAMVeSWHu7uZHwzKW32X27mAStmN6vXEHKm86').then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style >
@import '../../../public/css/bidding.css';
</style>
