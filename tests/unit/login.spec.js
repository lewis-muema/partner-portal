import axios from 'axios';
import moxios from 'moxios';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Login from '@/views/logIn.vue';
import './localStorage';

describe('Login.vue', () => {
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
  const wrapper = shallowMount(Login, {
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
  const loginResponse = 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7InN0YXRlIjoiMSIsImRlZmF1bHRfY3VycmVuY3kiOiJLRVMiLCJkYXRlX2FkZGVkIjoiMjAxOC0wMS0xOCAxNzo0NDoxOSIsInN0YXR1cyI6IjEiLCJlbWFpbCI6ImdyaWZmaW5Ac2VuZHkuY28ua2UiLCJyZWZlcmVyIjpudWxsLCJrcmFfcGluX2NlcnQiOm51bGwsIm5va19uYW1lIjpudWxsLCJpZF9ubyI6IjM0NTIzNDUiLCJub2tfcGhvbmUiOm51bGwsInBvcnRhbF9wYXNzd29yZCI6Ijk4YzAxZjFlYWJhMzA2OTg4Y2MyOWI3MjY4MDFkZjM3MjQzMDJkNjQiLCJuYW1lIjoiZ3JpZmZpbiAiLCJvd25lcl90eXBlIjoiMCIsInN0YWdlIjoiMSIsImlkIjoiNTMyIiwia3JhX3BpbiI6IkFQNzkwOTZTIiwiZGF0ZV90aW1lIjoiMDAwMC0wMC0wMCAwMDowMDowMCIsInRva2VuIjoiM2FMRk1UcDhScSIsInBob25lIjoiKzI1NDcxMzQ5MzA5MiIsImNvdW50cnlfY29kZSI6IktFIiwiaWRfY2FyZCI6ImlkX2FzZmRzYWRmYXNmXzU4NzkwMy5wbmcifSwic3RhdHVzIjp0cnVlLCJleHBpcnkiOiI4NjQwMCJ9.xCQ7ydG-gZ7SE1EXYmmLtX7hi8y_Krundc1XiLeF80c';
  it('Check whether the forgot password function switches states accurately', () => {
    wrapper.vm.state = 'login';
    wrapper.vm.forgotPwd();
    expect(wrapper.vm.state).equal('reset');
    wrapper.vm.state = 'reset';
    wrapper.vm.forgotPwd();
    expect(wrapper.vm.state).equal('login');
  });
  it('Check whether the validate phone removes spaces and other characters other than numbers and (+)', done => {
    wrapper.vm.tel = '+254 795 510441 d';
    wrapper.vm.validatePhone();
    setTimeout(() => {
      expect(wrapper.vm.tel).equal('+254795510441');
    }, 1000);
    done();
  });
  it('Check whether the validate password removes spaces and other characters other than numbers', () => {
    wrapper.vm.password = '11r6 5d 7';
    wrapper.vm.validatePassword();
    expect(wrapper.vm.password).equal('11657');
  });
  it('Check whether the postForgot function responds to the user when the password has been changed', done => {
    wrapper.vm.tel = '+254 795 510441';
    wrapper.vm.postForgot();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, msg: 'Password has been reset and sent to +254795510441' },
        })
        .then(() => {
          expect(wrapper.vm.loginError).equal('Password has been reset and sent to +254795510441');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the postLogin function recieves the token and stores it in the localStorage on succesful login', done => {
    wrapper.vm.tel = '+254 795 510441';
    wrapper.vm.password = '11117';
    wrapper.vm.postLogin();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: loginResponse,
        })
        .then(() => {
          expect(localStorage.token).equal(loginResponse);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the postLogin function gives the correct error on failed login', done => {
    wrapper.vm.tel = '+254 795 510441';
    wrapper.vm.password = '11117';
    wrapper.vm.postLogin();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: false, msg: null },
        })
        .then(() => {
          expect(wrapper.vm.loginError).equal('Sorry, your details did not match!');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  // it('Check whether the handleResponse function fetches owner drivers', done => {
  //   const response = {
  //     status: 200,
  //     data: loginResponse,
  //   };
  //   wrapper.vm.handleResponse(response);
  //   moxios.wait(() => {
  //     const request = moxios.requests.mostRecent();
  //     request
  //       .respondWith({
  //         status: 200,
  //         response: {
  //           status: true,
  //           riders: [
  //             {
  //               vendor_disp_name: '5T Truck',
  //               registration_no: 'KAP 2800L',
  //               vendor_type: 10,
  //               rider_id: 678,
  //               tracker: 0,
  //               default_currency: 'KES',
  //               f_name: 'Samuel ',
  //               s_name: 'Geno',
  //             },
  //             {
  //               vendor_disp_name: 'Freight',
  //               registration_no: 'KCS 8223F',
  //               vendor_type: 25,
  //               rider_id: 749,
  //               tracker: 11,
  //               default_currency: 'KES',
  //               f_name: 'Evans',
  //               s_name: 'Meshack',
  //             },
  //           ],
  //         },
  //       })
  //       .then(() => {
  //         const parseData = JSON.parse(localStorage.sessionData);
  //         expect(parseData.payload.riders[0].registration_no).equal('KAP 2800L');
  //         done();
  //       })
  //       .catch(error => {
  //         console.log('caught', error.message);
  //       });
  //   });
  // });
});
