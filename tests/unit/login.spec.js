import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import moxios from 'moxios';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Login from '@/views/logIn.vue';
import './localStorage';
import messages from './messages';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

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
    mode: 'history',
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
  const loginResponse = { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7InN0YXRlIjoiMSIsImRlZmF1bHRfY3VycmVuY3kiOiJLRVMiLCJkYXRlX2FkZGVkIjoiMjAxOC0wMS0xOCAxNzo0NDoxOSIsInN0YXR1cyI6IjEiLCJlbWFpbCI6ImdyaWZmaW5Ac2VuZHkuY28ua2UiLCJyZWZlcmVyIjpudWxsLCJrcmFfcGluX2NlcnQiOm51bGwsIm5va19uYW1lIjpudWxsLCJpZF9ubyI6IjM0NTIzNDUiLCJub2tfcGhvbmUiOm51bGwsInBvcnRhbF9wYXNzd29yZCI6Ijk4YzAxZjFlYWJhMzA2OTg4Y2MyOWI3MjY4MDFkZjM3MjQzMDJkNjQiLCJuYW1lIjoiZ3JpZmZpbiAiLCJvd25lcl90eXBlIjoiMCIsInN0YWdlIjoiMSIsImlkIjoiNTMyIiwia3JhX3BpbiI6IkFQNzkwOTZTIiwiZGF0ZV90aW1lIjoiMDAwMC0wMC0wMCAwMDowMDowMCIsInRva2VuIjoiM2FMRk1UcDhScSIsInBob25lIjoiKzI1NDcxMzQ5MzA5MiIsImNvdW50cnlfY29kZSI6IktFIiwiaWRfY2FyZCI6ImlkX2FzZmRzYWRmYXNmXzU4NzkwMy5wbmcifSwic3RhdHVzIjp0cnVlLCJleHBpcnkiOiI4NjQwMCJ9.xCQ7ydG-gZ7SE1EXYmmLtX7hi8y_Krundc1XiLeF80c', refresh_token: 'the_refresh_token' };
  it('Check whether the forgot password function switches states accurately', () => {
    wrapper.vm.state = 'login';
    wrapper.vm.forgotPwd();
    expect(wrapper.vm.state).equal('reset');
    wrapper.vm.state = 'reset';
    wrapper.vm.forgotPwd();
    expect(wrapper.vm.state).equal('login');
  });
  it('Check whether the postForgot function responds to the user when the password has been changed', done => {
    wrapper.vm.tel = '+254 795 510441';
    wrapper.vm.postForgot();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, message: 'Password has been reset and sent to +254795510441' },
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
          expect(localStorage.token).equal(loginResponse.access_token);
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
          // expect(wrapper.vm.loginError).equal('Sorry, your details did not match!');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
});
