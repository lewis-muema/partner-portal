const packageJson = require('../package');

module.exports = {
  DOCKER_ENV: 'beta',
  NODE_ENV: 'production',
  VUE_APP_AUTH: 'https://auth.sendyit.com/',
  ADONIS_PRIVATE_API: 'https://auth.sendyit.com/adonis/',
  ONBOARDING_PORTAL: 'https://partner.sendyit.com/onboarding_portal/#/',
  VERIFY_PHONE: 'https://api.sendyit.com/parcel/index.php/api/v10/verify_phone',
  CHECK_VERIFICATION: 'https://api.sendyit.com/parcel/index.php/api/v10/check_verification/',
  MIXPANEL: 'b36c8592008057290bf5e1186135ca2f',
  BASE: 'https://beta-partner.sendyit.com/',
  GOOGLE_API_KEY: 'AIzaSyAhkxyTtJznhU-kZ9wc1u6AXxChFu44Zww',
  ELASTIC_APM_SERVER_URL: 'https://apm.sendyit.com:443',
  ELASTIC_APM_SERVICE_VERSION: packageJson.version,
  PARTNERS_APP: 'https://auth.sendyit.com/partners/',
  NODE_PARTNER_API: 'https://auth.sendyit.com/partner/v1/',
};
