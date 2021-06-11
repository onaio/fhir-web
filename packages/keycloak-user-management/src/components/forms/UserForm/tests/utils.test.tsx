import { submitForm, createOrEditPractitioners } from '../utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { value, keycloakUser, practitioner1, userGroup } from './fixtures';
import { FormFields } from '..';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

const mockV4 = '0b3a3311-6f5a-40dd-95e5-008001acebe1';

jest.mock('uuid', () => {
  const v4 = () => mockV4;
  return { __esModule: true, ...jest.requireActual('uuid'), v4 };
});

describe('forms/utils/submitForm', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'token', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const id = 'cab07278-c77b-4bc7-b154-bcbf01b7d35b';

  it('submits user creation correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });

    submitForm(value, keycloakBaseURL, OPENSRP_API_BASE_URL, userGroup, []).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    const keycloakuser = value;
    delete keycloakuser.active;
    delete keycloakuser.userGroup;
    delete keycloakuser.practitioner;

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            ...keycloakuser,
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: true,
            identifier: mockV4,
            name: `${value.firstName} ${value.lastName}`,
            userId: id,
            username: value.username,
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
      [
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}/groups/580c7fbf-c201-4dad-9172-1df9faf24936`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: undefined,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}/groups/2fffbc6a-528d-4cec-aa44-97ef65b9bba2`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: undefined,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);

    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['Practitioner created successfully'],
      ['User Group edited successfully'],
      ['User edited successfully'],
    ]);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/users/credentials/${id}`);
  });

  it('ensures error notification is not thrown when creating new user', async () => {
    const mockErrorCallback = jest.fn();
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });
    submitForm(
      { ...value, userGroup: [], practitioner: undefined },
      keycloakBaseURL,
      OPENSRP_API_BASE_URL,
      userGroup,
      []
    ).catch(mockErrorCallback);

    await act(async () => {
      await flushPromises();
    });
    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  it('correctly redirects to credentials page when practitioner is undefined (new user)', async () => {
    const historyPushMock = jest.spyOn(history, 'push');
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });
    submitForm(
      { ...value, practitioner: undefined },
      keycloakBaseURL,
      OPENSRP_API_BASE_URL,
      userGroup,
      []
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    // ensure that redirect only happens once
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/users/credentials/${id}`);
  });

  it('submits user edit correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });

    submitForm(
      { ...value, id: id, practitioner: practitioner1 },
      keycloakBaseURL,
      OPENSRP_API_BASE_URL,
      userGroup,
      []
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            firstName: value.firstName,
            lastName: value.lastName,
            username: value.username,
            email: value.email,
            requiredActions: ['UPDATE_PASSWORD'],
            id: id,
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            identifier: id,
            name: practitioner1.name,
            userId: practitioner1.userId,
            username: practitioner1.username,
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);

    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['Practitioner updated successfully'],
      ['User Group edited successfully'],
      ['User edited successfully'],
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User edited successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users');
  });

  it('deletes user from a group', async () => {
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });

    submitForm(
      {
        ...value,
        userGroup: ['cab07278-c77b-4bc7-b154-bcbf01b7d35b'],
        id,
        practitioner: practitioner1,
      },
      keycloakBaseURL,
      OPENSRP_API_BASE_URL,
      userGroup,
      ['4dd15e66-7132-429b-8939-d1e601611464', 'cab07278-c77b-4bc7-b154-bcbf01b7d35b']
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    // should make a fetch to detele user group cab07278-c77b-4bc7-b154-bcbf01b7d35b
    expect(fetch.mock.calls[3]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/groups/4dd15e66-7132-429b-8939-d1e601611464',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'DELETE',
      },
    ]);
  });

  it('handles error when user creation fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const rejectFn = jest.fn();
    const historyPushMock = jest.spyOn(history, 'push');

    submitForm(value, keycloakBaseURL, OPENSRP_API_BASE_URL, userGroup, []).catch(rejectFn);

    await act(async () => {
      await flushPromises();
    });

    expect(rejectFn).toBeCalled();
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const rejectFn = jest.fn();
    const historyPushMock = jest.spyOn(history, 'push');

    submitForm(
      { ...value, ...practitioner1, id: id },
      keycloakBaseURL,
      OPENSRP_API_BASE_URL,
      userGroup,
      []
    ).catch(rejectFn);

    await act(async () => {
      await flushPromises();
    });

    expect(rejectFn).toBeCalled();
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('marks user as practitioner successfully', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy = {
      ...value,
      active: true,
      id: keycloakUser.id,
    };

    createOrEditPractitioners(OPENSRP_API_BASE_URL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          active: true,
          identifier: mockV4,
          name: `${value.firstName} ${value.lastName}`,
          userId: keycloakUser.id,
          username: value.username,
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner created successfully');
  });

  it('updates practitioner successfully', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy: FormFields = {
      ...{ ...value, id: id },
      active: true,
      id: keycloakUser.id,
      practitioner: practitioner1,
    };

    createOrEditPractitioners(OPENSRP_API_BASE_URL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toEqual([
      [
        `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: true,
            identifier: id,
            name: practitioner1.name,
            userId: practitioner1.userId,
            username: practitioner1.username,
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner updated successfully');
  });

  it('calls API with userId if present in values', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy = {
      ...value,
      active: true,
      id: keycloakUser.id,
      practitioner: practitioner1,
    };

    createOrEditPractitioners(OPENSRP_API_BASE_URL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          active: true,
          identifier: practitioner1.identifier,
          name: practitioner1.name,
          userId: practitioner1.userId,
          username: practitioner1.username,
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner updated successfully');
  });

  it('handles errors when marking practitioner fails', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(() => Promise.reject('API is down'));
    const valuesCopy = {
      ...{ ...value, id: id },
      active: true,
      id: keycloakUser.id,
    };

    createOrEditPractitioners(OPENSRP_API_BASE_URL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
  });
});
