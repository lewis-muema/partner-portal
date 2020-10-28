import axios from 'axios';
import moxios from 'moxios';
import moment from 'moment';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Statement from '@/views/statement.vue';
import './localStorage';

describe('Statement.vue', () => {
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
  const wrapper = shallowMount(Statement, {
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
  const vehiclesAndRiders = {
    status: true,
    vehicles: [
      {
        vehicle: {
          id: '562',
          model: 'maserati',
          insurance: 'insu_asfdsadfasf_438797.png',
          make: 'maserati',
          manufacture_year: 'n/a',
          insurance_no: '3452345',
          insurance_name: null,
          psv_no: 'n/a',
          log_book_no: null,
          log_book: null,
          registration_no: 'KAA 100K',
          photo: '',
          box: '1',
          vendor_type: '10',
          date_added: '2018-01-18 17:44:19',
          date_time: '2018-01-18 17:44:19',
          status: '1',
          owner: 'n/a',
          partner: '0',
          owner_id: '532',
          closed: '1',
          refrigerated: '0',
          verified: '0',
          country_code: null,
          vehicle_type: '0',
          carrier_type: '0',
          load_capacity: null,
          vehicle_size: '0',
        },
        rider: null,
        allocation: [
          {
            temp_rider_allocation_id: '221',
            token: 'QzJpq',
            rider_id: '17128',
            owner_id: '532',
            rider_phone: '+254795510441',
            vehicle_id: '562',
            date_allocated: '2019-07-10 14:10:38',
            date_completed: '2019-07-10 14:11:06',
            allocation_status: '3',
            allocation_type: '1',
            rider_migrated: '2',
            date_time: '2019-07-10 14:10:38',
            status: '1',
          },
        ],
      },
      {
        vehicle: {
          id: '568',
          model: 'mondo',
          insurance: 'insu_chris_606916.png',
          make: 'mondo',
          manufacture_year: 'n/a',
          insurance_no: '22222222',
          insurance_name: null,
          psv_no: 'n/a',
          log_book_no: null,
          log_book: null,
          registration_no: 'KAA 900',
          photo: '',
          box: '1',
          vendor_type: '14',
          date_added: '2018-01-18 17:44:19',
          date_time: '2018-01-18 17:44:19',
          status: '1',
          owner: 'n/a',
          partner: '746',
          owner_id: '532',
          closed: '1',
          refrigerated: '0',
          verified: '0',
          country_code: null,
          vehicle_type: '0',
          carrier_type: '0',
          load_capacity: null,
          vehicle_size: '0',
        },
        rider: {
          rider_id: '16933',
          f_name: 'Mike',
          s_name: 'Kihiu',
          password: '89014103211118510720',
          portal_password: '8cb2237d0679ca88db6464eac60da96345513964',
          phone_no: '+254739222002',
          phone_no_1: '89014103211118510720',
          email: 'griffin@sendy.co.ke',
          reg_id: null,
          phone_type: 'android',
          photo: 'hbhgstdgsm-screen-shot-2017-06-21-at-1.43.17-pm.png',
          gc_no: '11111',
          gc_copy: 'acq2qulyjd-screen-shot-2017-07-03-at-16.48.38.png',
          id_no: '29681027',
          id_copy: 'acq2qulyjd-screen-shot-2017-07-03-at-16.48.38.png',
          id_copy_2: 'acq2qulyjd-screen-shot-2017-07-03-at-16.48.38.png',
          dl_no: '11111',
          dl_copy: 'acq2qulyjd-screen-shot-2017-07-03-at-16.48.38.png',
          insu_no: '11111',
          insu_copy: 'acq2qulyjd-screen-shot-2017-07-03-at-16.48.38.png',
          bank_ac: '000',
          bank_name: '000',
          bank_branch: '000',
          rider_stat: '1',
          tracker: '1',
          owner_id: '532',
          dispute_docs_rb_2: '0',
          dispute_docs_rb: '11',
          owner_phone: '+254713493092',
          has_container: '0',
          status: '1',
          date_signed_up: '2017-06-21 13:47:29',
          carrier_type: '1',
          city_id: '1',
          comission: '20',
          vendor_type: '14',
          cop_id: null,
          user_id: null,
          pin: '0',
          approved: '1',
          off_boarding_data: '0000-00-00 00:00:00',
          number_plate: 'KAA 900',
          vehicle_name: 'mondo',
          partner_level: '3',
          referrer: '',
          exclusivity_status: '0',
          license_status: '1',
          insu_docs: '{"rider_picture":{"status":"filled","name":"Rider picture","date":"2017-04-24","expiry_date":"2017-04-24","message":"To update the document contact the Sendy rider team"},"pa_insurance":{"status":"filled","name":"Pa insurance","date":"2017-04-24","expiry_date":"2018-04-24","message":"To update the document contact the Sendy rider team"},"fidelity_guarantee_insurance":{"status":"filled","name":"Fidelity guarantee insurance","date":"2017-04-24","expiry_date":"2018-04-24","message":"To update the document contact the Sendy rider team"}}',
          kra_pin_no: null,
          kra_copy: null,
          log_book_copy: null,
          log_book_no: null,
          country_code: 'KE',
          default_currency: 'KES',
          city: null,
          neighborhood: null,
          nok_name: null,
          nok_phone: null,
          nok_id: null,
          nok_relationship: null,
          vehicle_id: '568',
          orders_received: '2994',
          orders_confirmed: '367',
          suspend_cron: '0',
          verified: '1',
          real_owner_id: null,
          driver_dob: null,
          driver_pob: null,
          signature: 'signature/t&c16933.jpg',
          suspend_reason: null,
          suspend_duration: null,
          rider_type: '1',
          rb: 'KES -1713338.8',
        },
        allocation: null,
      },
      {
        vehicle: {
          id: '1250',
          model: null,
          insurance: null,
          make: null,
          manufacture_year: null,
          insurance_no: '26579370',
          insurance_name: null,
          psv_no: '',
          log_book_no: null,
          log_book: null,
          registration_no: 'KAP 2800L',
          photo: null,
          box: '0',
          vendor_type: '10',
          date_added: '2019-02-10 19:45:51',
          date_time: '2019-02-10 19:45:51',
          status: '1',
          owner: null,
          partner: null,
          owner_id: '532',
          closed: '1',
          refrigerated: '0',
          verified: '0',
          country_code: null,
          vehicle_type: '0',
          carrier_type: '0',
          load_capacity: null,
          vehicle_size: '0',
        },
        rider: {
          rider_id: '678',
          f_name: 'Samuel ',
          s_name: 'Geno',
          password: '89254021094118331342',
          portal_password: null,
          phone_no: '0724899311',
          phone_no_1: '89254021094118331342',
          email: 'griffin@sendy.co.ke',
          reg_id: null,
          phone_type: 'android',
          photo: 'default_photo.jpg',
          gc_no: '111111',
          gc_copy: null,
          id_no: '11111',
          id_copy: null,
          id_copy_2: null,
          dl_no: '11111',
          dl_copy: null,
          insu_no: '11111',
          insu_copy: null,
          bank_ac: '1111111111',
          bank_name: 'KCB',
          bank_branch: 'Kimathi',
          rider_stat: '1',
          tracker: '0',
          owner_id: '1',
          dispute_docs_rb_2: '0',
          dispute_docs_rb: '0',
          owner_phone: '+254724899311',
          has_container: '0',
          status: '1',
          date_signed_up: '2018-01-29 09:40:49',
          carrier_type: '1',
          city_id: '1',
          comission: '20',
          vendor_type: '1',
          cop_id: null,
          user_id: null,
          pin: '0',
          approved: '1',
          off_boarding_data: '0000-00-00 00:00:00',
          number_plate: 'KAP 2800L',
          vehicle_name: null,
          partner_level: '3',
          referrer: '',
          exclusivity_status: '0',
          license_status: '0',
          insu_docs: '{"fidelity_guarantee_insurance":{"status":"not filled","name":"Fidelity guarantee insurance","date":"2017-04-28","expiry_date":"2017-04-27","message":"To update the document contact the Sendy rider team","link":"https:\\/\\/sendy.formstack.com\\/forms\\/fidelity_guarantee_insurance"},"carrier_liability_insurance":{"status":"not filled","name":"Carrier liability insurance","date":"2017-04-28","expiry_date":"2017-04-27","message":"To update the document contact the Sendy rider team","link":"https:\\/\\/sendy.formstack.com\\/forms\\/carrier_liability_insurance"},"partner_accident_insurance":{"status":"not filled","name":"Partner accident insurance","date":"2017-04-28","expiry_date":"2017-04-27","message":"To update the document contact the Sendy rider team","link":"https:\\/\\/sendy.formstack.com\\/forms\\/pa_insurance"},"partner_contract":{"status":"not filled","name":"Partner contract","date":"2017-04-28","expiry_date":"2017-04-27","message":"To update the document contact the Sendy rider team","link":"https:\\/\\/sendy.formstack.com\\/forms\\/partner_contract"}}',
          kra_pin_no: null,
          kra_copy: null,
          log_book_copy: null,
          log_book_no: null,
          country_code: 'KE',
          default_currency: 'KES',
          city: null,
          neighborhood: null,
          nok_name: null,
          nok_phone: null,
          nok_id: null,
          nok_relationship: null,
          vehicle_id: '1250',
          orders_received: '4316',
          orders_confirmed: '207',
          suspend_cron: '0',
          verified: '1',
          real_owner_id: null,
          driver_dob: null,
          driver_pob: null,
          signature: 'signature/t&c678.jpg',
          suspend_reason: null,
          suspend_duration: null,
          rider_type: '1',
          rb: 'KES -17974',
        },
        allocation: null,
      },
      {
        vehicle: {
          id: '1251',
          model: null,
          insurance: null,
          make: null,
          manufacture_year: null,
          insurance_no: 'bla bla',
          insurance_name: null,
          psv_no: '',
          log_book_no: null,
          log_book: null,
          registration_no: 'KAP 2700L',
          photo: null,
          box: '0',
          vendor_type: '10',
          date_added: '2019-02-10 19:48:32',
          date_time: '2019-02-10 19:48:32',
          status: '1',
          owner: null,
          partner: null,
          owner_id: '532',
          closed: '1',
          refrigerated: '0',
          verified: '0',
          country_code: null,
          vehicle_type: '0',
          carrier_type: '0',
          load_capacity: null,
          vehicle_size: '0',
        },
        rider: {
          rider_id: '1380',
          f_name: 'Charles',
          s_name: 'Kung&#039;u',
          password: '89254021014080844908',
          portal_password: null,
          phone_no: '0715458867',
          phone_no_1: '89254021014080844908',
          email: 'c.kung&#039;u66@gmail.com',
          reg_id: 'reg_id',
          phone_type: 'android',
          photo: '1501070464286id.jpg',
          gc_no: '8979594',
          gc_copy: '1501070797010pasport.jpg',
          id_no: '8979594',
          id_copy: '1501070464286id.jpg',
          id_copy_2: '1501070464286id.jpg',
          dl_no: 'J216354(DON42)',
          dl_copy: '1501070814740dl.jpg',
          insu_no: '8979594',
          insu_copy: '1501070464286id.jpg',
          bank_ac: '0',
          bank_name: '0',
          bank_branch: '0',
          rider_stat: '1',
          tracker: '1',
          owner_id: '1',
          dispute_docs_rb_2: '0',
          dispute_docs_rb: '0',
          owner_phone: '0715458867',
          has_container: '0',
          status: '1',
          date_signed_up: '2018-01-29 09:41:27',
          carrier_type: '1',
          city_id: '1',
          comission: '20',
          vendor_type: '14',
          cop_id: '0',
          user_id: '0',
          pin: '1234',
          approved: '1',
          off_boarding_data: '0000-00-00 00:00:00',
          number_plate: 'KAW 523H',
          vehicle_name: 'Canter',
          partner_level: '3',
          referrer: 'Charles',
          exclusivity_status: '0',
          license_status: '0',
          insu_docs: null,
          kra_pin_no: null,
          kra_copy: null,
          log_book_copy: null,
          log_book_no: null,
          country_code: 'KE',
          default_currency: 'KES',
          city: null,
          neighborhood: null,
          nok_name: null,
          nok_phone: null,
          nok_id: null,
          nok_relationship: null,
          vehicle_id: '1251',
          orders_received: '2',
          orders_confirmed: '2',
          suspend_cron: '0',
          verified: '1',
          real_owner_id: null,
          driver_dob: null,
          driver_pob: null,
          signature: null,
          suspend_reason: null,
          suspend_duration: null,
          rider_type: '0',
          rb: 'KES -24802',
        },
        allocation: [
          {
            temp_rider_allocation_id: '244',
            token: 'QNtzU',
            rider_id: '17162',
            owner_id: '532',
            rider_phone: '+254795510441',
            vehicle_id: '1251',
            date_allocated: '2019-08-23 10:53:50',
            date_completed: '2019-08-23 10:54:47',
            allocation_status: '2',
            allocation_type: '1',
            rider_migrated: '2',
            date_time: '2019-08-23 10:53:50',
            status: '1',
          },
        ],
      },
    ],
  };
  const dataResponse = {
    status: true,
    details: {
      statement: [
        {
          owner_id: '532',
          txn: 'AC27CH753-D31',
          amount: 'KES 1200',
          running_balance: 'KES -1858061',
          pay_narrative: 'Sendy Commission',
          pay_time: '2019-07-26 12:26:42',
          rider_name: 'Mike Kihiu',
          rider_id: '16933',
          vehicle_id: '568',
        },
        {
          owner_id: '532',
          txn: 'AC27CH753-D31',
          amount: 'KES -6000',
          running_balance: 'KES -1859261',
          pay_narrative: 'delivery',
          pay_time: '2019-07-26 12:26:42',
          rider_name: 'Mike Kihiu',
          rider_id: '16933',
          vehicle_id: '568',
        },
        {
          owner_id: '532',
          txn: 'AC27CH749-NDF',
          amount: 'KES 1200',
          running_balance: 'KES -1853261',
          pay_narrative: 'Sendy Commission',
          pay_time: '2019-07-26 12:21:09',
          rider_name: 'Mike Kihiu',
          rider_id: '16933',
          vehicle_id: '568',
        },
        {
          owner_id: '532',
          txn: 'AC27CH749-NDF',
          amount: 'KES -6000',
          running_balance: 'KES -1854461',
          pay_narrative: 'delivery',
          pay_time: '2019-07-26 12:21:09',
          rider_name: 'Mike Kihiu',
          rider_id: '16933',
          vehicle_id: '568',
        },
        {
          owner_id: '532',
          txn: 'AC27ZU742-A8F',
          amount: 'KES 1200',
          running_balance: 'KES -1848461',
          pay_narrative: 'Sendy Commission',
          pay_time: '2019-07-25 16:36:46',
          rider_name: 'Mike Kihiu',
          rider_id: '16933',
          vehicle_id: '568',
        },
      ],
      owner_balance: {
        currency: 'KES',
        rb: -1928789.8,
        is_withdrawal_day: false,
      },
    },
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
  it('Check whether the getVehicles function fetches the vehicles and riders object and separates it into separate arrays', done => {
    wrapper.vm.getVehicles();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: vehiclesAndRiders,
        })
        .then(() => {
          expect(wrapper.vm.vehArray[0].vehicle.model).equal(vehiclesAndRiders.vehicles[0].vehicle.model);
          expect(wrapper.vm.riders[1].f_name).equal('Samuel ');
          expect(wrapper.vm.vehicles[1].model).equal('mondo');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the handleResize function sets the window width', () => {
    wrapper.vm.handleResize();
    expect(wrapper.vm.windowWidth).equal(window.innerWidth);
  });
  it('Check whether the filt function throws an error when the to and from dates are not set', () => {
    wrapper.vm.filt();
    expect(wrapper.vm.error).equal('Please select both a from and to date');
  });
  it('Check whether the filt function initialtes the filter process', () => {
    wrapper.vm.from = '2019-08-01 00:00:00';
    wrapper.vm.to = '2019-08-31 23:59:59';
    wrapper.vm.filt();
    expect(wrapper.vm.monthPeriod).equal('01 August 2019 - 31 August 2019');
  });
  it('Check whether the fetchStatement function returns an error when the records returned are null on filter', done => {
    wrapper.vm.fetchStatement(2);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, details: { statement: [], owner_balance: { currency: 'KES', rb: -1928789.8, is_withdrawal_day: false } } },
        })
        .then(() => {
          expect(wrapper.vm.rows.length).equal(0);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the fetchStatement function returns the correct data on load', done => {
    wrapper.vm.fetchStatement(1);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
          status: true,
          details: {
            statement: [{
              owner_id: 3, txn: 'AR788B369-82J', payment_method: 12, amount: 60, running_balance: 3779948.2, currency: 'KES', pay_narrative: 'AR788B369-82J-Sale-Auto', pay_time: '2020-04-07T08:38:45.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR788B369-82J', payment_method: 12, amount: -300, running_balance: 3779888.2, currency: 'KES', pay_narrative: 'AR788B369-82J-Sale-Auto', pay_time: '2020-04-07T08:38:45.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR71FG198-V4T', payment_method: 12, amount: 60, running_balance: 3779988.2, currency: 'KES', pay_narrative: 'AR71FG198-V4T-Sale-Auto', pay_time: '2020-04-03T12:00:06.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR71FG198-V4T', payment_method: 12, amount: -300, running_balance: 3779928.2, currency: 'KES', pay_narrative: 'AR71FG198-V4T-Sale-Auto', pay_time: '2020-04-03T12:00:06.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR75A8715-UP2', payment_method: 13, amount: 50, running_balance: 3780228.2, currency: 'KES', pay_narrative: 'AR75A8715-UP2-Sale-Auto', pay_time: '2020-04-03T11:13:07.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR75A8715-UP2', payment_method: 0, amount: -250, running_balance: 3780178.2, currency: 'KES', pay_narrative: 'AR75A8715-UP2-Sale-Auto', pay_time: '2020-04-03T11:13:07.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR65EX948-D2M', payment_method: 13, amount: 50, running_balance: 3780428.2, currency: 'KES', pay_narrative: 'AR65EX948-D2M-Sale-Auto', pay_time: '2020-04-03T11:09:46.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'AR65EX948-D2M', payment_method: 0, amount: -250, running_balance: 3780378.2, currency: 'KES', pay_narrative: 'AR65EX948-D2M-Sale-Auto', pay_time: '2020-04-03T11:09:46.000Z', rider_name: 'Samuel  Geno', rider_id: 678, vehicle_id: 1349,
              }, {
              owner_id: 3, txn: 'test', payment_method: 11, amount: -400, running_balance: 3780228.2, currency: 'KES', pay_narrative: 'test-Others-Others-test', pay_time: '2020-04-02T04:35:45.000Z', rider_name: 'Sendy Rider', rider_id: 1, vehicle_id: 1347,
            }],
            owner_balance: { rb: [{ currency: 'KES', running_balance: -77857925.8 }], is_withdrawal_day: true, currencies: ['KES'] },
            },
          },
        })
        .then(() => {
          expect(wrapper.vm.rows.length).equal(9);
          expect(wrapper.vm.rows[0].txn).equal('AR788B369-82J');
          expect(wrapper.vm.rows[0].pay_narrative).equal('AR788B369-82J-Sale-Auto');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the definePayload function returns the correct payload with start date as first day of the month on first load', () => {
    /* prettier-ignore */
    expect(wrapper.vm.definePayload(1)).equal(`{"owner_id":"1198","from":"${moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')}","to":"${moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')}"}`);
  });
  it('Check whether the definePayload function returns the correct payload with selected filter dated on filter action', () => {
    wrapper.vm.from = '2014-08-01 00:00:00';
    wrapper.vm.to = '2019-08-31 23:59:59';
    expect(wrapper.vm.definePayload(2)).equal('{"owner_id":"1198","from":"2014-08-01 00:00:00","to":"2019-08-31 23:59:59","vehicle_id":null,"rider_id":null}');
  });
  it('Check whether the handleResponse function models the response into the accurate json', () => {
    const response = {
      data: dataResponse,
    };
    wrapper.vm.handleResponse(response);
    expect(wrapper.vm.rows[0].rider_name).equal('Mike Kihiu');
    expect(wrapper.vm.rows[0].txn).equal('AC27CH753-D31');
    expect(wrapper.vm.rows[0].pay_narrative).equal('Sendy Commission');
  });
  // it('Check whether the closePopup function changes the attibutes of the blinder and changes required data elements', () => {
  //   wrapper.vm.opened = true;
  //   wrapper.vm.closePopup();
  //   const blinder = wrapper.find('.statements__blinder');
  //   expect(blinder.exists()).equal(true);
  //   expect(blinder.attributes().style).equal('display: none;');
  //   expect(wrapper.vm.sendWithdrawStatus).equal(false);
  //   expect(wrapper.vm.addAccountStatus).equal(false);
  // });
  it('Check whether the checkDetails function activates the withdraw button if all conditions are met', () => {
    wrapper.vm.sendWithdrawStatus = false;
    wrapper.vm.amount = 200;
    wrapper.vm.checked = 1;
    wrapper.vm.checkDetails();
    expect(wrapper.vm.sendWithdrawStatus).equal(true);
  });
  it('Check whether the fetchOwnerBanks function fetches owner banks', done => {
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
          expect(wrapper.vm.bankAccounts[0].owner_bank_account_id).equal(41);
          expect(wrapper.vm.bankAccounts.length).equal(2);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the fetchAllBanks function fetches all banks', done => {
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
          expect(wrapper.vm.allBanks[0].payment_bank_id).equal(1);
          expect(wrapper.vm.allBanks[0].name).equal('KENYA COMMERCIAL BANK LTD');
          expect(wrapper.vm.allBanks.length).equal(45);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the checkedWithDrawal function preps for withdrawal to mpesa', () => {
    wrapper.vm.checkedWithDrawal(1, 0);
    expect(wrapper.vm.mpesaWithdrawal).equal(true);
    expect(wrapper.vm.bankWithdrawal).equal(false);
    expect(wrapper.vm.checked).equal(1);
  });
  it('Check whether the checkedWithDrawal function preps for withdrawal to bank', () => {
    wrapper.vm.bankAccounts = ownerBanks;
    wrapper.vm.allBanks = paymentBanks;
    wrapper.vm.checkedWithDrawal(10, 1);
    expect(wrapper.vm.mpesaWithdrawal).equal(false);
    expect(wrapper.vm.bankWithdrawal).equal(true);
    expect(wrapper.vm.selectedRow).equal(1);
    expect(wrapper.vm.checked).equal(1);
    expect(wrapper.vm.bankId).equal(2);
  });
  it('Check whether the withdraw function intitiates withdrawal for mpesa', done => {
    wrapper.vm.mpesaWithdrawal = true;
    wrapper.vm.bankWithdrawal = false;
    wrapper.vm.withdraw();
    expect(wrapper.vm.payload).equal('{"owner_id":"1198","phone_no":"+254722511046","payment_type":1,"amount":"200"}');
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status_code: 1,
            message: 'Request accepted for processing',
            status: true,
          },
        })
        .then(() => {
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the withdraw function intitiates withdrawal for bank', done => {
    wrapper.vm.mpesaWithdrawal = false;
    wrapper.vm.bankWithdrawal = true;
    wrapper.vm.withdraw();
    expect(wrapper.vm.payload).equal('{"owner_id":"1198","account_no":"00067855875","payment_type":2,"amount":"200","payment_bank_id":2}');
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status_code: 1,
            message: 'Request accepted for processing',
            status: true,
          },
        })
        .then(() => {
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check whether the listRiders function populates the riders array', () => {
    wrapper.vm.riders = [];
    wrapper.vm.listRiders();
    expect(wrapper.vm.riders[1].f_name).equal('Samuel ');
    expect(wrapper.vm.riders[1].s_name).equal('Geno');
  });
  it('Check whether the listVehicles function populates the vehicles array', () => {
    wrapper.vm.vehicles = [];
    wrapper.vm.listVehicles();
    expect(wrapper.vm.vehicles[1].model).equal('mondo');
  });
  it('Check whether the selectRider function gets the rider names using the rider_id', () => {
    wrapper.vm.selectRider('16933');
    expect(wrapper.vm.riderNames).equal('Mike Kihiu');
    wrapper.vm.selectRider('678');
    expect(wrapper.vm.riderNames).equal('Samuel  Geno');
  });
});
