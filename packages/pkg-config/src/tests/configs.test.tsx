import i18n from 'i18next';
import { SetStateAction } from 'react';
import { initReactI18next } from 'react-i18next';
import { initializei18n } from '../configs';
import { LanguageCode, ProjectLanguageCode, setConfig } from '../configStore';
/* eslint-disable @typescript-eslint/camelcase */

describe('configs/initializei18n', () => {
  const languageConfigs = {
    languageCode: 'fr',
    projectLanguageCode: 'core',
  };
  beforeAll(() => {
    setConfig('languageCode', languageConfigs.languageCode as SetStateAction<LanguageCode>);
    setConfig(
      'projectLanguageCode',
      languageConfigs.projectLanguageCode as SetStateAction<ProjectLanguageCode>
    );
  });

  it('initializes i18n', () => {
    const mockUse = jest.spyOn(i18n, 'use');
    const mockInit = jest.spyOn(i18n, 'init');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const translation = require('./translation.json');
    // the format to load the resource files: <languageCode>_<projectCode>. in small
    const resources = {
      fr_core: {
        translation: translation,
      },
    };

    initializei18n(i18n, resources);
    expect(mockUse).toHaveBeenCalledWith(initReactI18next);
    expect(mockInit).toHaveBeenCalledWith({
      resources,
      lng: 'fr_core',
      fallbackLng: ['fr_core'],
      interpolation: { escapeValue: false },
      returnEmptyString: false,
      nsSeparator: '::',
    });
  });
});
