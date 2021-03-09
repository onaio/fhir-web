import { Dictionary } from '@onaio/utils';
import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getConfig } from './configStore';

export interface LanguageResource {
  translation: Dictionary;
}

export interface LanguageResources {
  ar_core?: LanguageResource;
  ar_eusm?: LanguageResource;
  fr_core?: LanguageResource;
  fr_eusm?: LanguageResource;
  en_core?: LanguageResource;
  en_eusm?: LanguageResource;
  sw_eusm?: LanguageResource;
  sw_core?: LanguageResource;
  th_core?: LanguageResource;
}

export const initializei18n = (i18next: typeof i18n, opensrpResources: LanguageResources) => {
  const languageCode = getConfig('languageCode');
  const projectLanguageCode = getConfig('projectLanguageCode');
  const resources = (opensrpResources as unknown) as Resource;

  i18next
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      resources,
      lng: `${languageCode}_${projectLanguageCode}`,
      fallbackLng: `${languageCode}_${projectLanguageCode}`,
      interpolation: { escapeValue: false },
      returnEmptyString: false,
      nsSeparator: '::',
    })
    .catch((err) => err);
};
