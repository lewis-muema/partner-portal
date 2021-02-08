<template>
  <div>
    Form
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        return_container: 'Yes',
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

<style>

</style>
