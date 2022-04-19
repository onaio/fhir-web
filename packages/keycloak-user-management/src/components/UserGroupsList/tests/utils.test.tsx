import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as fixtures from './fixtures';
import { loadGroupDetails, loadGroupMembers } from '../utils';
import fetch from 'jest-fetch-mock';
import flushPromises from 'flush-promises';

const mockBaseURL = 'https://example.com/rest';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('dataLoading', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('loadGroupDetails works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.userGroup1));
    loadGroupDetails(fixtures.userGroup1.id, mockBaseURL).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      `https://example.com/rest/groups/${fixtures.userGroup1.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('loadGroupMembers works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.members));
    loadGroupMembers(fixtures.userGroup1.id, mockBaseURL).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      `https://example.com/rest/groups/${fixtures.userGroup1.id}/members`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });
});
