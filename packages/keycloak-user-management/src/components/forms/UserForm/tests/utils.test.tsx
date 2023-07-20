import { submitForm, postPutPractitioner, getUserTypeCode } from '../utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { value, keycloakUser, practitioner1, userGroup } from './fixtures';
import { FormFields } from '../types';
import { cloneDeep } from 'lodash';
import { Dictionary } from '@onaio/utils/dist/types/types';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { SUPERVISOR_USER_TYPE_CODE } from '../../../../constants';

jest.mock('@opensrp/notifications', () => {
  const actualNotifications = jest.requireActual('@opensrp/notifications');
  return {
    __esModule: true,
    ...actualNotifications,
  };
});

const mockV4 = '0b3a3311-6f5a-40dd-95e5-008001acebe1';
const keycloakUserId = 'generatedKeycloakId';
const translator = (t) => t;

jest.mock('uuid', () => {
  const actualUUID = jest.requireActual('uuid');
  const mockV4Function = jest.fn().mockImplementation(() => mockV4);
  return { __esModule: true, ...actualUUID, v4: mockV4Function };
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
  const id = mockV4;

  it('submits user creation correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}`,
      },
    });
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    submitForm(
      value,
      keycloakBaseURL,
      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    const expectedKUser = cloneDeep(value);
    delete expectedKUser.active;
    delete expectedKUser.userGroups;
    delete expectedKUser.practitioner;

    // keycloak user payload
    expect(JSON.parse((fetch.mock.calls[0][1] as Dictionary).body)).toEqual({
      ...expectedKUser,
      id: '',
    });
    // practitioner payload
    expect(JSON.parse((fetch.mock.calls[1][1] as Dictionary).body)).toEqual({
      active: true,
      identifier: mockV4,
      name: `${value.firstName} ${value.lastName}`,
      userId: keycloakUserId,
      username: value.username,
    });
    expect(fetch.mock.calls).toMatchObject([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: expect.any(String),
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
          body: expect.any(String),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
      [
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}/groups/580c7fbf-c201-4dad-9172-1df9faf24936`,
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
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}/groups/2fffbc6a-528d-4cec-aa44-97ef65b9bba2`,
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
      ['User created successfully'],
      ['Practitioner created successfully'],
      ['User Group edited successfully'],
    ]);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/users/credentials/${keycloakUserId}`);
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
      { ...value, userGroups: [], practitioner: undefined },
      keycloakBaseURL,
      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
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
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}`,
      },
    });

    submitForm(
      { ...value, practitioner: undefined },
      keycloakBaseURL,
      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    // ensure that redirect only happens once
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/users/credentials/${keycloakUserId}`);
  });

  it('submits user edit correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    submitForm(
      { ...value, id: mockV4, practitioner: practitioner1 },
      keycloakBaseURL,

      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    expect(JSON.parse((fetch.mock.calls[0][1] as Dictionary).body)).toEqual({
      firstName: value.firstName,
      id: mockV4,
      lastName: value.lastName,
      username: value.username,
      email: value.email,
    });
    expect(JSON.parse((fetch.mock.calls[1][1] as Dictionary).body)).toEqual({
      active: false,
      identifier: practitioner1.identifier,
      name: `${value.firstName} ${value.lastName}`,
      userId: mockV4,
      username: value.username,
    });
    expect(fetch.mock.calls).toMatchObject([
      [
        `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${mockV4}`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: expect.any(String),
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
          body: expect.any(String),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/0b3a3311-6f5a-40dd-95e5-008001acebe1/groups/580c7fbf-c201-4dad-9172-1df9faf24936',
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
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/0b3a3311-6f5a-40dd-95e5-008001acebe1/groups/2fffbc6a-528d-4cec-aa44-97ef65b9bba2',
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
      ['User edited successfully'],
      ['Practitioner updated successfully'],
      ['User Group edited successfully'],
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User edited successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users');
  });

  it('deletes user from a group', async () => {
    submitForm(
      {
        ...value,
        userGroups: ['cab07278-c77b-4bc7-b154-bcbf01b7d35b'],
        id,
        practitioner: practitioner1,
      },
      keycloakBaseURL,
      userGroup,
      ['4dd15e66-7132-429b-8939-d1e601611464', 'cab07278-c77b-4bc7-b154-bcbf01b7d35b'],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });
    // should make a fetch to detele user group cab07278-c77b-4bc7-b154-bcbf01b7d35b
    expect(fetch.mock.calls[3]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${mockV4}/groups/4dd15e66-7132-429b-8939-d1e601611464`,
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
    fetch.mockReject(new Error('API is down'));
    const historyPushMock = jest.spyOn(history, 'push');
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm(
      { ...value, practitioner: practitioner1 },
      keycloakBaseURL,
      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem creating user');
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(new Error('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm(
      { ...value, practitioner: practitioner1, id: id },
      keycloakBaseURL,
      userGroup,
      [],
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem updating user');
  });

  it('marks user as practitioner successfully', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const valuesCopy = {
      ...value,
      active: true,
      id: keycloakUser.id,
    };

    postPutPractitioner(OPENSRP_API_BASE_URL)(valuesCopy, valuesCopy.id, translator).catch(jest.fn);

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

    postPutPractitioner(OPENSRP_API_BASE_URL)(valuesCopy, valuesCopy.id, translator).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(JSON.parse((fetch.mock.calls[0][1] as Dictionary).body)).toEqual({
      active: true,
      identifier: practitioner1.identifier,
      name: 'Jane Doe',
      userId: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      username: value.username,
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: expect.any(String),
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

    postPutPractitioner(OPENSRP_API_BASE_URL)(valuesCopy, valuesCopy.id, translator).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(JSON.parse((fetch.mock.calls[0][1] as Dictionary).body)).toEqual({
      active: true,
      identifier: practitioner1.identifier,
      name: `${value.firstName} ${value.lastName}`,
      userId: keycloakUser.id,
      username: value.username,
    });
    expect(fetch.mock.calls[0]).toMatchObject([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: expect.any(String),
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
    fetch.mockReject(new Error('API is down'));
    const valuesCopy = {
      ...{ ...value, id: id },
      active: true,
      id: keycloakUser.id,
    };

    postPutPractitioner(OPENSRP_API_BASE_URL)(valuesCopy, valuesCopy.id, translator).catch(jest.fn);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem creating practitioner');
  });

  it('updates practitioner values when user values update', async () => {
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}`,
      },
    });
    submitForm(
      { ...value, id: id, userGroups: undefined, practitioner: practitioner1 },
      keycloakBaseURL,
      [],
      undefined,
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    // compose request object with endpoint, method and body
    const reqObj = fetch.mock.calls.map((req) => ({
      url: req[0],
      method: req[1].method,
      body: JSON.parse(req[1].body as string),
    }));

    // expect practitioner values to be extrapolated from user values
    expect(reqObj).toMatchObject([
      {
        url: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${id}`,
        method: 'PUT',
        body: {
          firstName: value.firstName,
          lastName: value.lastName,
          username: value.username,
          email: value.email,
          id: id,
        },
      },
      {
        url: 'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner',
        method: 'PUT',
        body: {
          identifier: practitioner1.identifier,
          name: `${value.firstName} ${value.lastName}`,
          userId: id,
          username: value.username,
        },
      },
    ]);
  });

  it('creates active practitioner on keycloak user creation', async () => {
    fetch.mockResponseOnce(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: {
        Location: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${keycloakUserId}`,
      },
    });
    submitForm(
      // initialize values for new user creation
      { ...value, id: undefined, userGroups: undefined },
      keycloakBaseURL,
      [],
      undefined,
      postPutPractitioner(OPENSRP_API_BASE_URL),
      translator
    ).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    // compose request object with endpoint, method and body
    const reqObj = fetch.mock.calls.map((req) => ({
      url: req[0],
      method: req[1].method,
      body: JSON.parse(req[1].body as string),
    }));

    // first request is to create user in keycloak, second request is to create practitioner
    expect(reqObj).toMatchObject([
      {
        url: `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users`,
        method: 'POST',
        body: {
          firstName: value.firstName,
          lastName: value.lastName,
          username: value.username,
          email: value.email,
          id: '',
        },
      },
      {
        url: 'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner',
        method: 'POST',
        body: {
          active: true,
          identifier: mockV4,
          name: `${value.firstName} ${value.lastName}`,
          userId: keycloakUserId,
          username: value.username,
        },
      },
    ]);
  });

  it('handles multiple codeable concept with multiple codings', () => {
    const practitionerRole = {
      code: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: SUPERVISOR_USER_TYPE_CODE,
              display: 'Assigned practitioner',
            },
            {
              system: 'http://snomed.info/sct',
              code: '123456',
              display: 'random code 1',
            },
            {
              system: 'http://snomed.info/sct',
              code: '78910',
              display: 'random code 2',
            },
          ],
        },
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '5557855546',
              display: 'random code 3',
            },
          ],
        },
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '258858588',
              display: 'random code 4',
            },
          ],
        },
      ],
    } as IPractitionerRole;

    expect(getUserTypeCode(practitionerRole)).toEqual(SUPERVISOR_USER_TYPE_CODE);
  });
});
