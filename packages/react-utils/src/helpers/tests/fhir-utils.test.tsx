import {
  getObjLike,
  IdentifierUseCodes,
  loadAllResources,
  parseFhirHumanName,
} from '../fhir-utils';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

beforeAll(() => {
  nock.disableNetConnect();
  store.dispatch(
    authenticateUser(
      true,
      {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      },
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});
test('get obj like works correctly', () => {
  let res = getObjLike(undefined, 'key', 'value');
  expect(res).toEqual([]);

  const objs = [
    { key: 'value' },
    { key: 'value', oKey: 'oValue' },
    { name: 'fName' },
    { complexValueKey: { why: 'since [] != []' } },
  ];
  res = getObjLike(objs, 'key', 'value');
  expect(res).toEqual([objs[0]]);

  res = getObjLike(objs, 'key', 'value', true);
  expect(res).toEqual([objs[0], objs[1]]);

  res = getObjLike(objs, 'complexValueKey', { why: 'since [] != []' }, true);
  expect(res).toEqual([objs[3]]);
});

test('identifier use codes defined correctly', () => {
  expect(Object.entries(IdentifierUseCodes)).toEqual([
    ['USUAL', 'usual'],
    ['OFFICIAL', 'official'],
    ['TEMP', 'temp'],
    ['SECONDARY', 'secondary'],
    ['OLD', 'old'],
  ]);
});

test('loadAllResources works correctly', async () => {
  const baseUrl = 'http://test.server.org';
  const endpoint = 'youAreAwesome';

  nock(baseUrl)
    .get(`/${endpoint}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${endpoint}/_search`)
    .query({ _count: 1000 })
    .reply(200, [])
    .persist();
  const res = await loadAllResources(baseUrl, endpoint, {});
  const res1 = await loadAllResources(baseUrl, endpoint);
  expect(res).toEqual([]);
  expect(res1).toEqual([]);
});

test('parse fhir human name works correctly', () => {
  expect(parseFhirHumanName()).toBeUndefined();
  const humanName1 = {};
  expect(parseFhirHumanName(humanName1)).toEqual('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const humanName2: any = {
    use: 'official',
    family: 'Park',
    given: ['Apple'],
    suffix: ['MD'],
    prefix: ['Mr'],
  };
  expect(parseFhirHumanName(humanName2)).toEqual('Mr Apple Park MD');
});
