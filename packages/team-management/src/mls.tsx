/* eslint-disable @typescript-eslint/camelcase */
import { getConfigs } from '@opensrp/pkg-config';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('../locales/core/fr.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreArJson = require('../locales/core/ar.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
  fr_core: {
    translation: coreFrJson,
  },
  ar_core: {
    translation: coreArJson,
  },
};

// const configurable:
const languageCode = getConfigs().languageCode ?? 'en';
const projectLanguageCode = getConfigs().projectLanguageCode ?? 'core';

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
