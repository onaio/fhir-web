import { SetStateAction } from 'react';
import { getConfig, LanguageCode, setConfig } from '../';

describe('pkg-configs/configStore', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have initial state', () => {
    expect(getConfig('languageCode')).toEqual({});
  });

  it('stores and gets configuration correctly', () => {
    // action creators dispatch
    const sampleConfig = {
      languageCode: 'en',
    };
    setConfig('languageCode', sampleConfig.languageCode as SetStateAction<LanguageCode>);
    getConfig('languageCode');
  });
});
