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
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  plugins,
};
