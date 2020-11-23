import { submitForm, fetchRequiredActions } from '../utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { ERROR_OCCURED } from '../../../../constants';
import * as fixtures from './fixtures';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

describe('forms/utils/fetchRequiredActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const accessToken = 'token';
  const serviceClass = KeycloakService;
  const setUserActionOptionsMock = jest.fn();

  it('fetches required actions', async () => {
    fetch.once(JSON.stringify(fixtures.userActions));

    fetchRequiredActions(accessToken, keycloakBaseURL, setUserActionOptionsMock, serviceClass);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(setUserActionOptionsMock).toHaveBeenCalledWith([
      fixtures.userAction1,
      fixtures.userAction3,
      fixtures.userAction4,
      fixtures.userAction5,
      fixtures.userAction6,
    ]);
  });

  it('handles error if fetching fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fetchRequiredActions(accessToken, keycloakBaseURL, setUserActionOptionsMock, serviceClass);

    await act(async () => {
      await flushPromises();
    });

    expect(setUserActionOptionsMock).not.toHaveBeenCalled();

    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
  });
});

describe('forms/utils/submitForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  const values = {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe@example.com',
    email: 'janedoe@example.com',
    requiredActions: ['UPDATE_PASSWORD'],
  };
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const accessToken = 'token';
  const serviceClass = KeycloakService;
  const setSubmittingMock = jest.fn();
  const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
  const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
  const historyPushMock = jest.spyOn(history, 'push');
  const userId = 'cab07278-c77b-4bc7-b154-bcbf01b7d35b';

  it('submits user creation correctly', async () => {
    submitForm(values, accessToken, keycloakBaseURL, serviceClass, setSubmittingMock);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(values),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User created successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin');
  });

  it('submits user edit correctly', async () => {
    submitForm(values, accessToken, keycloakBaseURL, serviceClass, setSubmittingMock, userId);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${userId}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(values),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User edited successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin');
  });

  it('handles error when user creation fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    submitForm(values, accessToken, keycloakBaseURL, serviceClass, setSubmittingMock);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    submitForm(values, accessToken, keycloakBaseURL, serviceClass, setSubmittingMock, userId);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
    expect(historyPushMock).not.toHaveBeenCalled();
  });
});
