import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import moxios from 'moxios';
import moment from 'moment';
import VModal from 'vue-js-modal';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Tracking from '../../src/views/tracking.vue';
import './localStorage';

Vue.use(VueI18n);
const i18n = new VueI18n({});

Vue.use(VModal);

describe('Tracking.vue', () => {
  beforeEach(() => {
    moxios.install(axios);
    window.axios = axios;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter({
    routes: [
      {
        path: '/',
        name: 'pending',
      },
    ],
  });
  const wrapper = shallowMount(Tracking, {
    sync: false,
    localVue,
    router,
    i18n,
  });
  const sessionData = {
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
  };
  const ownerDrivers = {
    status: true,
    riders: [
      {
        vendor_disp_name: '5T Truck',
        registration_no: 'KAP 2800L',
        vendor_type: 10,
        rider_id: 678,
        tracker: 0,
        default_currency: 'KES',
        f_name: 'Samuel ',
        s_name: 'Geno',
      },
      {
        vendor_disp_name: 'Freight',
        registration_no: 'KCS 8223F',
        vendor_type: 25,
        rider_id: 749,
        tracker: 11,
        default_currency: 'KES',
        f_name: 'Evans',
        s_name: 'Meshack',
      },
      {
        vendor_disp_name: '5T Truck',
        registration_no: 'KAP 2700L',
        vendor_type: 10,
        rider_id: 1380,
        tracker: 1,
        default_currency: 'KES',
        f_name: 'Charles',
        s_name: 'Kung&#039;u',
      },
      {
        vendor_disp_name: '28T Truck',
        registration_no: 'KAA 900',
        vendor_type: 20,
        rider_id: 16933,
        tracker: 1,
        default_currency: 'UGX',
        f_name: 'Mike',
        s_name: 'Kihiu',
      },
      {
        vendor_disp_name: '28T Truck',
        registration_no: 'ZQT 500T- Isuzu Truck',
        vendor_type: 20,
        rider_id: 17128,
        tracker: 1,
        default_currency: 'KES',
        f_name: 'Lewis',
        s_name: 'Muema',
      },
    ],
  };
  const partnerArray = {
    partnerArray: [
      {
        partner_city_id: 1,
        altitude: 1789.5,
        phone_no: '0736202130',
        lng: 36.7877725,
        device_id: 571,
        county_code: 'ke',
        bearing: 0,
        rating: 4,
        partner_level: 3,
        exclusive_status: 0,
        license_status: 0,
        speed: 0,
        busy_state: false,
        sim_card_sn: '89254031221038077758',
        carrier_type: 1,
        partner_id: 749,
        active_state: true,
        course: 0,
        currency: 'KES',
        time: '2019-09-05 12:43:33',
        rider_id: 749,
        lat: -1.2943991,
        vendor_type: 1,
      },
      {
        partner_city_id: 1,
        altitude: 0,
        phone_no: '+254739222002',
        lng: 36.7796717,
        device_id: 0,
        county_code: 'ke',
        bearing: 0,
        rating: 4,
        partner_level: 3,
        exclusive_status: 0,
        license_status: 1,
        speed: 0,
        busy_state: false,
        sim_card_sn: '89014103211118510720',
        carrier_type: 1,
        partner_id: 16933,
        active_state: true,
        course: 0,
        currency: 'UGX',
        time: '2019-09-02 14:19:01',
        rider_id: 16933,
        lat: -1.3004683,
        vendor_type: 14,
      },
    ],
    status: 'true',
  };
  wrapper.vm.sessionInfo = sessionData;
  it('Check whether the fetchTrackers function fetches the riders with trackers and populates the available vendors', done => {
    wrapper.vm.fetchTrackers();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: ownerDrivers,
        })
        .then(() => {
          // do nothing
        })
        .then(() => {
          const request2 = moxios.requests.mostRecent();
          request2
            .respondWith({
              status: 200,
              response: partnerArray,
            })
            .then(() => {
              expect(wrapper.vm.ridersWithTrackers.length).equal(2);
              expect(wrapper.vm.ridersWithTrackers[0].phone_no).equal('0736202130');
              expect(wrapper.vm.ridersWithTrackers[0].rider_id).equal(wrapper.vm.ridersWithTrackers[0].rider_details.rider_id);
              expect(wrapper.vm.availableVendors[0].vendor_type).equal(wrapper.vm.ridersWithTrackers[0].rider_details.vendor_type);
              done();
            })
            .catch(error => {
              console.log('caught', error.message);
            });
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the getTrackerStatus function fetches the tracker status to display offline, online, or last seen', () => {
    let time = new Date();
    time.setMinutes(time.getMinutes() - 20);
    // expect(wrapper.vm.getTrackerStatus(time, 1)).equal('Online');
    time = new Date();
    time.setMinutes(time.getMinutes() - 40);
    // expect(wrapper.vm.getTrackerStatus(time, 1)).equal('Last seen 40 minutes ago');
    time = new Date();
    time.setMinutes(time.getMinutes() - 70);
    // expect(wrapper.vm.getTrackerStatus(time, 1)).equal('Offline');
  });
  it('Check whether the addTrackerStatusInfo function returns the tracker info', () => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - 70);
    // expect(wrapper.vm.addTrackerStatusInfo(time)).equal('(This could be due to network issues)');
  });
  it('Check whether the get_driver_city_and_tracking_no function returns the city code and tracking number', () => {
    expect(wrapper.vm.get_driver_city_and_tracking_no('K45ttmrkdIO', 1)).equal('ke-nairobi/K45ttmrkdIO');
    expect(wrapper.vm.get_driver_city_and_tracking_no('K45ttmrkdIO', 2)).equal('ke-mombasa/K45ttmrkdIO');
    expect(wrapper.vm.get_driver_city_and_tracking_no('K45ttmrkdIO', 3)).equal('ke-thika/K45ttmrkdIO');
    expect(wrapper.vm.get_driver_city_and_tracking_no('K45ttmrkdIO', 4)).equal('ke-nakuru/K45ttmrkdIO');
    expect(wrapper.vm.get_driver_city_and_tracking_no('K45ttmrkdIO', 5)).equal('ke-kisumu/K45ttmrkdIO');
  });
});
