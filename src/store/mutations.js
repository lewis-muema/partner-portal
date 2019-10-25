export default {
  setBikeAvailability(state, status) {
    state.bike_availability = status;
  },
  setBikeRiders(state, riders) {
    state.bike_riders = riders;
  },
  setBikeRiderId(state, id) {
    state.rider_id = id;
  },
};
