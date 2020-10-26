import fetch from 'jest-fetch-mock';
import { deleteUser } from '../utils';
import * as fixtures from '../../../../forms/UserForm/tests/fixtures';
import { KEYCLOAK_URL_USERS } from '../../../../constants';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { notification } from 'antd';

describe('components/UserList/uti/deleteUser', () => {
  const fetchUsersMock = jest.fn();
  const removeUsersMock = jest.fn();
  const accessToken = 'sometoken';
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const userId = '1';

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('deletes user', async () => {
    const notificationSuccessMock = jest.spyOn(notification, 'success');
    fetch.mockResponse(JSON.stringify([fixtures.keycloakUser]));

    deleteUser(fetchUsersMock, removeUsersMock, accessToken, keycloakBaseURL, userId);

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
    expect(fetchUsersMock).toHaveBeenCalledWith([fixtures.keycloakUser]);
    expect(notificationSuccessMock).toHaveBeenCalledWith({
      message: 'User deleted successfully',
      description: '',
    });
  });

  it('handles API error when calling the deletion endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
    deleteUser(fetchUsersMock, removeUsersMock, accessToken, keycloakBaseURL, userId);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: '',
    });
  });

  it('handles API error when calling the fetch endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.once(JSON.stringify([])).mockRejectOnce(() => Promise.reject('API is down'));
    deleteUser(fetchUsersMock, removeUsersMock, accessToken, keycloakBaseURL, userId);

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
    expect(fetchUsersMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: '',
    });
  });
});
