import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import * as fixtures from '../../UserGroupsList/tests/fixtures';
import {
  fetchSingleGroup,
  removeAssignedRoles,
  assignRoles,
  fetchRoleMappings,
  submitForm,
} from '../utils';
import fetch from 'jest-fetch-mock';

import { value } from './fixtures';
import { userRoles } from '../../../ducks/tests/fixtures';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_EFFECTIVE_ROLES,
} from '../../../constants';
import { act } from 'react-dom/test-utils';
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
    jest.clearAllMocks();
    fetch.mockClear();
  });

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const id = '283c5d6e-9b83-4954-9f3b-4c2103e4370c';

  it('fetchSingleGroup works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.userGroup1));
    fetchSingleGroup(fixtures.userGroup1.id, mockBaseURL, jest.fn(), (t) => t).catch((e) => {
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

  it('fetchSingleGroup handles errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    fetchSingleGroup(fixtures.userGroup1.id, mockBaseURL, jest.fn(), (t) => t).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem fetching User Group');
  });

  it('assignRoles works correctly', async () => {
    assignRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id], (t) => t).catch(
      (e) => {
        throw e;
      }
    );
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/rest/groups/261c67fe-918b-4369-a35f-095b5e284fcb/role-mappings/realm',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify([userRoles[0]]),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
  });

  it('assignRoles handles errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    assignRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id], (t) => t).catch(
      (e) => {
        throw e;
      }
    );
    await flushPromises();
    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem assigning roles');
  });

  it('removeAssignedRoles works correctly', async () => {
    removeAssignedRoles(
      fixtures.userGroup1.id,
      mockBaseURL,
      userRoles,
      [userRoles[0].id],
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/rest/groups/261c67fe-918b-4369-a35f-095b5e284fcb/role-mappings/realm',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify([userRoles[0]]),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'DELETE',
      },
    ]);
  });

  it('removeAssignedRoles handles errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    removeAssignedRoles(
      fixtures.userGroup1.id,
      mockBaseURL,
      userRoles,
      [userRoles[0].id],
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(mockNotificationError).toHaveBeenCalledWith(
      'There was a problem removing assigned roles'
    );
  });

  it('fetchRoleMappings fetches available roles', async () => {
    fetch.once(JSON.stringify(userRoles));
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_AVAILABLE_ROLES,
      jest.fn(),
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/rest/groups/261c67fe-918b-4369-a35f-095b5e284fcb/role-mappings/realm/available',
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

  it('fetchRoleMappings fetches assigned roles', async () => {
    fetch.once(JSON.stringify(userRoles));
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_ASSIGNED_ROLES,
      jest.fn(),
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/rest/groups/261c67fe-918b-4369-a35f-095b5e284fcb/role-mappings/realm',
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

  it('fetchRoleMappings fetches effective roles', async () => {
    fetch.once(JSON.stringify(userRoles));
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_EFFECTIVE_ROLES,
      jest.fn(),
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/rest/groups/261c67fe-918b-4369-a35f-095b5e284fcb/role-mappings/realm/composite',
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

  it('fetchRoleMappings handles errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_ASSIGNED_ROLES,
      jest.fn(),
      (t) => t
    ).catch((e) => {
      throw e;
    });
    await flushPromises();
    expect(mockNotificationError).toHaveBeenCalledWith(
      'There was a problem fetching role mappings'
    );
  });

  it('submits group creation correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');
    const mockSubmitCallback = jest.fn();

    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });

    submitForm(value, keycloakBaseURL, mockSubmitCallback, (t) => t).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"name":"Admin"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
    expect(mockSubmitCallback).toHaveBeenCalled();
    expect(notificationSuccessMock.mock.calls).toEqual([['User Group created successfully']]);
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith(
      '/admin/users/groups/edit/283c5d6e-9b83-4954-9f3b-4c2103e4370c'
    );
  });

  it('submits user edit correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');
    const mockSubmitCallback = jest.fn();

    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
      },
    });

    submitForm({ ...value, id: id }, keycloakBaseURL, mockSubmitCallback, (t) => t).catch(
      jest.fn()
    );

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/283c5d6e-9b83-4954-9f3b-4c2103e4370c',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"id":"283c5d6e-9b83-4954-9f3b-4c2103e4370c","name":"Admin","path":"/Admin"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    expect(notificationSuccessMock.mock.calls).toEqual([['User Group edited successfully']]);
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users/groups');
  });

  it('handles error when user creation fails', async () => {
    fetch.mockReject(new Error('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    submitForm(value, keycloakBaseURL, jest.fn(), (t) => t).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toBeCalledTimes(1);
    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem creating User Group');
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(new Error('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm({ ...value, id }, keycloakBaseURL, jest.fn(), (t) => t).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toBeCalledTimes(1);
    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem editing User Group');
  });
});
