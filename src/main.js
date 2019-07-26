import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VModal from 'vue-js-modal';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
 faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import VueMask from 'v-mask';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VuePageTitle from 'vue-page-title';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueMask);

Vue.use(VuePageTitle);

library.add(faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faSpinner);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axios);
Vue.use(VModal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
