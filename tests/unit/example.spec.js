import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/views/dashboard.vue';
import './localStorage';

describe('Dashboard.vue', () => {
  const wrapper = shallowMount(Dashboard, {
    sync: false,
  });
  wrapper.vm.dataResponse = {
    status: true,
    msg: {
      Cash_made_this_Month: 'KES -100',
      Cash_made_this_Week: 'KES -20',
      Average_Rating_this_Month: 4.1,
      Average_Rating_this_Week: 2.2,
      Trips_made_this_Week: '0',
      Hours_online_this_Month: 400.11,
      Hours_online_this_Week: 30.8,
      Trips_made_this_Month: '0',
      Next_transfer: 'KES -1106385.7500000002',
      Monthly_earnings: [{ amount: '1090370', month: 'June', default_currency: 'KES' }, { amount: '6878496.749999999', month: 'July', default_currency: 'KES' }, { amount: '285000', month: 'August', default_currency: 'KES' }],
      Total_Riders: '39',
    },
  };
  it('Check whether cash made this month function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisMonth()).equal('KES 100');
  });
  it('Check whether cash made this week function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisWeek()).equal('KES 20');
  });
  it('Check whether next transfer function always returns a truncated positive', () => {
    expect(wrapper.vm.nextTransfer()).equal('KES 1,106,385');
  });
  it('Check whether weekly rating function always truncates the rating value', () => {
    expect(wrapper.vm.ratingThisWeek()).equal(2);
  });
  it('Check whether monthly rating function always truncates the rating value', () => {
    expect(wrapper.vm.ratingThisMonth()).equal(4);
  });
  it('Check whether weekly online hours function always truncates the hours', () => {
    expect(wrapper.vm.hoursOnlineThisWeek()).equal(30);
  });
  it('Check whether monthly online hours function always truncates the hours', () => {
    expect(wrapper.vm.hoursOnlineThisMonth()).equal(400);
  });
  it('Check whether weekly rating percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.ratingPercentage()).equal(40);
  });
  it('Check whether monthly rating percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.ratingPercentageMonth()).equal(80);
  });
  it('Check whether weekly hours online percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.hoursPercentageWeek()).equal(17);
  });
  it('Check whether monthly hours online percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.hoursPercentageMonth()).equal(53);
  });
});
