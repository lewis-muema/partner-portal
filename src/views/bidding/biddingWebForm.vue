<template>
  <div id="bidding">
    <div class="bid">
      <h1 class="bid-heading">Shipment Details</h1>
      <div class="bid-map map"></div>

      <div class="bid-details">
        <h2 class="bid-details-subheading">Pick up</h2>
        <p class="bid-details-content">{{ formData.pick_up }}</p>
        <p class="bid-details-content dark">The load will be picked at {{ formData.load_pick_up_point }}</p>
        <h2 class="bid-details-subheading">Destination</h2>
        <p class="bid-details-content">{{ formData.destination }}</p>
        <h2 class="bid-details-subheading">Type of load</h2>
        <p class="bid-details-content">{{ formData.load_type }}</p>
        <h2 class="bid-details-subheading">Date of Pick up</h2>
        <p class="bid-details-content">{{ formData.pick_up_date }}</p>
        <hr />
        <h2 class="bid-details-subheading">Number of Trucks wanted</h2>
        <p class="bid-details-content">{{ formData.no_of_trucks }} Trucks</p>
        <h2 class="bid-details-subheading">Type of Truck</h2>
        <p class="bid-details-content">{{ formData.type_of_truck }}</p>
        <h2 class="bid-details-subheading">Weight of truck</h2>
        <p class="bid-details-content">{{ formData.weight_of_truck }}</p>
        <h2 class="bid-details-subheading">Return container?</h2>
        <p class="bid-details-content">{{ formData.return_container }}</p>
      </div>

      <hr />

      <div v-if="bid" class="bid-section">
        <h2 class="bid-details-heading">Enter your bid</h2>
        <form class="bidding-form">
          <h2 class="bid-details-content">How many trucks do you have available for this order?</h2>
          <div class="bidding-form-trucks">
            <button @click.prevent="trucks++" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-plus"></i></button>
            <input class="bidding-form-trucks-input" type="text" :value="trucks" />
            <button @click.prevent="trucks--" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-minus"></i></button>
          </div>
          <div class="bidding-amount">
            <h2 class="bid-details-content">What is your bid amount per truck?</h2>
            <div class="bidding-amount-currency-section">
              <select class="bidding-amount-currency border-radius__left" name="currency" id="currency">
                <option value="USD">USD</option>
              </select>
              <input type="text" class="bidding-amount-input border-radius__right" />
            </div>
          </div>
          <input type="button" value="Submit Bid" class="bidding-form-btn" />
        </form>
      </div>
      <div v-else>
        <h2 class="bid-details-heading">Offer</h2>
        <p class="bid-details-content">The client’s price offer</p>
        <form>
          <p class="bid-details-content black">USD {{ formData.client_price }} Per Truck</p>
          <div class="bidding-form-trucks">
            <button @click.prevent="trucks++" class="bidding-form-trucks-button border-radius__left"><i class="fas fa-plus"></i></button>
            <input class="bidding-form-trucks-input" type="text" :value="trucks" />
            <button @click.prevent="truck--" class="bidding-form-trucks-button border-radius__right"><i class="fas fa-minus"></i></button>
          </div>
          <input type="button" value="Submit Bid" class="bidding-form-btn" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bid: true,
      trucks: 0,
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
    };
  },
};
</script>

<style >
@import '../../../public/css/bidding.css';
</style>
