import { getResourcesFromBundle, intlFormatDateStrings } from '../utils';
import * as config from '@opensrp/pkg-config';
import { careTeams } from './fixtures';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

jest.mock('@opensrp/pkg-config', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/pkg-config')),
}));

test('date formatting works correctly ', () => {
  jest.spyOn(config, 'getConfig').mockImplementation(() => {
    return { language: 'en_core' };
  });
  expect(intlFormatDateStrings('01 Jan 1970 00:00:00 GMT')).toEqual('1/1/1970');
  expect(intlFormatDateStrings('2011-10-10')).toEqual('10/10/2011');
  expect(intlFormatDateStrings('2011-10-10T14:48:00.000+09:00')).toEqual('10/10/2011');
  expect(intlFormatDateStrings()).toEqual('');

  jest.spyOn(config, 'getConfig').mockImplementation(() => {
    return { language: undefined };
  });
  expect(intlFormatDateStrings('01 Jan 1970 00:00:00 GMT')).toMatchInlineSnapshot(`"01/01/1970"`);

  jest.spyOn(config, 'getConfig').mockImplementation(() => {
    return { language: 'fr-FR' };
  });
  expect(intlFormatDateStrings('01 Jan 1970 00:00:00 GMT')).toEqual('01/01/1970');
});

test('getResourceFromBundle', () => {
  const response = getResourcesFromBundle<Record<string, unknown>>(careTeams as IBundle);
  expect(response).toHaveLength(6);
  expect(response.map((x) => x.id)).toEqual(['308', '325', '327', '330', '328', '326']);
});
