import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/logIn.vue';
import Pending from './views/pending.vue';
import Quotes from './views/quotes.vue';
import Orders from './views/orders.vue';
import Dashboard from './views/dashboard.vue';
import Banks from './views/banks.vue';
import Loans from './views/loans.vue';
import Savings from './views/savings.vue';
import Statement from './views/statement.vue';
import Vehicles from './views/vehicles.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'logIn',
      component: Login,
    },
    {
      path: '/pending',
      name: 'pending',
      component: Pending,
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: Quotes,
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/banks',
      name: 'banks',
      component: Banks,
    },
    {
      path: '/loans',
      name: 'loans',
      component: Loans,
    },
    {
      path: '/savings',
      name: 'savings',
      component: Savings,
    },
    {
      path: '/statement',
      name: 'statement',
      component: Statement,
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: Vehicles,
    },
  ],
});
