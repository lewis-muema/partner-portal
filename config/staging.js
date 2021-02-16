const packageJson = require('../package');

module.exports = {
  DOCKER_ENV: 'staging',
  NODE_ENV: 'production',
  VUE_APP_AUTH: 'https://authtest.sendyit.com/',
  ADONIS_PRIVATE_API: 'https://authtest.sendyit.com/adonis/',
  ADONIS_PARTNER_API: 'https://authtest.sendyit.com/partner-api/',
  ONBOARDING_PORTAL: 'https://partnertest.sendyit.com/onboarding_portal/#/',
  VERIFY_PHONE: 'https://apitest.sendyit.com/parcel/index.php/api/v10/verify_phone',
  CHECK_VERIFICATION: 'https://apitest.sendyit.com/parcel/index.php/api/v10/check_verification/',
  MIXPANEL: 'b36c8592008057290bf5e1186135ca2f',
  BASE: 'https://partnertest.sendyit.com/',
  GOOGLE_API_KEY: 'AIzaSyBClCBMpwB-uisYlmoKlDMF-X8bY4MoXqc',
  ELASTIC_APM_SERVER_URL: 'https://staging-elk.sendyit.com:8200',
  ELASTIC_APM_ENVIRONMENT: 'staging',
  ELASTIC_APM_SERVICE_VERSION: packageJson.version,
  PARTNERS_APP: 'https://authtest.sendyit.com/partners/',
  NODE_PARTNER_API: 'https://authtest.sendyit.com/partner/v1/',
  SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
  RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
  PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clientsstaging/',
  BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clientsstaging/',
  PEER_COP_SEARCH: 'https://gate.sendyit.com/solr/cop_peer_staging/',
  VEHICLE_SEARCH: 'https://gate.sendyit.com/solr/vehiclestaging/',
  SOLR_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyV01HZVR2WWZMVnlBSWwxOHFPVGFWMnRxMnFDVmpJZiIsIm5hbWUiOiJzb2xyIn0.p7uW30OQBaSEduNerbIaSbaQTdUAa-VkVMQUF4LAPFQ&wt=json&indent=true&row=10&sort=order_id%20desc',
  BIDDING_API_KEY: 'VbgJTYDPsfXGbERAMVeSWHu7uZHwzKW32X27mAStmN6vXEHKm8',
};
