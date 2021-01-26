/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('../locales/core/fr.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreArJson = require('../locales/core/ar.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  fr_core: {
    translation: coreFrJson,
  },
  ar_core: {
    translation: coreArJson,
  },
};

initializei18n(i18n, resources);

export default i18n;
