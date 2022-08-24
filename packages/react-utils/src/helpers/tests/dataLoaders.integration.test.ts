import flushPromises from 'flush-promises';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { FHIRServiceClass } from '../dataLoaders';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

afterEach(() => {
  nock.cleanAll();
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

afterAll(() => {
  nock.enableNetConnect();
});

test('Cancel delete method - test signal abort behavior', async () => {
  const baseUrl = 'https://test/fhir.org';
  const endpoint = 'CareTeam';
  nock(baseUrl).delete(`/${endpoint}/id`).reply(200);
  const controller = new AbortController();
  const signal = controller.signal;
  const fhir = new FHIRServiceClass(baseUrl, endpoint, signal);
  fhir.delete('id').catch((err) => {
    expect(err.message).toEqual('The user aborted a request.');
  });

  controller.abort();
  await flushPromises();
});
