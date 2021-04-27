import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import moxios from 'moxios';
import VueMask from 'v-mask';
import VModal from 'vue-js-modal';
import VueRouter from 'vue-router';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vehicles from '@/views/vehicles.vue';
import './localStorage';
import messages from '@/mixins/messages';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

Vue.use(VModal);
Vue.use(VueMask);

describe('Vehicles.vue', () => {
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
  const wrapper = shallowMount(Vehicles, {
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
  const allVehicles = {
    status: true,
    vehicles: [
      {
        vehicle: {
          id: '1289',
          model: 'Boxer',
          insurance: '1505381066719image.jpg',
          make: 'Boxer',
          manufacture_year: 'n/a',
          insurance_no: '25417014',
          insurance_name: null,
          psv_no: 'n/a',
          log_book_no: null,
          log_book: null,
          registration_no: 'KMCH',
          photo: '',
          box: '0',
          vendor_type: '20',
          date_added: '2018-01-29 09:41:31',
          date_time: '2018-01-29 09:41:31',
          status: '1',
          owner: 'n/a',
          partner: '0',
          owner_id: '1198',
          closed: '0',
          refrigerated: '0',
          verified: '1',
          vehicle_type: '0',
          carrier_type: '1',
          load_capacity: '0',
          vehicle_size: '0',
          vehicle_tag: '0',
        },
        rider: {
          rider_id: '1444',
          f_name: 'Phil',
          s_name: 'Samoei',
          password: '89254035020066560313',
          partner_level: '3',
          phone_no: '0722511046',
          phone_no_1: '89254035020066560313',
          email: 'psamoei@sendy.co.ke',
          reg_id: 'reg_id',
          phone_type: '1',
          photo: '1532007572695img_20180719_163637_174.jpg',
          gc_no: '25417014',
          gc_copy: '1505381090377image.jpg',
          id_no: '25417014',
          id_copy: '1505381066719image.jpg',
          id_copy_2: '1505381066719image.jpg',
          dl_no: '1234DFG',
          dl_copy: '1505381095741image.jpg',
          insu_no: '25417014',
          insu_copy: '1505381066719image.jpg',
          bank_ac: '0',
          bank_name: '0',
          bank_branch: '0',
          rider_stat: '1',
          tracker: '0',
          owner_id: '1',
          owner_phone: '0722511046',
          has_container: '722511046',
          status: '1',
          date_signed_up: '2019-07-20 07:00:05',
          carrier_type: '1',
          city_id: '1',
          comission: '20',
          vendor_type: '20',
          cop_id: '0',
          user_id: '0',
          pin: '1234',
          approved: '1',
          off_boarding_data: '0000-00-00 00:00:00',
          number_plate: 'KMCH',
          vehicle_name: 'Boxer',
          referrer: null,
          exclusivity_status: '0',
          license_status: '0',
          insu_docs: '{"fidelity_guarantee_insurance":{"status":"filled","name":"Fidelity guarantee insurance","date":"2017-04-28","expiry_date":"2020-04-27","message":"To update the document contact the Sendy rider team","link":"https://sendy.formstack.com/forms/fidelity_guarantee_insurance"},"carrier_liability_insurance":{"status":"filled","name":"Carrier liability insurance","date":"2017-04-28","expiry_date":"2020-04-27","message":"To update the document contact the Sendy rider team","link":"https://sendy.formstack.com/forms/carrier_liability_insurance"},"partner_accident_insurance":{"status":"filled","name":"Partner accident insurance","date":"2017-04-28","expiry_date":"2020-04-27","message":"To update the document contact the Sendy rider team","link":"https://sendy.formstack.com/forms/pa_insurance"},"partner_contract":{"status":"filled","name":"Partner contract","date":"2017-04-28","expiry_date":"2020-04-27","message":"To update the document contact the Sendy rider team","link":"https://sendy.formstack.com/forms/partner_contract"}}',
          kra_pin_no: null,
          kra_copy: null,
          log_book_copy: null,
          log_book_no: null,
          country_code: 'KE',
          default_currency: 'KES',
          rider_type: '0',
          city: null,
          neighborhood: null,
          nok_name: null,
          nok_phone: null,
          nok_id: null,
          nok_relationship: null,
          vehicle_id: '1289',
          orders_received: '106',
          orders_confirmed: '25',
          dispute_docs_rb: '0',
          suspend_cron: '0',
          verified: '1',
          real_owner_id: null,
          driver_dob: null,
          driver_pob: null,
          signature: 'signature/t&c1444.jpg',
          rider_tag: '0',
          rb: 'KES -4961',
        },
        allocation: [
          {
            temp_rider_allocation_id: 2416,
            token: 'ksBGY',
            rider_id: null,
            owner_id: 1198,
            rider_phone: '+254795510441',
            vehicle_id: 1289,
            date_allocated: '2019-07-22 15:25:22',
            date_completed: '2019-07-22 15:25:40',
            allocation_status: 4,
            allocation_type: 2,
            rider_migrated: 2,
            date_time: '2019-07-22 15:25:22',
            status: 1,
          },
        ],
      },
      {
        vehicle: {
          id: 3269,
          model: null,
          insurance: null,
          make: null,
          manufacture_year: null,
          insurance_no: 'A1234447463L',
          insurance_name: 'AON INSURANCE',
          psv_no: '',
          log_book_no: null,
          log_book: null,
          registration_no: 'KCJ-846VO',
          photo: null,
          box: 1,
          vendor_type: 20,
          date_added: '2019-05-22 02:59:21',
          date_time: '0000-00-00 00:00:00',
          status: 1,
          owner: null,
          partner: null,
          owner_id: 1198,
          closed: 0,
          refrigerated: 0,
          verified: 0,
          vehicle_type: 0,
          carrier_type: 1,
          load_capacity: 0,
          vehicle_size: 0,
          vehicle_tag: 0,
        },
        rider: null,
        allocation: [
          {
            temp_rider_allocation_id: 2562,
            token: '8uJx2',
            rider_id: null,
            owner_id: 1198,
            rider_phone: '+254795510441',
            vehicle_id: 3269,
            date_allocated: '2019-08-20 12:35:10',
            date_completed: '2019-08-20 12:37:58',
            allocation_status: 2,
            allocation_type: 2,
            rider_migrated: 2,
            date_time: '2019-08-20 12:35:10',
            status: 1,
          },
        ],
      },
    ],
  };
  wrapper.vm.sessionInfo = sessionData;
  it('Check whether the populateTable function creates the correct object to populate the table', () => {
    const response = {
      data: allVehicles,
    };
    wrapper.vm.populateTable(response);
    expect(wrapper.vm.rows[0].make).equal('Boxer');
  });
  it('Check whether the sortRidersActions function returns the correct rider action for the row', () => {
    // expect(wrapper.vm.sortRidersActions(allVehicles.vehicles[0]).action).equal('<span class="reassign-driver" id="1289">Reassign driver</span>');
    // expect(wrapper.vm.sortRidersActions(allVehicles.vehicles[1]).action).equal('<span class="add-driver" id="3269">Add driver</span>');
  });
  it('Check whether the sortAllocationStatus function returns the correct rider invite status for the row', () => {
    expect(wrapper.vm.sortAllocationStatus(allVehicles.vehicles[0])).equal('');
    // expect(wrapper.vm.sortAllocationStatus(allVehicles.vehicles[1])).equal('+254795510441 (Accepted)');
  });
  it('Check whether the handleResize function returns the inner width of the browser', () => {
    wrapper.vm.handleResize();
    expect(wrapper.vm.windowWidth).equal(window.innerWidth);
  });
  it('Check whether the sendDocuments function gives feedback when a rider is added', done => {
    wrapper.vm.vendorType = 20;
    wrapper.vm.make = 'Mercedes';
    wrapper.vm.model = 'Actros';
    wrapper.vm.mfg = '2011';
    wrapper.vm.box = 1;
    wrapper.vm.covered = 1;
    wrapper.vm.logBook = 'C0000';
    wrapper.vm.regNo = 'KAS 465L';
    wrapper.vm.insuNo = 'K337482L';
    wrapper.vm.vendorName = '28T truck';
    wrapper.vm.sendDocuments();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { status: true, vehicle_id: '1469', msg: 'vehicle added successfully' },
        })
        .then(() => {
          const error = wrapper.find('#upErr5');
          expect(error.exists()).equal(true);
          setTimeout(() => {
            expect(error.text()).equal('');
          }, 1000);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
    expect(wrapper.vm.vendorName).equal('28T truck');
  });
  it('Check whether the generatePreview function updates the loading previews based on before uploading is complete', () => {
    wrapper.vm.generatePreview('logBimg', 'logbook1.jpg');
    expect(wrapper.vm.logName).equal('logbook1.jpg');
    wrapper.vm.generatePreview('vehImag', 'vehicleImg1.jpg');
    expect(wrapper.vm.vehImgName).equal('vehicleImg1.jpg');
  });
  // it('Check whether the sanitizeFilename function appends the name with date_time and removes spaces', () => {
  //   expect(wrapper.vm.sanitizeFilename('isuzu d-max')).equal(`${new Date().getTime()}isuzud-max`);
  // });
});
