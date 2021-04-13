import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import * as fixtures from '../../UserGroupDetailView/tests/fixtures';
import { fetchSingleGroup, removeAssignedRoles, assignRoles, fetchRoleMappings } from '../utils';
import fetch from 'jest-fetch-mock';
import lang from '../../../lang';
import { userRoles } from '../../../ducks/tests/fixtures';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_EFFECTIVE_ROLES,
} from '../../../constants';

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

  it('fetchSingleGroup works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.userGroup1));
    fetchSingleGroup(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
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

  it('fetchSingleGroup handles errors', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    fetchSingleGroup(fixtures.userGroup1.id, mockBaseURL, jest.fn()).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('assignRoles works correctly', async () => {
    assignRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id]).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    assignRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id]).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('removeAssignedRoles works correctly', async () => {
    removeAssignedRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id]).catch(
      (e) => {
        throw e;
      }
    );
    await new Promise((resolve) => setImmediate(resolve));
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
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    removeAssignedRoles(fixtures.userGroup1.id, mockBaseURL, userRoles, [userRoles[0].id]).catch(
      (e) => {
        throw e;
      }
    );
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('fetchRoleMappings fetches available roles', async () => {
    fetch.once(JSON.stringify(userRoles));
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_AVAILABLE_ROLES,
      jest.fn()
    ).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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
      jest.fn()
    ).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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
      jest.fn()
    ).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
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
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    fetchRoleMappings(
      fixtures.userGroup1.id,
      mockBaseURL,
      KEYCLOAK_URL_ASSIGNED_ROLES,
      jest.fn()
    ).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
