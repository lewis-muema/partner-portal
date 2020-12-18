import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);
const plugins = [];

const state = {
  bike_availability: false,
  bike_riders: [],
  rider_id: '',
  owner_id: '',
  sessionInfo: '',
  selected_partner: [],
  flow: 'logistics',
  freight_orders: [],
  user_id: null,
  cop_id: null,
  cop_user_id: null,
  create_order: false,
  freight_status: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  plugins,
};
