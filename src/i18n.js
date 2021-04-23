import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import store from './store';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('./locales/locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
  const messages = {};

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}


const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});

function fetchCountry() {
  const { EXTREME_IP_KEY } = process.env;
  axios(`https://extreme-ip-lookup.com/json/?key=${EXTREME_IP_KEY}`)
    .then((response) => {
      i18n.locale = response.data.countryCode === 'FR' || response.data.countryCode === 'CI' ? 'fr' : 'en';
      const lang = response.data.countryCode === 'FR' || response.data.countryCode === 'CI' ? `fr-${response.data.countryCode}` : 'en-US,en;q=0.9';
      const locale = response.data.countryCode === 'FR' || response.data.countryCode === 'CI' ? 'fr' : 'en';
      store.commit('setLanguage', locale);
      localStorage.setItem('timeLocale', locale);
      localStorage.setItem('language', lang);
      localStorage.setItem('countryCode', response.data.countryCode);
    })
    .catch(error => error);
}

fetchCountry();

export default i18n;
