/* eslint-disable @typescript-eslint/camelcase */
import { getConfig } from '@opensrp/pkg-config';
import { loadLanguageResources } from '@opensrp/react-utils';
import type { i18n as i18nInstance } from 'i18next';

const i18n = getConfig('i18n') as i18nInstance;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('../locales/core/fr.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreThJson = require('../locales/core/th.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreArJson = require('../locales/core/ar.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmFrJson = require('../locales/eusm/fr.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmArJson = require('../locales/eusm/ar.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
  ar_core: {
    translation: coreArJson,
  },
  ar_eusm: {
    translation: eusmArJson,
  },
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
  th_core: {
    translation: coreThJson,
  },
};

loadLanguageResources(i18n, resources);

export default i18n;
