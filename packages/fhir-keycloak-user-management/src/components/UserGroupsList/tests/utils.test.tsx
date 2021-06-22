import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import * as fixtures from '../../UserGroupDetailView/tests/fixtures';
import { loadGroupDetails, loadGroupMembers } from '../utils';
import fetch from 'jest-fetch-mock';
import lang from '../../../lang';

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('loadGroupDetails works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.userGroup1));
    loadGroupDetails(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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
    loadGroupMembers(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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

  it('loadGroupMembers handles errors', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    loadGroupMembers(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('loadGroupDetails handles errors', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    loadGroupDetails(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
      throw e;
    });
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
