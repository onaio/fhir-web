import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { deleteUser } from '../utils';
import lang from '../../../../lang';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/UserList/utils/deleteUser', () => {
  const removeUsersMock = jest.fn();
  const keycloakBaseURL = 'https://some.keycloak.url';
  const opensrpBaseURL = 'https://some.opensrp.url/';
  const userId = '1';
  const practitioner = {
    id: '01',
    identifier: '001',
    active: true,
    name: 'anon ops',
    userId: '001',
    username: 'anonops',
    code: '001',
  };

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
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('deletes user, deactivates, and un-assigns tied practitioner', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    fetch.mockResponseOnce(JSON.stringify(practitioner));

    deleteUser(removeUsersMock, keycloakBaseURL, opensrpBaseURL, userId).catch(
      () => 'obligatory catch'
    );

    await act(async () => {
      await flushPromises();
    });

    // compose request object with request url and method
    const composeRequests = fetch.mock.calls.map((req) => ({
      req: req[0],
      method: req[1].method,
    }));

    // expect all calls:
    // get practitioner from userId, delete keycloak user, delete practitioner role, deactivate practitioner
    expect(composeRequests).toMatchObject([
      {
        method: 'GET',
        req: 'https://some.opensrp.url/practitioner/user/1',
      },
      {
        method: 'DELETE',
        req: 'https://some.keycloak.url/users/1',
      },
      {
        method: 'DELETE',
        req: 'https://some.opensrp.url/practitionerRole/delete/001',
      },
      {
        method: 'PUT',
        req: 'https://some.opensrp.url/practitioner',
      },
    ]);

    expect(removeUsersMock).toHaveBeenCalledTimes(1);
    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['User deleted successfully'],
      ['Practitioner unassigned successfully'],
      ['Practitioner deactivated successfully'],
    ]);
  });

  it('handles API error when calling the deletion endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockRejectOnce(new Error('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, opensrpBaseURL, userId).catch(
      () => 'obligatory catch'
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('handles API error when calling the fetch endpoints', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.once(JSON.stringify([])).mockRejectOnce(new Error('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, opensrpBaseURL, userId).catch(
      () => 'obligatory catch'
    );

    await act(async () => {
      await flushPromises();
    });

    // compose request object with request url and method
    const composeRequests = fetch.mock.calls.map((req) => ({
      req: req[0],
      method: req[1].method,
    }));

    // expect first request to fail - get practitioner from userId
    expect(composeRequests).toMatchObject([
      {
        method: 'GET',
        req: 'https://some.opensrp.url/practitioner/user/1',
      },
    ]);

    expect(removeUsersMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
