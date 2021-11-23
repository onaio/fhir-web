import { submitForm, fetchRequiredActions, createOrEditPractitioners } from '../utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import * as fhirCient from 'fhirclient';
import * as notifications from '@opensrp/notifications';
import lang from '../../../../lang';
import {
  value,
  keycloakUser,
  requiredActions,
  userGroup,
  userAction1,
  userAction3,
  userAction4,
  userAction5,
  userAction6,
  fhirPractitioner,
} from './fixtures';
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

describe('forms/utils/fetchRequiredActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    fetch.resetMocks();
  });

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

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const setUserActionOptionsMock = jest.fn();

  it('fetches required actions', async () => {
    fetch.mockResponseOnce(JSON.stringify(requiredActions));

    fetchRequiredActions(keycloakBaseURL, setUserActionOptionsMock);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    expect(setUserActionOptionsMock).toHaveBeenCalledWith([
      userAction1,
      userAction3,
      userAction4,
      userAction5,
      userAction6,
    ]);
  });

  it('handles error if fetching fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fetchRequiredActions(keycloakBaseURL, setUserActionOptionsMock);

    await act(async () => {
      await flushPromises();
    });

    expect(setUserActionOptionsMock).not.toHaveBeenCalled();

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});

describe('forms/utils/submitForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const fhirBaseURL = 'https://fhir.labs.smartregister.org/fhir';
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

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
    });

    submitForm(value, keycloakBaseURL, fhirBaseURL, userGroup).catch(jest.fn());

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

    // expect.arrayContaining - avoids strict matching array order
    expect(notificationSuccessMock.mock.calls).toMatchObject(
      expect.arrayContaining([
        ['Practitioner created successfully'],
        ['User Group edited successfully'],
        ['User edited successfully'],
      ])
    );
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

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    submitForm(
      { ...value, id: id, practitioner: fhirPractitioner },
      keycloakBaseURL,
      fhirBaseURL,
      userGroup
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
    ]);

    // expect.arrayContaining - avoids strict matching array order
    expect(notificationSuccessMock.mock.calls).toMatchObject(
      expect.arrayContaining([
        ['Practitioner updated successfully'],
        ['User Group edited successfully'],
        ['User edited successfully'],
      ])
    );

    expect(notificationSuccessMock).toHaveBeenCalledWith('User edited successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users');
  });

  it('marks user as practitioner successfully', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy = {
      ...value,
      active: true,
      id: keycloakUser.id,
    };

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    createOrEditPractitioners(fhirBaseURL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner created successfully');
  });

  it('updates practitioner successfully', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy: FormFields = {
      ...{ ...value, id: id },
      active: true,
      id: keycloakUser.id,
      practitioner: fhirPractitioner,
    };

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    createOrEditPractitioners(fhirBaseURL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationSuccessMock).toHaveBeenCalled();
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner updated successfully');
  });

  it('calls API with userId if present in values', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy = {
      ...value,
      active: true,
      id: keycloakUser.id,
      practitioner: fhirPractitioner,
    };

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue('Success'),
        };
      })
    );
    createOrEditPractitioners(fhirBaseURL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
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

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockRejectedValue('Request Failed'),
        };
      })
    );

    createOrEditPractitioners(fhirBaseURL, valuesCopy).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
  });

  it('handles error when user creation fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    const notificationSpy = jest.spyOn(notifications, 'sendErrorNotification');
    submitForm(value, keycloakBaseURL, fhirBaseURL, userGroup).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSpy).toHaveBeenCalledWith('An error occurred');
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    const notificationSpy = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm(
      { ...value, ...fhirPractitioner, id: id },
      keycloakBaseURL,
      fhirBaseURL,
      userGroup
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSpy).toHaveBeenCalledWith('An error occurred');
  });
});
