const packageJson = require('../package');

module.exports = {
  DOCKER_ENV: 'beta',
  NODE_ENV: 'production',
  VUE_APP_AUTH: 'https://auth.sendyit.com/',
  ADONIS_PRIVATE_API: 'https://auth.sendyit.com/adonis/',
  ADONIS_PARTNER_API: 'https://auth.sendyit.com/partner-api/',
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
  SOLR_BASE: 'https://gate.sendyit.com/solr/orders/',
  RIDER_SEARCH: 'https://gate.sendyit.com/solr/riders/',
  PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clients/',
  BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clients/',
  PEER_COP_SEARCH: 'https://gate.sendyit.com/solr/cop_peer/',
  VEHICLE_SEARCH: 'https://gate.sendyit.com/solr/vehicle/',
  SOLR_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyV01HZVR2WWZMVnlBSWwxOHFPVGFWMnRxMnFDVmpJZiIsIm5hbWUiOiJzb2xyIn0.p7uW30OQBaSEduNerbIaSbaQTdUAa-VkVMQUF4LAPFQ&wt=json&indent=true&row=10&sort=order_id%20desc',
  BIDDING_API_KEY: 'VbgJTYDPsfXGbERAMVeSWHu7uZHwzKW32X27mAStmN6vXEHKm8',
};
