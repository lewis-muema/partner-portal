import { expect } from 'chai';
import moment from 'moment';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/views/dashboard.vue';
import './localStorage';

describe('Dashboard.vue', () => {
  const wrapper = shallowMount(Dashboard, {
    sync: false,
  });
  wrapper.vm.dataResponse = {
    status: true,
    response: {
      cash_made_this_month: 'KES -100',
      cash_made_this_week: 'KES -20',
      average_rating_this_month: 4.1,
      average_rating_this_week: 2.2,
      trips_made_this_week: '0',
      hours_online_this_month: 400.11,
      hours_online_this_week: 30.8,
      trips_made_this_month: '0',
      next_transfer: 'KES -1106385.7500000002',
      monthly_earnings: [{ amount: '1090370', month: 'June', default_currency: 'KES' }, { amount: '6878496.749999999', month: 'July', default_currency: 'KES' }, { amount: '285000', month: 'August', default_currency: 'KES' }],
      total_riders: '39',
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
    expect(wrapper.vm.hoursPercentageMonth()).equal(Math.floor((wrapper.vm.dataResponse.response.hours_online_this_month / (moment().daysInMonth() * 24)) * 100));
  });
});
