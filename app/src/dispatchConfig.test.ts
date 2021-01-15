import './dispatchConfig';
import { store } from '@opensrp/store';
import { configsSliceName } from '@opensrp/pkg-config';

jest.mock('./configs/env');

it('can dispatch configs', () => {
  expect(store.getState()[configsSliceName]).toEqual({
    languageCode: 'en',
    projectLanguageCode: 'eusm',
  });
});
