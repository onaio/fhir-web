/* eslint-disable @typescript-eslint/camelcase */
import { getConfig } from '@opensrp/pkg-config';
import {
  loadLanguageResources,
  LanguageResourceTuples,
  generateLangRes,
} from './helpers/translationUtils';
import type { i18n as i18nInstance } from 'i18next';
import { useTranslation as useOrigTranslation } from 'react-i18next';

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreViJson = require('../locales/core/vi.json');

export const namespace = 'react-utils';

const resourcesTuple: LanguageResourceTuples = [
  ['ar', 'eusm', eusmArJson],
  ['ar', 'core', coreArJson],
  ['fr', 'core', coreFrJson],
  ['fr', 'eusm', eusmFrJson],
  ['en', 'eusm', eusmEnJson],
  ['en', 'core', coreEnJson],
  ['vi', 'core', coreViJson],
];

const resources = generateLangRes(resourcesTuple);

loadLanguageResources(i18n, resources, namespace);

export const useTranslation = () => {
  return useOrigTranslation(namespace);
};

export default i18n;
