import { store } from '@opensrp/store';
import reducerRegistry from '@onaio/redux-reducer-registry';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getConfigs, initializei18n } from '../configs';
import { addConfigs, configsReducer, configsSliceName } from '../ducks';
/* eslint-disable @typescript-eslint/camelcase */

reducerRegistry.register(configsSliceName, configsReducer);

describe('configs/getConfigs', () => {
  const languageConfigs = {
    languageCode: 'fr',
    projectLanguageCode: 'core',
  };

  beforeAll(() => {
    store.dispatch(addConfigs(languageConfigs));
  });

  it('gets language configs from store', () => {
    expect(getConfigs()).toEqual(languageConfigs);
  });
});

describe('configs/initializei18n', () => {
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

    initializei18n(resources);
    expect(mockUse).toHaveBeenCalledWith(initReactI18next);
    expect(mockInit).toHaveBeenCalledWith({
      resources,
      lng: 'fr_core',
      fallbackLng: ['fr_core'],
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    });
  });
});
