export default {
  getBikeAvailability(state) {
    return state.bike_availability;
  },
  getBikeRiders(state) {
    return state.bike_riders;
  },
  getRiderId(state) {
    return state.rider_id;
  },
  getOwnerId(state) {
    return state.owner_id;
  },
  getSessionInfo(state) {
    return state.sessionInfo;
  },
  getSelectedPartner(state) {
    return state.selected_partner;
  },
  getFlow(state) {
    return state.flow;
  },
  getFreightOrders(state) {
    return state.freight_orders;
  },
  getUserId(state) {
    return state.user_id;
  },
  getCopId(state) {
    return state.cop_id;
  },
  getCopUserId(state) {
    return state.cop_user_id;
  },
  getCreateOrderStatus(state) {
    return state.create_order;
  },
  getFreightStatus(state) {
    return state.freight_status;
  },
};
