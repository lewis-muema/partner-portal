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
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import {
 Rate, Dropdown, DropdownMenu, DropdownItem, Menu, Submenu, MenuItem, Progress,
} from 'element-ui';
import SendyAuth from '@sendyit/auth';
import App from './App.vue';
import router from './router';
import store from './store';

// configure language
locale.use(lang);

Vue.use(SendyAuth, {
  // social authentication driver: 'google'
  // default: google
  driver: 'basic',

  // internal authentication url
  authUrl: 'https://authtest.sendyit.com/rideradmin/login',

  // custom configurations for social drivers
  configs: {
    google: {
      // google's client key & identification for gapi
      clientId: '',
    },
  },
});
Vue.use(Rate);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Progress);

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
