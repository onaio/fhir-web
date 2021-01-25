import * as configs from '@opensrp/pkg-config';

/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/pkg-config', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/pkg-config')),
}));

describe('src/mls', () => {
  it('initializes i18n', () => {
    const mockInit = jest.spyOn(configs, 'initializei18n');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const translation = require('./translation.json');
    // the format to load the resource files: <languageCode>_<projectCode>. in small
    const resources: configs.LanguageResources = {
      fr_core: {
        translation: translation,
      },
    };

    configs.initializei18n(resources);

    expect(mockInit).toHaveBeenCalledWith(resources);
  });
});
