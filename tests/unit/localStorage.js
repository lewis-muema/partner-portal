import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
 faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faCoins, faMobile, faGasPump, faCalendarWeek,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faCoins, faMobile, faGasPump, faCalendarWeek);

Vue.component('font-awesome-icon', FontAwesomeIcon);

global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key];
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
};

localStorage.setItem({
  expiryDate: 'Sat Aug 10 2019 12:45:51 GMT+0300 (East Africa Time)',
  user: {
    admin_type: '0',
    admin_id: '101',
    ecommerce_only: '0',
    status: '1',
    email: 'lewis@sendyit.com',
    agent_extension: '0',
    external_status: '0',
    cop_id: null,
    name: 'Lewis',
    post: 'Sendy Ninja',
    country_codes: '["KE"]',
    dev: '1',
    pic: 'eggy.png',
    privilege: '{"view_new_feature": false, "record_mpesa": true, "chat": false, "approve_partners": false, "approve_postpay": false, "record_cheques": false, "record_partner_withdrawal": false, "record_promo_code": false, "record_sendy_target": false, "record_notification": false, "record_dispatch_radius": false, "record_user": false, "record_pass_change": false, "approve_prepay_billing": true, "approve_postpay_billing": true, "change_account_manager": false, "location_proximity": false, "reassign_orders": false, "activate_partner": false, "update_delivery_status": false}',
    send_dept_id: '2',
    role: '2',
    phone: '0795510441',
    show_ecommerce: '0',
    allowed_orders: null,
  },
  authenticated: true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7InN0YXRlIjoiMSIsImRlZmF1bHRfY3VycmVuY3kiOiJLRVMiLCJkYXRlX2FkZGVkIjoiMjAxOC0wMS0yOSAwOTo0MTozMSIsInN0YXR1cyI6IjEiLCJlbWFpbCI6InBzYW1vZWlAc2VuZHkuY28ua2UiLCJyZWZlcmVyIjpudWxsLCJrcmFfcGluX2NlcnQiOm51bGwsIm5va19uYW1lIjpudWxsLCJpZF9ubyI6IjI1NDE3MDE0Iiwibm9rX3Bob25lIjpudWxsLCJwb3J0YWxfcGFzc3dvcmQiOiJmMmQ4ZDUyMzZhNzY2Yzg0NTEzYzU4YWRjMDg3M2Q3OTg4NmQ0MTBhIiwibmFtZSI6IlBoaWwgU2Ftb2VpIiwib3duZXJfdHlwZSI6IjAiLCJzdGFnZSI6IjEiLCJpZCI6IjExOTgiLCJrcmFfcGluIjpudWxsLCJkYXRlX3RpbWUiOiIwMDAwLTAwLTAwIDAwOjAwOjAwIiwidG9rZW4iOiJqZnRyYzR5VHVYIiwicGhvbmUiOiIrMjU0NzIyNTExMDQ2IiwiY291bnRyeV9jb2RlIjoiS0UiLCJpZF9jYXJkIjoiMTUwNTM4MTA2NjcxOWltYWdlLmpwZyJ9LCJzdGF0dXMiOnRydWUsImV4cGlyeSI6Ijg2NDAwIn0.XqMz4M_s0c_aCi4UBJZKQHJ4Wdjt-cwQ_EszESAErWY',
  sessionData: {
    payload: {
      state: '1',
      default_currency: 'KES',
      date_added: '2018-01-29 09:41:31',
      status: '1',
      email: 'psamoei@sendy.co.ke',
      referer: null,
      kra_pin_cert: null,
      nok_name: null,
      id_no: '25417014',
      nok_phone: null,
      portal_password: 'f2d8d5236a766c84513c58adc0873d79886d410a',
      name: 'Phil Samoei',
      owner_type: '0',
      stage: '1',
      id: '1198',
      kra_pin: null,
      date_time: '0000-00-00 00:00:00',
      token: 'jftrc4yTuX',
      phone: '+254722511046',
      country_code: 'KE',
      id_card: '1505381066719image.jpg',
      riders: [
        {
          vendor_disp_name: '28T Truck',
          registration_no: 'KMCH',
          vendor_type: 20,
          rider_id: 1444,
          tracker: 0,
          default_currency: 'KES',
          f_name: 'Phil',
          s_name: 'Samoei',
        },
        {
          vendor_disp_name: '28T Truck',
          registration_no: 'KCJ-846VO',
          vendor_type: 20,
          rider_id: 3142,
          tracker: 0,
          default_currency: 'KES',
          f_name: 'ttttty',
          s_name: 'yyuyuy',
        },
      ],
    },
    status: true,
    expiry: '86400',
  },
});
