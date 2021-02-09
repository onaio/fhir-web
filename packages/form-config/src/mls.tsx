/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreSwJson = require('../locales/core/sw.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmSwJson = require('../locales/eusm/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  en_core: {
    translation: coreEnJson,
  },
  sw_core: {
    translation: coreSwJson,
  },
  en_eusm: {
    translation: eusmEnJson,
  },
  sw_eusm: {
    translation: eusmSwJson,
  },
};

initializei18n(i18n, resources);

export default i18n;
