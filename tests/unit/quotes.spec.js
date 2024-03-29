import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import moxios from 'moxios';
import moment from 'moment';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quotes from '@/views/quotes.vue';
import './localStorage';
import messages from '@/mixins/messages';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

const localVue = createLocalVue();

describe('Quotes.vue', () => {
  const wrapper = shallowMount(Quotes, {
    sync: false,
    localVue,
    i18n,
  });
  const d = new Date();
  const order = [
    {
      duration_read: 12,
      msg: '',
      order_cop_name: 'Totally Real Business Ltd',
      economy_price_tiers: [
        {
          tier_group: 'small',
          price_tiers: [
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC441G153-MWD',
              tier_name: 'Economy',
              cost: 250,
              discountAmount: 0,
              vendor_name: 'Standard',
              standard_bike_order: 'AC4476153-6GE',
              tier_description: '<p>A perfect solution for your day-to-day deliveries. Flat fee anywhere in Nairobi!</p><ul><li>Base fee: KES 250</li><li>Delivery time: Within 4 hrs</li><li>Additional waiting time fee may apply if a Rider has waited 15mins: KES 100/30min</li></ul><p>? Max. size and weight: 50x30x30cm, 10kg<br />? Insurance cover up to KES 50,000 included</p>',
              vendor_description: '',
              eta: 5400,
              price_variance: 10,
              best_option: true,
              vendor_id: 22,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 320,
              customer_eta: '2019-06-28 03:26:06',
              tier_tag: 'economy_tier',
              status: true,
            },
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC44R2153-EYT',
              tier_name: 'Direct',
              cost: 340,
              discountAmount: 0,
              vendor_name: 'Express',
              tier_description: '<p>Your designated Bike Rider for urgent deliveries.</p><ul><li>Base fee (first 5km): KES 340</li><li>Extra distance: KES 20/km - after 5 km</li><li>Additional location: KES 100</li><li>Additional waiting time fee may apply if a Rider has waited 30mins: KES 100/30min</li></ul><p>? Insurance cover up to KES 50,000 included</p>',
              vendor_description: '',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 1,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 440,
              tier_tag: 'express_tier',
              status: true,
            },
          ],
        },
        {
          tier_group: 'medium',
          price_tiers: [
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC4457153-FME',
              tier_name: 'Direct',
              cost: 1550,
              discountAmount: 0,
              vendor_name: 'Pickup',
              tier_description: '<p>Your designated vehicle for medium loads.</p><ul><li>Loader: KES 500 (please request in order Notes)</li><li>Additional waiting time fee may apply if a Driver has waited 1 hour per destination: KES 150/30min</li></ul><p>? Insurance cover up to KES 5,000,000 included</p>',
              vendor_description: '',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 2,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 1800,
              tier_tag: 'express_tier',
              status: true,
            },
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC44MQ153-I9H',
              tier_name: 'Direct',
              cost: 1550,
              discountAmount: 0,
              vendor_name: 'Van',
              tier_description: '<p>Your designated vehicle for medium loads.</p><ul><li>Loader: KES 500 (please request in order Notes)</li><li>Additional waiting time fee may apply if a Driver has waited 1 hour per destination: KES 150/30min</li></ul><p>? Insurance cover up to KES 5,000,000 included</p>',
              vendor_description: '',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 3,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 1800,
              tier_tag: 'express_tier',
              status: true,
            },
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC44AC153-X41',
              tier_name: 'Direct',
              cost: 5900,
              discountAmount: 0,
              vendor_name: '3 Ton Truck',
              tier_description: '<p>Your designated vehicle for big loads.</p><ul><li>Additional Loader: KES 500 (please request in order Notes)</li><li>Additional waiting time fee may apply if a Driver has waited 1.5hrs per destination: KES 150/30min</li></ul><p>? First Loader included<br />? Insurance cover up to KES 5,000,000 included</p>',
              vendor_description: 'NPR',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 6,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 6150,
              tier_tag: 'express_tier',
              status: true,
            },
          ],
        },
        {
          tier_group: 'large',
          price_tiers: [
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC44BY153-PZK',
              tier_name: 'Direct',
              cost: 6500,
              discountAmount: 0,
              vendor_name: '5 Ton Truck',
              tier_description: '<p>Your designated vehicle for big loads.</p><ul><li>Additional Loader: KES 500 (please request in order Notes)</li><li>Additional waiting time fee may apply if a Driver has waited 1.5hrs per destination: KES 150/30min</li></ul><p>? First Loader included<br />? Insurance cover up to KES 5,000,000 included</p>',
              vendor_description: 'NKR',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 10,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 6800,
              tier_tag: 'express_tier',
              status: true,
            },
            {
              available_options: { refrigerated: true, flatbed: false },
              order_no: 'AC44CG153-YPP',
              tier_name: 'Direct',
              cost: 7400,
              discountAmount: 0,
              vendor_name: '10 Ton Truck',
              tier_description: '<p>Your designated vehicle for big loads.</p><ul><li>Additional Loader: KES 500 (please request in order Notes)</li><li>Additional waiting time fee may apply if a Driver has waited 2hrs per destination: KES 150/30min</li></ul><p>? First Loader included<br />? Insurance cover up to KES 5,000,000 included</p>',
              vendor_description: 'FRR/FH',
              eta: 2700,
              price_variance: 10,
              best_option: true,
              vendor_id: 14,
              loader_unit_cost: 500,
              tier_sub_title: 'Save time!',
              currency: 'KES',
              return_cost: 7750,
              tier_tag: 'express_tier',
              status: true,
            },
          ],
        },
      ],
      discountAmount: 0,
      insurance_status: true,
      client_id: 1041,
      path: [
        [
          {
            country_code: 'KE',
            more: {
              Otherdescription: '',
              Typed: '',
              FlatName: '',
              Address: 'Not Indicated',
              Estate: '',
              viewport: { southwest: { lng: 36.761785169709, lat: -1.3001272802915 }, northeast: { lng: 36.764483130292, lat: -1.2974293197085 } },
              Road: 'Junction Mall Parking Hall,  Ngong Rd',
              Vicinity: 'Not Indicated',
              Label: 'Junction Mall Parking Hall',
              HouseDoor: '',
              place_idcustom: 'ChIJcbhbs2saLxgRP6vWzb7XVbM',
              landmark: 'No landmark',
            },
            waypoint_details_status: true,
            name: 'Junction Mall Parking Hall',
            coordinates: '-1.2987826,36.76318070000002',
            recipient_name: null,
            recipient_phone: null,
          },
          {
            country_code: 'KE',
            more: {
              Otherdescription: '',
              Typed: '',
              FlatName: '',
              Address: 'Not Indicated',
              Estate: '',
              viewport: { southwest: { lng: 36.786630719708, lat: -1.2943993302915 }, northeast: { lng: 36.789328680291, lat: -1.2917013697085 } },
              Road: 'Unnamed Road,  Nairobi',
              Vicinity: 'Not Indicated',
              Label: '',
              HouseDoor: '',
              place_idcustom: 'ChIJJSSK3KMQLxgR1BOSSBSD5JQ',
              landmark: 'No landmark',
            },
            waypoint_details_status: true,
            name: 'Yaya Centre',
            coordinates: '-1.2928832,36.78806829999996',
            recipient_name: null,
            recipient_phone: null,
          },
        ],
      ],
      order_status: 1,
      carrier_type: 2,
      errand_cost_id: 2,
      from: '-1.2987826,36.76318070000002',
      return_cost: 6150,
      order_type: 3,
      price_info: '',
      generated_order_key: 'generated_reference_number:AC44G7152_9MD',
      from_details_status: true,
      economy_order_cost: 5900,
      to_details: {
        to_name: 'Yaya Centre',
        more: {
          Otherdescription: '',
          Typed: '',
          FlatName: '',
          Address: 'Not Indicated',
          Estate: '',
          viewport: { southwest: { lng: 36.786630719708, lat: -1.2943993302915 }, northeast: { lng: 36.789328680291, lat: -1.2917013697085 } },
          Road: 'Unnamed Road,  Nairobi',
          Vicinity: 'Not Indicated',
          Label: '',
          HouseDoor: '',
          place_idcustom: 'ChIJJSSK3KMQLxgR1BOSSBSD5JQ',
          landmark: 'No landmark',
        },
        to: 'ChIJJSSK3KMQLxgR1BOSSBSD5JQ',
      },
      rider_long: 36.781028,
      duration_near: 35,
      is_send_customer_receipt: true,
      license_status: 0,
      from_details: {
        more: {
          Otherdescription: '',
          Typed: '',
          FlatName: '',
          Address: 'Not Indicated',
          Estate: '',
          viewport: { southwest: { lng: 36.761785169709, lat: -1.3001272802915 }, northeast: { lng: 36.764483130292, lat: -1.2974293197085 } },
          Road: 'Junction Mall Parking Hall,  Ngong Rd',
          Vicinity: 'Not Indicated',
          Label: 'Junction Mall Parking Hall',
          HouseDoor: '',
          place_idcustom: 'ChIJcbhbs2saLxgRP6vWzb7XVbM',
          landmark: 'No landmark',
        },
        from: 'ChIJcbhbs2saLxgRP6vWzb7XVbM',
        from_name: 'Junction Mall Parking Hall',
      },
      take_delivery_photo: true,
      distance_read: 4,
      vendor_group_id: 1,
      user_id: 1472,
      pay_extra_one_way: 0,
      price_type: 1,
      end_address: 'Unnamed Road, Nairobi, Kenya',
      package_items: {},
      present: true,
      parent_order_no: 'AC44AC153-X41',
      verify_delivery_location: false,
      polyline: ['hs|Fcik_FASIIoAWgAMMAB[Jw@\\qCfBmN~@iIJoBD_CEoCImFOcKAy@IKKKYOyBCwB?u@?kAEqCGkBEeMMu@CEaBCgAEsD_@aWc@sSSkJCqBCoCEiA@w@Di@\\mBPuAZEb@GLDFp@JT'],
      city_id: 1,
      statusCode: 200,
      order_no: 'AC44AC153-X41',
      distance: '3.606 km',
      max_rider_orders: 5,
      rider_lat: -1.300138,
      errand_mode: 'one_way',
      from_name: 'Junction Mall Parking Hall, Nairobi',
      test_specs: {},
      duration: '12 mins',
      verify_pick_location: true,
      to_details_status: true,
      package_items_status: false,
      package_details: {
        max_temperature: 4,
        delivery_item: '',
        additional_loader: false,
        customer_min_amount: 0,
        no_of_loaders: 1,
        load_weight: 12,
        load_units: 'tonnes',
      },
      currency: 'KES',
      is_rerequest: false,
      delivery_verification: {
        delivery_image_status: true,
        security_code: [{ value: '1234' }],
        location_proximity: [{ pick_up: 2 }, { destination: 2 }],
        security_code_status: false,
        location_proximity_status: true,
        delivery_image: [{ document_tag: 'delivery_note', name: 'Delivery Note or Invoice' }],
      },
      tracking_id: 'AC44AC153-X41',
      vendor_type: 6,
      exclusive_strategy: 0,
      cost: 5900,
      to_name: 'Yaya Centre',
      return_distance: '4.2 km',
      delivery_instructions: {
        customer_destination_verification: { customer_phone: '' },
        cop_type_id: 1,
        mpesa_collection: {
          merchant_amount: 0,
          mpesa_account_number: '',
          mpesa_account_type: '',
          mpesa_payer_phone: '',
        },
        verify_customer_destination: false,
        collect_mpesa_merchant_status: false,
      },
      payment_option: 1,
      pay_method: 0,
      rider_phone: '0709779779',
      way_points: 1,
      return_distance_read: 5,
      no_destinations: 1,
      pay_extra_return: 0,
      hub: {
        contact_name: 'Collection point',
        contact_phone: '0723680311',
        name: 'Marsabit plaza collection point',
        location: '-1.300035,36.772876',
        id: '1',
        floor: '3rd floor room 309',
        building: 'Marsabit plaza Building',
      },
      cop_type_id: 1,
      start_address: 'Junction Mall Parking Hall, Ngong Rd, Nairobi, Kenya',
      to: '-1.2928832,36.78806829999996',
      fixed_cost: false,
      return: true,
      orderNotes: 'NOTES: Notes for this order',
      bid_status: 0,
      id: 1,
      fixedCost: true,
      vendorname: 'Freight',
      fromCity: 'Nairobi',
      toCity: 'Nairobi',
      bidPlaced: 0,
      confirmed: 0,
      orderTime: d.setMonth(d.getMonth() - 4),
      takeHome: 3920,
      bidAmount: 3920,
      orderNo: 'AC44AC153-X41',
      min_amount: 3500,
    },
  ];
  const vehicle = [
    {
      vehicle_id: '1342',
      registration_no: 'KAB 675T',
      model: null,
      make: null,
      vendor_disp_name: '10T Truck',
      carrier_type: '0',
      load_capacity: 28,
      vehicle_size: 0,
      vendor_type: 25,
      count: 0,
    },
    {
      vehicle_id: '1345',
      registration_no: 'KAA 655T',
      model: 'Actros',
      make: 'Mercedes',
      vendor_disp_name: '10T Truck',
      carrier_type: '0',
      load_capacity: null,
      vehicle_size: 0,
      vendor_type: 14,
      count: 1,
    },
  ];
  const rider = [
    {
      rider_id: '749',
      rider_name: 'Evans Meshack',
      id_no: '31211160',
      phone_no: '0736202130',
      rider_stat: '1',
      count: 0,
    },
    {
      rider_id: '1380',
      rider_name: 'Charles Kung&#039;u',
      id_no: '8979594',
      phone_no: '0715458867',
      rider_stat: '1',
      count: 1,
    },
    {
      rider_id: '17128',
      rider_name: 'Lewis Muema',
      id_no: '32652490',
      phone_no: '+254795510443',
      rider_stat: '1',
      count: 2,
    },
  ];
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
  wrapper.vm.orders = order;
  wrapper.vm.vehicles = vehicle;
  wrapper.vm.riders = rider;
  beforeEach(() => {
    moxios.install(axios);
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Check whether setDriverStatus changes the add driver status', () => {
    wrapper.vm.setDriverStatus();
    expect(wrapper.vm.addDriverStatus).equal(false);
  });
  it('Check whether setDriverStatus changes the add driver status', () => {
    wrapper.vm.setVehicleStatus();
    expect(wrapper.vm.addVehicleStatus).equal(false);
  });
  it('Check for order notes on the order', () => {
    expect(wrapper.vm.orderNotes(1)).equal('Notes for this order');
  });
  it('Check if the time format function returns the order time in the correct format', () => {
    expect(wrapper.vm.timeFormat(1)).equal(moment(d).format('ddd, Do MMM'));
  });
  it('Check if the timer function returns the timer in the correct format', () => {
    expect(wrapper.vm.timer(1)).equal('4 months ago');
  });
  it('Check if the currency format function returns the take home amount with the thousands separator', () => {
    expect(wrapper.vm.currencyFormat(1)).equal('3,920');
  });
  it('Check if the bid currency format function returns the min amount with the thousands separator', () => {
    expect(wrapper.vm.bidcurrencyFormat(1)).equal('3,500');
  });
  it('Check if the format distance function returns the rounded off value of distance', () => {
    expect(wrapper.vm.formatDistance(1)).equal(4);
  });
  it('Check if the short from name function returns a smaller pick up name to fit in the table column', () => {
    expect(wrapper.vm.shortFromName(1)).equal('Junction Mall Parkin...');
  });
  it('Check if the short to name function returns a smaller destination name to fit in the table column', () => {
    expect(wrapper.vm.shortToName(1)).equal('Yaya Centre');
  });
  it('Check if the vehicle name function returns the vendor_disp_name of the vehicle', () => {
    expect(wrapper.vm.vehicleName(0)).equal('10T Truck');
  });
  it('Check if the toggle vehicle function resets the required fields', () => {
    wrapper.vm.toggleVehicle(1);
    expect(wrapper.vm.count).equal(null);
    expect(wrapper.vm.regNo).equal(null);
    expect(wrapper.vm.insuNo).equal(null);
    expect(wrapper.vm.vehicleId).equal(null);
    expect(wrapper.vm.buttonDisabledStatus).equal(0);
    expect(wrapper.vm.addVehicleStatus).equal(true);
    expect(wrapper.vm.newVehicle).equal(true);
  });
  it('Check if the toggle rider function resets the required fields', () => {
    wrapper.vm.toggleDriver();
    expect(wrapper.vm.count1).equal(null);
    expect(wrapper.vm.driverName).equal(null);
    expect(wrapper.vm.driverPhone).equal('');
    expect(wrapper.vm.riderId).equal(null);
    expect(wrapper.vm.DL).equal(null);
    expect(wrapper.vm.ID).equal('');
    expect(wrapper.vm.buttonDisabledStatus).equal(0);
    expect(wrapper.vm.addVehicleStatus).equal(true);
    expect(wrapper.vm.newRider).equal(true);
  });
  it('Check if the confirm function verifies the all fields are not present and deactivates the button', () => {
    wrapper.vm.confirm(1);
    expect(wrapper.vm.buttonDisabledStatus).equal(0);
  });
  it('Check if the confirm function verifies the all fields are present and activates the button', () => {
    wrapper.vm.addDriverStatus = false;
    wrapper.vm.addVehicleStatus = false;
    wrapper.vm.ownerId = 10;
    wrapper.vm.vehicleId = 100;
    wrapper.vm.newVehicle = false;
    wrapper.vm.driverPhone = '+254700707070';
    wrapper.vm.orderNo = 'AC44AC153-X41';
    wrapper.vm.newRider = false;
    wrapper.vm.riderId = 3;
    wrapper.vm.partnerVendor = 3;
    wrapper.vm.confirm(1);
    expect(wrapper.vm.buttonDisabledStatus).equal(1);
  });
  it('Check if the details checker function for selecting a driver and selecting a vehicle verifies that all fields are present', () => {
    wrapper.vm.ownerId = 10;
    wrapper.vm.vehicleId = 100;
    wrapper.vm.newVehicle = false;
    wrapper.vm.driverPhone = '+254700707070';
    wrapper.vm.orderNo = 'AC44AC153-X41';
    wrapper.vm.newRider = false;
    wrapper.vm.riderId = 3;
    wrapper.vm.partnerVendor = 3;
    expect(wrapper.vm.detailsCheckForSelectingDriversAndSelectingVehicles()).equal(true);
  });
  it('Check if the details checker function for selecting a driver and adding a vehicle verifies that all fields are present', () => {
    wrapper.vm.ownerId = 10;
    wrapper.vm.newVehicle = true;
    wrapper.vm.driverPhone = '+254700707070';
    wrapper.vm.orderNo = 'AC44AC153-X41';
    wrapper.vm.newRider = false;
    wrapper.vm.insuNo = 'C00000';
    wrapper.vm.vendorType = 3;
    wrapper.vm.regNo = 'KAX 334L';
    wrapper.vm.box = 1;
    expect(wrapper.vm.detailsCheckForSelectingDriversAndAddingVehicles()).equal(true);
  });
  it('Check if the details checker function for adding a driver and adding a vehicle verifies that all fields are present', () => {
    wrapper.vm.ownerId = 10;
    wrapper.vm.newVehicle = true;
    wrapper.vm.driverPhone = '+254700707070';
    wrapper.vm.orderNo = 'AC44AC153-X41';
    wrapper.vm.newRider = true;
    wrapper.vm.insuNo = 'C00000';
    wrapper.vm.vendorType = 3;
    wrapper.vm.regNo = 'KAX 334L';
    wrapper.vm.box = 1;
    wrapper.vm.ID = '32000000';
    wrapper.vm.ownerPhone = '+254700000000';
    wrapper.vm.driverName = 'Test Driver';
    expect(wrapper.vm.detailsCheckForAddingDriversAndAddingVehicles()).equal(true);
  });
  it('Check if the details checker function for adding a driver and selecting a vehicle verifies that all fields are present', () => {
    wrapper.vm.ownerId = 10;
    wrapper.vm.vehicleId = 10;
    wrapper.vm.newVehicle = false;
    wrapper.vm.driverPhone = '+254700707070';
    wrapper.vm.orderNo = 'AC44AC153-X41';
    wrapper.vm.newRider = true;
    wrapper.vm.insuNo = 'C00000';
    wrapper.vm.vendorType = 3;
    wrapper.vm.regNo = 'KAX 334L';
    wrapper.vm.box = 1;
    wrapper.vm.ID = '32000000';
    wrapper.vm.ownerPhone = '+254700000000';
    wrapper.vm.driverName = 'Test Driver';
    wrapper.vm.partnerVendor = 3;
    expect(wrapper.vm.detailsCheckForAddingDriverSAndSelectingVehicles()).equal(true);
  });
  it('Check whether the driver selector function preloads all the required fields in preparation for sending payload', () => {
    wrapper.vm.riders = rider;
    wrapper.vm.count1 = 0;
    wrapper.vm.driverSelector(1);
    expect(wrapper.vm.driverName).equal('Evans Meshack');
  });
  it('Check whether the vehicle selector function preloads all the required fields in preparation for sending payload', () => {
    wrapper.vm.vehicles = vehicle;
    wrapper.vm.count = 0;
    wrapper.vm.vehicleSelector(1);
    expect(wrapper.vm.regNo).equal('KAB 675T');
    expect(wrapper.vm.vehicleId).equal('1342');
  });
  it('Check whether the browser is mobile', () => {
    expect(wrapper.vm.isMobile()).equal(false);
  });
  it('Check whether the get vehicles function fetches the correct data', done => {
    wrapper.vm.sessionInfo = sessionData;
    wrapper.vm.getVehicles(1);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            data: vehicle,
          },
        })
        .then(() => {
          expect(wrapper.vm.vehicles).equal(vehicle);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
});
