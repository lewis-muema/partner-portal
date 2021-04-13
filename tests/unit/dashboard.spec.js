import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { expect } from 'chai';
import moment from 'moment';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/views/dashboard.vue';
import './localStorage';

Vue.use(VueI18n);
const i18n = new VueI18n({});

describe('Dashboard.vue', () => {
  const wrapper = shallowMount(Dashboard, {
    sync: false,
    i18n,
  });
  wrapper.vm.activeCurrency = 'KES';
  wrapper.vm.currencyStats = {
    KES: {
      cashMadeThisMonth: 100,
      cashMadeThisWeek: 200,
      averageTripsThisMonth: 30,
      averageTripsThisWeek: 10,
      nextTransfer: '3779948.20',
      monthlyEarnings: [
        {
          amount: 96978,
          month: 'February',
          currency: 'KES',
        },
        {
          amount: 11988,
          month: 'March',
          currency: 'KES',
        },
        {
          amount: 1500,
          month: 'April',
          currency: 'KES',
        },
      ],
      totalOrders: [
        {
          totalOrders: 6,
          currency: 'KES',
          month: 'April',
        },
        {
          totalOrders: 15,
          currency: 'KES',
          month: 'February',
        },
        {
          totalOrders: 79,
          currency: 'KES',
          month: 'January',
        },
        {
          totalOrders: 3,
          currency: 'KES',
          month: 'March',
        },
        {
          totalOrders: 222,
          currency: 'KES',
          month: 'May',
        },
      ],
    },
  };
  wrapper.vm.ownerStats = {
    averageRatingThisWeek: 3,
    averageRatingThisMonth: 4,
    hoursOnlineThisMonth: 0.023,
    hoursOnlineThisWeek: 0.023,
  };
  it('Check whether cash made this month function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisMonth).equal(100);
  });
  it('Check whether cash made this week function always returns a positive', () => {
    expect(wrapper.vm.cashMadeThisWeek).equal(200);
  });
  it('Check whether next transfer function always returns a truncated positive', () => {
    expect(wrapper.vm.nextTransfer).equal(3779948.2);
  });
  it('Check whether weekly rating function always returns the correct rating array', () => {
    expect(wrapper.vm.ratingThisWeek()[0]).equal(1);
    expect(wrapper.vm.ratingThisWeek()[1]).equal(1);
    expect(wrapper.vm.ratingThisWeek()[2]).equal(1);
    expect(wrapper.vm.ratingThisWeek()[3]).equal(0);
    expect(wrapper.vm.ratingThisWeek()[4]).equal(0);
  });
  it('Check whether monthly rating function always returns the correct rating array', () => {
    expect(wrapper.vm.ratingThisMonth()[0]).equal(1);
    expect(wrapper.vm.ratingThisMonth()[1]).equal(1);
    expect(wrapper.vm.ratingThisMonth()[2]).equal(1);
    expect(wrapper.vm.ratingThisMonth()[3]).equal(1);
    expect(wrapper.vm.ratingThisMonth()[4]).equal(0);
  });
  it('Check whether weekly online hours function always returns the correct the hours', () => {
    expect(wrapper.vm.hoursOnlineThisWeek()).equal('0.02');
  });
  it('Check whether monthly online hours function always returns the correct the hours', () => {
    expect(wrapper.vm.hoursOnlineThisMonth()).equal('0.02');
  });
  it('Check whether currencies function always returns the correct currencies array', () => {
    expect(wrapper.vm.currencies[0]).equal('KES');
  });
  it('Check whether ordersDataPoints function always calculates the correct data for the chart', () => {
    expect(wrapper.vm.ordersDataPoints.datasets[0].label).equal('Total Orders');
    expect(wrapper.vm.ordersDataPoints.labels[0]).equal('April');
    expect(wrapper.vm.ordersDataPoints.datasets[0].data[0]).equal(6);
  });
  it('Check whether revenueDataPoints function always calculates the correct data for the chart', () => {
    expect(wrapper.vm.revenueDataPoints.datasets[0].label).equal('Amount earned (KES)');
    expect(wrapper.vm.revenueDataPoints.labels[0]).equal('February');
    expect(wrapper.vm.revenueDataPoints.datasets[0].data[0]).equal(96978);
  });
});
