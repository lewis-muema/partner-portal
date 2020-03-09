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
    wrapper.vm.$route.params.token = 'y7ajN';
    wrapper.vm.fetchDriverRequest();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            data: {
              allocation_details: {
                temp_rider_allocation_id: 247,
                token: 'y7ajN',
                rider_id: 17162,
                owner_id: 3,
                rider_phone: '+254795510441',
                vehicle_id: 1337,
                date_allocated: '2019-09-06 14:48:14',
                date_completed: null,
                allocation_status: 1,
                allocation_type: 1,
                rider_migrated: 2,
                date_time: '2019-09-06 14:48:14',
                status: 1,
              },
              vehicle_details: {
                id: 1337,
                model: 'Actros',
                insurance: null,
                make: 'Mercedes',
                manufacture_year: '2011',
                insurance_no: 'A334563242',
                insurance_name: null,
                psv_no: '',
                log_book_no: '324556',
                log_book: '1552118380083ap34c7712-h2p1-delivery_note-0.jpg',
                registration_no: 'KAL 344K',
                photo: '1552118394507download(1).jpeg',
                box: 0,
                vendor_type: 20,
                date_added: '2019-03-09 11:00:03',
                date_time: '2019-03-09 11:00:03',
                status: 1,
                owner: null,
                partner: null,
                owner_id: 3,
                closed: 0,
                refrigerated: 1,
                verified: 0,
                country_code: null,
                vehicle_type: 0,
                carrier_type: 0,
                load_capacity: null,
                vehicle_size: 0,
              },
              owner_details: {
                id: 3,
                name: 'Elikana Muhanji',
                id_no: '237078443',
                kra_pin: 'A212345678909',
                id_card: 'id_Elikana_Muhanji_8634.png',
                kra_pin_cert: '/9mhkufgfjc-15200009403491517177628855a010335318f-1-281-29.jpg',
                phone: '+254795510441',
                portal_password: 'f880b61ce9d11b4e658a673b36ab9a4f2dfd5b82',
                email: 'elikanamuhanji@gmail',
                token: 'm9JBUJfzxK',
                date_added: '2018-01-18 17:44:05',
                date_time: '0000-00-00 00:00:00',
                status: 1,
                country_code: 'KE',
                default_currency: 'KES',
                referer: null,
                stage: 1,
                state: 1,
                nok_phone: null,
                nok_name: null,
                owner_type: 0,
              },
            },
          },
        })
        .then(() => {
          expect(wrapper.vm.responseStatus).equal(true);
          expect(wrapper.vm.allocationType).equal(1);
          expect(wrapper.vm.token).equal('y7ajN');
          expect(wrapper.vm.message).equal('Elikana Muhanji has invited you to drive their Actros : KAL 344K on Sendy');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
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
