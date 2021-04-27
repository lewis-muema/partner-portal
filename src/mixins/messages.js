function loadLocaleMessages() {
    const locales = require.context('../../src/locales/locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
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

const messages = loadLocaleMessages();

export default messages;
