/* eslint-disable @typescript-eslint/camelcase */
import { getConfig } from '@opensrp/pkg-config';
import { loadLanguageResources, LanguageResourceGroups } from '@opensrp/react-utils';
import type { i18n as i18nInstance } from 'i18next';
import { useTranslation as useOrigTranslation, UseTranslationOptions } from 'react-i18next';

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

export const namespace = 'fhir-care-team';

const resourceGroups: LanguageResourceGroups = {
  core: {
    ar: coreArJson,
    en: coreEnJson,
    fr: coreFrJson,
  },
  eusm: {
    ar: eusmArJson,
    en: eusmEnJson,
    fr: eusmFrJson,
  },
};

loadLanguageResources(i18n, resourceGroups, namespace);

export const useTranslation = (ns?: string, options?: UseTranslationOptions) => {
  return useOrigTranslation(ns ? ns : namespace, options);
};
