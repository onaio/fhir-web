/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_CODE, PROJECT_LANGUAGE_CODE } from './configs/env';

const fallbackLng = `en_core`;
const configuredLng = `${LANGUAGE_CODE}_${PROJECT_LANGUAGE_CODE}`;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('./locales/core/fr.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreArJson = require('./locales/core/ar.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmFrJson = require('./locales/eusm/fr.json');

export const namespace = 'app';

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
  ar_core: {
    [namespace]: coreArJson,
  },
  fr_core: {
    [namespace]: coreFrJson,
  },
  fr_eusm: {
    [namespace]: eusmFrJson,
  },
};

i18n
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: configuredLng,
    fallbackLng: fallbackLng,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    nsSeparator: '::',
    keySeparator: false,
  })
  .catch((err) => err);

export default i18n;
