const packageJson = require('../package');

module.exports = {
  DOCKER_ENV: 'development',
  NODE_ENV: 'development',
  VUE_APP_AUTH: 'https://authtest.sendyit.com/',
  ADONIS_PRIVATE_API: 'https://authtest.sendyit.com/adonis/',
  ONBOARDING_PORTAL: 'https://partnertest.sendyit.com/onboarding_portal/#/',
  VERIFY_PHONE: 'https://apitest.sendyit.com/parcel/index.php/api/v10/verify_phone',
  CHECK_VERIFICATION: 'https://apitest.sendyit.com/parcel/index.php/api/v10/check_verification/',
  MIXPANEL: 'b36c8592008057290bf5e1186135ca2f',
  BASE: 'http://localhost:8080/',
  GOOGLE_API_KEY: 'AIzaSyBnM4OCMY-uyLelgBSYBQycayIV3yCAwtc',
  ELASTIC_APM_SERVER_URL: 'https://staging-elk.sendyit.com:8200',
  ELASTIC_APM_SERVICE_VERSION: packageJson.version,
  ELASTIC_APM_ENVIRONMENT: 'development',
  PARTNERS_APP: 'https://authtest.sendyit.com/partners/',
  NODE_PARTNER_API: 'https://authtest.sendyit.com/partner/v1/',
};
