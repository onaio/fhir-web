const configs = require('../i18next-parser.config');

/*eslint no-undef: "error"*/
/*eslint-env node*/

module.exports = {
  ...configs,
  output: 'src/locales/core/$LOCALE.json',
};
