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
      cash_made_this_month: 'KES -2600.00',
      cash_made_this_week: 'KES -400',
      average_rating_this_month: 0,
      average_rating_this_week: 0,
      trips_made_this_month: 358,
      trips_made_this_week: 0,
      hours_online_this_month: 5.2331,
      hours_online_this_week: 0,
      next_transfer: 'KES 3786948.20',
      monthly_earnings: [
        {
          amount: 98209,
          month: 'February',
          default_currency: 'KES',
        },
        {
          amount: 11988,
          month: 'March',
          default_currency: 'KES',
        },
        {
          amount: 1500,
          month: 'April',
          default_currency: 'KES',
        },
      ],
      total_riders: 9,
    },
  };
  it('Check whether cash made this month function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisMonth()).equal('KES 2,600');
  });
  it('Check whether cash made this week function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisWeek()).equal('KES 400');
  });
  it('Check whether next transfer function always returns a truncated positive', () => {
    expect(wrapper.vm.nextTransfer()).equal('KES 3,786,948');
  });
  it('Check whether weekly rating function always truncates the rating value', () => {
    expect(wrapper.vm.ratingThisWeek()).equal(0);
  });
  it('Check whether monthly rating function always truncates the rating value', () => {
    expect(wrapper.vm.ratingThisMonth()).equal(0);
  });
  it('Check whether weekly online hours function always truncates the hours', () => {
    expect(wrapper.vm.hoursOnlineThisWeek()).equal(0);
  });
  it('Check whether monthly online hours function always truncates the hours', () => {
    expect(wrapper.vm.hoursOnlineThisMonth()).equal(5);
  });
  it('Check whether weekly rating percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.ratingPercentage()).equal(0);
  });
  it('Check whether monthly rating percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.ratingPercentageMonth()).equal(0);
  });
  it('Check whether weekly hours online percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.hoursPercentageWeek()).equal(0);
  });
  it('Check whether monthly hours online percentage function always calculates the correct percentage', () => {
    expect(wrapper.vm.hoursPercentageMonth()).equal(Math.floor((wrapper.vm.dataResponse.response.hours_online_this_month / (moment().daysInMonth() * 24)) * 100));
  });
});
