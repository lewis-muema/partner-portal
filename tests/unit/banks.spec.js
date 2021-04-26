import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
import moment from 'moment';
import VueI18n from 'vue-i18n';
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Banks from '@/views/banks.vue';
import './localStorage';
import messages from './messages';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

describe('Banks.vue', () => {
  beforeEach(() => {
    moxios.install(axios);
    window.axios = axios;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  const wrapper = shallowMount(Banks, {
    sync: false,
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
  const ownerBanks = [
    {
      owner_bank_account_id: 41,
      owner_id: 3,
      account_no: '1114202819',
      payment_bank_id: 1,
      account_name: 'Jude',
      bank_branch: 'NHIF',
      admin_approval: 1,
      decline_reason: 'undefined',
      bank_name: 'KENYA COMMERCIAL BANK LTD',
      bank_paybill: 522522,
    },
    {
      owner_bank_account_id: 33,
      owner_id: 3,
      account_no: '00067855875',
      payment_bank_id: 2,
      account_name: 'Lewis',
      bank_branch: 'Nairobi',
      admin_approval: 1,
      decline_reason: 'undefined',
      bank_name: 'STANDARD CHARTERED',
      bank_paybill: 329329,
    },
    {
      owner_bank_account_id: 47,
      owner_id: 3,
      account_no: '11221122323',
      payment_bank_id: 2,
      account_name: 'Lewis MM',
      bank_branch: 'Nairobi',
      admin_approval: 0,
      decline_reason: null,
      bank_name: 'STANDARD CHARTERED',
      bank_paybill: 329329,
    },
  ];
  const paymentBanks = [
    {
      payment_bank_id: 1,
      name: 'KENYA COMMERCIAL BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 522522,
    },
    {
      payment_bank_id: 2,
      name: 'STANDARD CHARTERED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 329329,
    },
    {
      payment_bank_id: 3,
      name: 'BARCLAYS BANK OF KENYA LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 303030,
    },
    {
      payment_bank_id: 4,
      name: 'BANK OF INDIA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 5,
      name: 'BANK OF BARODA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 6,
      name: 'COMMERCIAL BANK OF AFRICA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 880100,
    },
    {
      payment_bank_id: 7,
      name: 'HABIB BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 8,
      name: 'CENTRAL BANK OF KENYA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 9,
      name: 'PRIME BANK LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 10,
      name: 'CO-OPERATIVE BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 400200,
    },
    {
      payment_bank_id: 11,
      name: 'NATIONAL BANK OF KENYA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 625625,
    },
    {
      payment_bank_id: 12,
      name: 'ORIENTAL COMMERCIAL BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 13,
      name: 'CITIBANK N.A.',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 14,
      name: 'HABIB BANK A.G.',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 15,
      name: 'MIDDLE EAST BANK (K) LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 16,
      name: 'BANK OF AFRICA KENYA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: 972900,
    },
    {
      payment_bank_id: 17,
      name: 'DUBAI BANK OF KENYA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 18,
      name: 'CONSOLIDATED BANK OF KENYA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 19,
      name: 'CREDIT BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 20,
      name: 'TRANS-NATIONAL BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 21,
      name: 'CHASE BANK (KENYA) LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 22,
      name: 'STANBIC BANK KENYA LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 23,
      name: 'AFRICAN BANKING CORPORATION',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 24,
      name: 'IMPERIAL BANK LIMITED',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 25,
      name: 'NIC BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 26,
      name: 'GIRO BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 27,
      name: 'ECOBANK KENYA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 28,
      name: 'EQUITORIAL COMMERCIAL BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 29,
      name: 'PARAMOUNT UNIVERSAL BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 30,
      name: 'JAMII BORA BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 31,
      name: 'GUARANTY TRUST (KENYA) LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 32,
      name: 'VICTORIA COMMERCIAL BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 33,
      name: 'GUARDIAN BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 34,
      name: 'INVESTMENTS AND MORTGAGES',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 35,
      name: 'DEVELOPMENT BANK OF KENYA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 36,
      name: 'FIDELITY COMMERCIAL BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 37,
      name: 'HOUSING FINANCE CORPORATION OF KENYA',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 38,
      name: 'DIAMOND TRUST BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 39,
      name: 'CHARTERHOUSE BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 40,
      name: 'K-REP BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 41,
      name: 'EQUITY BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 42,
      name: 'FAMILY BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 43,
      name: 'GULF AFRICAN BANK LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 44,
      name: 'FIRST COMMUNITY BANK',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
    {
      payment_bank_id: 45,
      name: 'UBA KENYA LTD',
      status: 1,
      date_time: '2019-03-08T10:13:16.000Z',
      paybill: null,
    },
  ];
  wrapper.vm.sessionInfo = sessionData;
  it('Check whether the fetchOwnerBanks function fetches all the owners bank accounts', done => {
    wrapper.vm.fetchOwnerBanks();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            data: ownerBanks,
          },
        })
        .then(() => {
          expect(wrapper.vm.accounts[0].owner_bank_account_id).equal(41);
          expect(wrapper.vm.accounts.length).equal(3);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the fetchAllBanks function fetches all bank accounts', done => {
    wrapper.vm.fetchAllBanks();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            data: paymentBanks,
          },
        })
        .then(() => {
          expect(wrapper.vm.banks[0].payment_bank_id).equal(1);
          expect(wrapper.vm.banks[0].name).equal('KENYA COMMERCIAL BANK LTD');
          expect(wrapper.vm.banks.length).equal(45);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the isMobile function determines if the device is a mobile or not', () => {
    wrapper.vm.isMobile();
    expect(wrapper.vm.Mobile).equal(false);
  });
  it('Check whether the addAccount function displays the add account panel', () => {
    wrapper.vm.addAccount(1);
    expect(wrapper.vm.bankid).equal(2);
    expect(wrapper.vm.branch).equal('Nairobi');
    expect(wrapper.vm.name).equal('Lewis');
    expect(wrapper.vm.account).equal('00067855875');
    expect(wrapper.vm.recordId).equal(33);
    expect(wrapper.vm.submitStatus).equal(true);
    expect(wrapper.vm.editStatus).equal(1);
  });
  it('Check whether the getBankName function returns the bank name', () => {
    expect(wrapper.vm.getBankName(1)).equal('KENYA COMMERCIAL BANK LTD');
  });
  it('Check whether the sendCode function sends a code to the owners phone', done => {
    wrapper.vm.requestId = 'd1ec833142954f0fba045566cd0a2714';
    wrapper.vm.sendCode();
    wrapper.vm.requestId = '';
    wrapper.vm.sendCode();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, request_id: '7ce9332d0b994eb9804df790f05bd04c' },
        })
        .then(() => {
          expect(wrapper.vm.requestId).equal('7ce9332d0b994eb9804df790f05bd04c');
          expect(localStorage.requestId).equal('7ce9332d0b994eb9804df790f05bd04c');
          expect(wrapper.vm.sendingCodeStatus).equal(false);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the handleSendCodeResponse function displays an error when a verification code has not been sent to the phone', () => {
    const response = { data: { status: false, message: 'This phone number does not exist' } };
    wrapper.vm.handleSendCodeResponse(response);
    expect(wrapper.vm.sendingCodeStatus).equal(false);
  });
  it('Check whether the confirmDetails function toggles the confirmAccountStatus status', () => {
    wrapper.vm.confirmAccountStatus = true;
    wrapper.vm.confirmDetails();
    expect(wrapper.vm.confirmAccountStatus).equal(false);
    wrapper.vm.confirmDetails();
    expect(wrapper.vm.confirmAccountStatus).equal(true);
  });
  it('Check whether the verifyDetails function toggles the verifyDetailsStatus status', () => {
    wrapper.vm.verifyDetailsStatus = true;
    wrapper.vm.verifyDetails();
    expect(wrapper.vm.verifyCodeStatus).equal(true);
    expect(wrapper.vm.verifyDetailsStatus).equal(false);
    wrapper.vm.verifyDetails();
    expect(wrapper.vm.verifyDetailsStatus).equal(true);
  });
  it('Check whether the verifyCode function verifies the verification code', done => {
    wrapper.vm.inputCode = 1000;
    wrapper.vm.requestId = 'd1ec833142954f0fba045566cd0a2714';
    wrapper.vm.verifyCode();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, request_id: 'd1ec833142954f0fba045566cd0a2714' },
        })
        .then(() => {
          expect(wrapper.vm.sendingCodeStatus).equal(false);
          expect(wrapper.vm.requestId).equal('');
          expect(wrapper.vm.verifyResponseNumber).equal(0);
          expect(wrapper.vm.verifyCodeStatus).equal(false);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the handleVerificationResponse function displays an error when a wrong code is sent', () => {
    let response = { data: { status: false, message: 'The code provided does not match the expected value' } };
    wrapper.vm.handleVerificationResponse(response);
    expect(wrapper.vm.sendingCodeStatus).equal(false);
    response = { data: { status: false, message: 'it has been verified already' } };
    wrapper.vm.handleVerificationResponse(response);
    response = { data: { status: false, message: 'Your request is incomplete and missing the mandatory parameter' } };
    wrapper.vm.handleVerificationResponse(response);
  });
  it('Check whether the bankBranchCheckpoint function removes trailing spaces from the branch name', () => {
    wrapper.vm.branch = ' Nairobi';
    wrapper.vm.bankBranchCheckpoint();
    expect(wrapper.vm.branch).equal('Nairobi');
  });
  it('Check whether the accountNameCheckpoint function removes trailing spaces from the account name', () => {
    wrapper.vm.name = ' Lewis';
    wrapper.vm.accountNameCheckpoint();
    expect(wrapper.vm.name).equal('Lewis');
  });
  it('Check whether the accountNoCheckpoint function removes trailing spaces from the account number', () => {
    wrapper.vm.account = ' 35423434556432';
    wrapper.vm.accountNoCheckpoint();
    expect(wrapper.vm.account).equal('35423434556432');
  });
  it('Check whether the bankDetailsCheckpoint function allows you to submit the bank details', () => {
    wrapper.vm.bankid = 2;
    wrapper.vm.bankDetailsCheckpoint();
    expect(wrapper.vm.submitStatus).equal(true);
  });
});
