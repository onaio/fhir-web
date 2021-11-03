import { SetStateAction } from 'react';
import { ConfigState, getAllConfigs, getConfig, LanguageCode, setAllConfigs, setConfig } from '../';

describe('pkg-configs/configStore', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have initial state', () => {
    expect(getConfig('languageCode')).toEqual('en');
    expect(getConfig('opensrpBaseURL')).toBeUndefined();
    expect(getAllConfigs()).toEqual({
      tablespref: undefined,
      appLoginURL: undefined,
      i18n: undefined,
      keycloakBaseURL: undefined,
      languageCode: 'en',
      opensrpBaseURL: undefined,
      fhirBaseURL: undefined,
      projectLanguageCode: 'core',
      defaultTablesPageSize: 5,
    });
  });

  it('stores and gets configuration correctly', () => {
    // action creators dispatch
    const sampleConfig = {
      languageCode: 'en',
    };
    setConfig('languageCode', sampleConfig.languageCode as SetStateAction<LanguageCode>);
    getConfig('languageCode');
  });

  it('bulk stores and gets configuration correctly', () => {
    // action creators dispatch
    const sampleConfig: ConfigState = {
      languageCode: 'sw',
      projectLanguageCode: 'eusm',
    };
    setAllConfigs(sampleConfig);
    expect(getAllConfigs()).toEqual(sampleConfig);
  });
});
