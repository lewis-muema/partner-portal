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
import { Rate, Dropdown, DropdownMenu, DropdownItem, Menu, Submenu, MenuItem, Progress, Input, DatePicker, Table, TableColumn, Button, Dialog, ButtonGroup, Upload, MessageBox, Message, Loading, Radio, RadioGroup, Select, Option, Icon, RadioButton, CheckboxGroup, Checkbox, Breadcrumb, BreadcrumbItem, Steps, Step, Tabs, TabPane, Collapse, CollapseItem } from 'element-ui';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import VueSignaturePad from 'vue-signature-pad';
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

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
Vue.use(VueGoogleMaps, {
  load: {
    libraries: ['places'],
    key: process.env.GOOGLE_API_KEY,
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
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Dialog);
Vue.use(Upload);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Select);
Vue.use(Option);
Vue.use(Icon);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Loading.directive);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);


Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(VuePageTitle);

library.add(faUserSecret, fasStar, farStar, faStarHalf, faChartBar, faMoneyBillAlt, faUniversity, faSpinner, faCoins, faMobile, faGasPump, faCalendarWeek, faCloudUploadAlt, faArrowLeft);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axios);
Vue.use(VModal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
