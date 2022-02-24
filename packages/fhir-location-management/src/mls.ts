import { getConfig } from '@opensrp/pkg-config';
import { loadLanguageResources } from '@opensrp/react-utils';
import type { i18n as i18nInstance } from 'i18next';

const i18n = getConfig('i18n') as i18nInstance;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreEnJson = require('../locales/core/en.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eusmEnJson = require('../locales/eusm/en.json');

export const namespace = 'location-management';

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources = {
  en_core: {
    [namespace]: coreEnJson,
  },
  en_eusm: {
    [namespace]: eusmEnJson,
  },
};

loadLanguageResources(i18n, resources);

export default i18n;
