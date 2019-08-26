import axios from 'axios';
import moxios from 'moxios';
import moment from 'moment';
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Savings from '@/views/savings.vue';
import './localStorage';

describe('Savings.vue', () => {
  beforeEach(() => {
    moxios.install(axios);
    window.axios = axios;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  const wrapper = shallowMount(Savings, {
    sync: false,
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
  const dataResponse = {
    status: true,
    msg: [
      {
        rider_id: '749',
        txn: '32PUAJN1KEU',
        amount: '1000',
        running_balance: '1000',
        pay_narrative: 'Advance test loan-Advance',
        pay_time: '2019-06-06 11:30:40',
      },
      {
        rider_id: '749',
        txn: '585CCA9DREK',
        amount: '-1000',
        running_balance: '0',
        pay_narrative: 'Transfer from Current',
        pay_time: '2019-06-06 11:30:40',
      },
    ],
  };
  wrapper.vm.sessionInfo = sessionData;
  it('Check whether the window resize function binds the correct value', () => {
    wrapper.vm.handleResize();
    expect(wrapper.vm.windowWidth).to.be.an('number');
    expect(wrapper.vm.windowWidth).equal(window.innerWidth);
  });
  it('Check whether the filter function returns an exception when the dates are not set', () => {
    wrapper.vm.filt();
    expect(wrapper.vm.error).equal('Please select both a from and to date');
  });
  it('Check whether the filter function initialtes the filter process', () => {
    wrapper.vm.from = '2019-08-01 00:00:00';
    wrapper.vm.to = '2019-08-31 23:59:59';
    const button = wrapper.find('#filtSub');
    expect(button.is('button')).equal(true);
    wrapper.vm.filt();
    expect(wrapper.vm.monthPeriod).equal('01 August 2019 - 31 August 2019');
  });
  it('Check whether the fetchSavings function returns the correct data on load', done => {
    wrapper.vm.fetchSavings(1);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: dataResponse,
        })
        .then(() => {
          expect(wrapper.vm.rows[0].rider_id).equal('749');
          expect(wrapper.vm.rows[0].txn).equal('32PUAJN1KEU');
          expect(wrapper.vm.rows[0].pay_narrative).equal('Advance test loan-Advance');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the fetchSavings function returns an error when the records returned are null on filter', done => {
    wrapper.vm.fetchSavings(2);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: false, msg: null },
        })
        .then(() => {
          expect(wrapper.vm.error).equal('No savings found for this period');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the definePayload function returns the correct payload with start date as first day of the month on first load', () => {
    expect(wrapper.vm.definePayload(1)).equal(
      `{"rider_id":[1444,3142],"from":"${moment()
        .startOf('month')
        .format('YYYY-MM-DD HH:mm:ss')}","to":"${moment()
        .endOf('month')
        .format('YYYY-MM-DD HH:mm:ss')}"}`,
    );
  });
  it('Check whether the definePayload function returns the correct payload with selected filter dated on filter action', () => {
    wrapper.vm.from = '2014-08-01 00:00:00';
    wrapper.vm.to = '2019-08-31 23:59:59';
    expect(wrapper.vm.definePayload(2)).equal('{"rider_id":[1444,3142],"from":"2014-08-01 00:00:00","to":"2019-08-31 23:59:59"}');
  });
  it('Check whether the handleResponse function models the response into the accurate json', () => {
    const response = {
      data: dataResponse,
    };
    wrapper.vm.handleResponse(response);
    expect(wrapper.vm.rows[0].rider_id).equal('749');
    expect(wrapper.vm.rows[0].txn).equal('32PUAJN1KEU');
    expect(wrapper.vm.rows[0].pay_narrative).equal('Advance test loan-Advance');
  });
});
