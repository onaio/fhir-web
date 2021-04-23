import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { deleteUser } from '../utils';
import * as fixtures from '../../../forms/UserForm/tests/fixtures';
import { KEYCLOAK_URL_USERS } from '../../../../constants';
import lang from '../../../../lang';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

describe('components/UserList/utils/deleteUser', () => {
  const removeUsersMock = jest.fn();
  const isLoadingCallback = jest.fn();
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const userId = '1';

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
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('deletes user', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    fetch.mockResponse(JSON.stringify([fixtures.keycloakUser]));

    deleteUser(removeUsersMock, keycloakBaseURL, userId, isLoadingCallback);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(`${keycloakBaseURL}${KEYCLOAK_URL_USERS}/${userId}`, {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'DELETE',
    });
    expect(removeUsersMock).toHaveBeenCalled();
    expect(isLoadingCallback).toHaveBeenCalled();
    expect(notificationSuccessMock).toHaveBeenCalledWith('User deleted successfully');
  });

  it('handles API error when calling the deletion endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(() => Promise.reject('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, userId, isLoadingCallback);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('handles API error when calling the fetch endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.once(JSON.stringify([])).mockRejectOnce(() => Promise.reject('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, userId, isLoadingCallback);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(`${keycloakBaseURL}${KEYCLOAK_URL_USERS}/${userId}`, {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'DELETE',
    });
    expect(removeUsersMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
