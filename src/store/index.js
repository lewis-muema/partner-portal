/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import globalStore from './global';

Vue.use(Vuex);
export default new Vuex.Store(globalStore);
