/* eslint-disable @typescript-eslint/camelcase */
import { getConfig } from '@opensrp/pkg-config';
import { loadLanguageResources, experimentalLanguageResource } from '@opensrp/react-utils';
import type { i18n as i18nInstance } from 'i18next';

const i18n = getConfig('i18n') as i18nInstance;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreFrJson = require('../locales/core/fr.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreArJson = require('../locales/core/ar.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmFrJson = require('../locales/eusm/fr.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmArJson = require('../locales/eusm/ar.json');

export const namespace = 'opensrp-plans';

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
  ar_core: {
    [namespace]: coreArJson,
  },
  ar_eusm: {
    [namespace]: eusmArJson,
  },
  fr_core: {
    [namespace]: coreFrJson,
  },
  fr_eusm: {
    [namespace]: eusmFrJson,
  },
  en_core: {
    [namespace]: coreEnJson,
  },
  en_eusm: {
    [namespace]: eusmEnJson,
  },
};

export { resources };

// loadLanguageResources(i18n, resources);

experimentalLanguageResource(i18n);

export default i18n;
