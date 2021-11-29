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
import fhirCient from 'fhirclient';
import { PractitionerBundle, PractitionerRoleBundle, CareTeamBundle } from './fixtures';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

describe('components/UserList/utils/deleteUser', () => {
  const removeUsersMock = jest.fn();
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const fhirBaseURL = 'https://www.test.fhir.url/';
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

    deleteUser(removeUsersMock, keycloakBaseURL, fhirBaseURL, userId).catch(() => jest.fn());

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
    expect(notificationSuccessMock).toHaveBeenCalledWith('User deleted successfully');
  });

  it('handles API error when calling the deletion endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(() => Promise.reject('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, fhirBaseURL, userId).catch(() => jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('handles API error when calling the fetch endpoint', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.once(JSON.stringify([])).mockRejectOnce(() => Promise.reject('API is down'));
    deleteUser(removeUsersMock, keycloakBaseURL, fhirBaseURL, userId).catch(() => jest.fn());

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

describe('un-assigns and deactivates practitioners', () => {
  const fhir = jest.spyOn(fhirCient, 'client');
  const removeUsersMock = jest.fn();
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const fhirBaseURL = 'https://www.test.fhir.url/';
  const userId = '1';
  beforeEach(() => {
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Practitioner/_search?identifier=1')
            return Promise.resolve(PractitionerBundle);
          else if (url === 'PractitionerRole/_search?practitioner=5123')
            return Promise.resolve(PractitionerRoleBundle);
          else if (url === 'CareTeam/_search?participant:practitioner=5123')
            return Promise.resolve(CareTeamBundle);
        }),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn((url) => {
          if (url === 'PractitionerRole/5124') return Promise.resolve();
        }),
      }))
    );
  });

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('un-assigns and deactivates practitioners from teams and care teams', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    deleteUser(removeUsersMock, keycloakBaseURL, fhirBaseURL, userId).catch(() => jest.fn());
    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock).toHaveBeenCalledWith('User deleted successfully');
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner unassigned successfully');
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner deactivated successfully');
    expect(notificationSuccessMock).toHaveBeenCalledWith(
      'Practitioner unassigned from care teams successfully'
    );
    expect(notificationErrorMock).not.toHaveBeenCalled();
    expect(removeUsersMock).toHaveBeenCalledTimes(1);
  });
});
