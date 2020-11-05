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
  setOwnerId(state, ownerId) {
    state.owner_id = ownerId;
  },
  setSessionInfo(state, sessionInfo) {
    state.sessionInfo = sessionInfo;
  },
  setSelectedPartner(state, vendor) {
    state.selected_partner = vendor;
  },
};
