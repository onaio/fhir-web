/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('../locales/core/fr.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmFrJson = require('../locales/eusm/fr.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  fr_core: {
    translation: coreFrJson,
  },
  fr_eusm: {
    translation: eusmFrJson,
  },
  en_core: {
    translation: coreEnJson,
  },
  en_eusm: {
    translation: eusmEnJson,
  },
};

initializei18n(i18n, resources);

export default i18n;
