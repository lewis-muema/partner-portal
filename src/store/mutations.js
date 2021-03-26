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
  setFlow(state, flow) {
    state.flow = flow;
  },
  setFreightOrders(state, freight_orders) {
    state.freight_orders = freight_orders;
  },
  setUserId(state, user_id) {
    state.user_id = user_id;
  },
  setCopId(state, cop_id) {
    state.cop_id = cop_id;
  },
  setCopUserId(state, cop_user_id) {
    state.cop_user_id = cop_user_id;
  },
  setCreateOrderStatus(state, create_order) {
    state.create_order = create_order;
  },
  setFreightStatus(state, freight_status) {
    state.freight_status = freight_status;
  },
  setLanguage(state, language) {
    state.language = language;
  },
};
