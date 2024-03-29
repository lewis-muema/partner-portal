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
import freight from './views/freight/freight.vue';
import freightDashboard from './views/freight/dashboard.vue';
import freightOrders from './views/freight/orders.vue';
import freightOrderDetails from './views/freight/orderDetails.vue';
import freightPreferences from './views/freight/preferences.vue';
import bidding from './views/bidding/biddingWebForm';
import changeLanguage from './views/changeLanguage';
import webform from './views/bidding/biddingWebForm.vue';
import recipient from './views/bidRecipientOnboarding/landing.vue';
import withdrawalStatus from './views/withdrawalStatus.vue';
import myWithdrawals from './views/myWithdrawals.vue';
import emailVerification from './views/onboardingVerification/emailVerification.vue';


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
      path: '/change_language',
      name: 'change_language',
      component: changeLanguage,
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
    {
      path: '/bidding/:shipment_id/:owner_id/',
      name: 'bidding',
      component: bidding,
    },
    {
      path: '/recipient/:recipient_id',
      name: 'recipient',
      component: recipient,
    },
    {
      path: '/freight',
      name: 'freight',
      component: freight,
      children: [
        {
          path: 'dashboard',
          component: freightDashboard,
        },
        {
          path: 'orders',
          component: freightOrders,
        },
        {
          path: 'orders/:order',
          component: freightOrderDetails,
        },
        {
          path: 'preferences',
          component: freightPreferences,
        },
      ],
    },
    {
      path: '/withdrawal-status/:id',
      name: 'withdrawal-status',
      component: withdrawalStatus,
    },
    {
      path: '/myWithdrawals',
      name: 'myWithdrawals',
      component: myWithdrawals,
    },
    {
      path: '/verify',
      name: 'emailVerification',
      component: emailVerification,
    },
  ],
});
