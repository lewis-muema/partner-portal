import axios from 'axios';
import moxios from 'moxios';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import DriveRequest from '@/views/driverRequest.vue';
import './localStorage';

describe('DriverRequest.vue', () => {
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
        path: '/driveRequest/:token',
        name: 'driverRequest',
      },
    ],
  });
  const wrapper = shallowMount(DriveRequest, {
    sync: false,
    localVue,
    router,
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
  wrapper.vm.sessionInfo = sessionData;
  it('Check whether the submitResponse function recieves the correct response after sending an action', done => {
    wrapper.vm.token = 'Klwe73Und';
    wrapper.vm.submitResponse();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: false, msg: 'Application was accepted on 2019-08-23 10:07:44' },
        })
        .then(() => {
          expect(wrapper.vm.message).equal('Application was accepted on 2019-08-23 10:07:44');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
});
