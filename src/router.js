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
import Tracking from './views/tracking.vue';
import DriverRequest from './views/driverRequest.vue';
import ExternalTracking from './views/externalTracking.vue';
import Documents from './views/documents.vue';
import Performance from './views/performance.vue';
import PerformanceStats from './views/performanceLoader.vue';
import ExternalLogin from './views/externalLogin.vue';
import Signature from './views/signature.vue';
import auxilliaryServices from './views/auxilliary/auxilliaryServices.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'logIn',
      component: Login,
    },
    {
      path: '/signature',
      name: 'signature',
      component: Signature,
    },
    {
      path: '/',
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
    {
      path: '/tracking',
      name: 'tracking',
      component: Tracking,
    },
    {
      path: '/external_login',
      name: 'externallogin',
      component: ExternalLogin,
    },
    {
      path: '/driveRequest/:token',
      name: 'driverRequest',
      component: DriverRequest,
    },
    {
      path: '/driveRequest',
      name: 'driverRequestBlank',
      component: DriverRequest,
    },
    {
      path: '/external-tracking/:id/:fromdate/:todate',
      name: 'externalTrackingAll',
      component: ExternalTracking,
    },
    {
      path: '/external-tracking/:id/:fromdate/',
      name: 'externalTrackingFrom',
      component: ExternalTracking,
    },
    {
      path: '/external-tracking/:id/',
      name: 'externalTrackingId',
      component: ExternalTracking,
    },
    {
      path: '/external-tracking/',
      name: 'externalTrackingBlank',
      component: ExternalTracking,
    },
    {
      path: '/performance',
      name: 'performance',
      component: Performance,
    },
    {
      path: '/performance/partner-stats',
      name: 'partner-stats',
      component: PerformanceStats,
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents,
    },
    {
      path: '/auxilliary',
      name: 'auxilliary',
      component: auxilliaryServices,
    },
  ],
});
