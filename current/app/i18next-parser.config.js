const configs = require('../i18next-parser.config');

module.exports = {
  ...configs,
  output: 'src/locales/core/$LOCALE.json',
};
