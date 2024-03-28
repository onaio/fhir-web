/**
 * This package will provide traslation locale files for all the different opensrp-web component
 * libraries. We will not expose an api that allows for a way to configure, extend or overriding
 * the string resources. Users who wish to update the translation files will have to do so manually
 * by submitting a pr to the repo, and then use an updated version of this package.
 *
 * TODO - In the future; we might be able to get the i18n istance from pkg-config and use it (load our opensrp lang resources into this i18n instance).
 * This would allow a way where users can use a single i18n instance for their app and the installed @opensrp packages,
 * they would then be able to extend, and override the translations from their own external locale string resources.
 *
 * Configuration parameters consumed by this package include:
 *  - language code, which is the language code of the current project
 *  - project language code, which is the language code of the current project
 */
import { initReactI18next, I18nextProvider, I18nextProviderProps } from 'react-i18next';
import { getConfig } from '@opensrp/pkg-config';
import i18next from 'i18next';
import LanguageDetector, {DetectorOptions} from "i18next-browser-languagedetector";
import { resources } from './resources';
import React from 'react';

const lngLocalStorageKey = 'i18nextLng';
const locaStorageCache = 'localStorage';
const domain = window.location.hostname
const newInstance = i18next.createInstance();

const languageCode = getConfig('languageCode');
const projectCode = getConfig('projectCode');
const fallbackLng = `en-core`;
const configuredLng = `${languageCode}-${projectCode}`;

const languageDetectorOptions = {
  lookupLocalStorage: lngLocalStorageKey,
  caches: [locaStorageCache]
}

const setLngToLocalStorage = (lng:string) => localStorage.setItem(lngLocalStorageKey, lng);
const getLngFromLocalStorage = () => {
  const lng = localStorage.getItem(lngLocalStorageKey)
  return lng;
}

const cacheUserLanguage = (lng:string, options:DetectorOptions) => {
  const { caches } = options;
  if (caches?.includes(locaStorageCache)) {
    const storedLng = getLngFromLocalStorage()
    setLngToLocalStorage(lng)
  }
}

const customLanguageDetector = {
  name: "customLanguageDetector",
  cacheUserLanguage: cacheUserLanguage,
  lookup() {
    // options -> are passed in options
    return 'en';
  },
}
const languageDetector = new LanguageDetector();
languageDetector.addDetector(customLanguageDetector);

newInstance
  .use(languageDetector)
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: languageDetectorOptions,
    resources,
    lng: configuredLng,
    fallbackLng: fallbackLng,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    nsSeparator: '::',
    keySeparator: false,
    debug: false,
    react: {
      useSuspense: process.env.NODE_ENV === 'test' ? false : true,
    },
  })
  .catch((_) => {
    // TODO: do something with error
  });

export { newInstance as opensrpI18nInstance };

// also need to export iI18 provider

export type OpensrpWebI18nProviderProps = Omit<I18nextProviderProps, 'i18n'>;

/**
 * @param props - provider props
 */
export function OpensrpWebI18nProvider(props: OpensrpWebI18nProviderProps) {
  return <I18nextProvider i18n={newInstance}>{props.children}</I18nextProvider>;
}
