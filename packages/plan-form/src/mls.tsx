/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { planFormConfigs } from './helpers/configs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreSwJson = require('../locales/core/sw.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmSwJson = require('../locales/eusm/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
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

// const configurable:
const languageCode = planFormConfigs.languageCode ?? 'en';
const projectLanguageCode = planFormConfigs.projectLanguageCode ?? 'core';

i18n
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: `${languageCode}_${projectLanguageCode}`,
    fallbackLng: `${languageCode}_${projectLanguageCode}`,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  })
  .catch((err) => err);

export default i18n;
