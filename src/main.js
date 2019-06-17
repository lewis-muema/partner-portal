import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
 faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DatatableFactory from 'vuejs-datatable/dist/vuejs-datatable.esm';
import App from './App.vue';
import router from './router';
import store from './store';

library.add(faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axios);
Vue.use(DatatableFactory);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
