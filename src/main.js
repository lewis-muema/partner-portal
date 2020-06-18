/* eslint-disable object-curly-newline */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VModal from 'vue-js-modal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faStar as fasStar, faChartBar, faMoneyBillAlt, faUniversity, faSpinner, faCoins, faMobile, faGasPump, faCalendarWeek, faStarHalf, faCloudUploadAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import VueMask from 'v-mask';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VuePageTitle from 'vue-page-title';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import { Rate, Dropdown, DropdownMenu, DropdownItem, Menu, Submenu, MenuItem, Progress } from 'element-ui';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import VueSignaturePad from 'vue-signature-pad';
import App from './App.vue';
import router from './router';
import store from './store';

// configure language
locale.use(lang);
Vue.use(VueSignaturePad);

Vue.use(ApmVuePlugin, {
  router,
  config: {
    serviceName: 'vue-partner-portal',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    serviceVersion: process.env.ELASTIC_APM_SERVICE_VERSION,
    environment: process.env.DOCKER_ENV,
    distributedTracingOrigins: [process.env.VUE_APP_AUTH],
  },
});
Vue.use(VueMask);
Vue.use(Rate);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Progress);

Vue.use(VuePageTitle);

library.add(faUserSecret, fasStar, farStar, faStarHalf, faChartBar, faMoneyBillAlt, faUniversity, faSpinner, faCoins, faMobile, faGasPump, faCalendarWeek, faCloudUploadAlt, faArrowLeft);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axios);
Vue.use(VModal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
