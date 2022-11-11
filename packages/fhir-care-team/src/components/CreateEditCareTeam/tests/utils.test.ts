import { getPatientName, submitForm } from '../utils';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import flushPromises from 'flush-promises';
import * as fhirCient from 'fhirclient';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import {
  practitioners as fixturePractitioners,
  organizations,
  formValues,
  careTeam1,
} from './fixtures';

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
  const practitioners = fixturePractitioners.entry.map((prac) => ({
    name: getPatientName(prac.resource),
    id: prac.resource.id,
  }));

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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const fhirBaseURL = 'https://r4.smarthealthit.org/';
  const id = 'cab07278-c77b-4bc7-b154-bcbf01b7d35b';

  it('submits user creation correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue(careTeam1),
        };
      })
    );

    submitForm(formValues, fhirBaseURL, organizations, practitioners, (t) => t, '', '').catch(
      jest.fn()
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock.mock.calls).toMatchObject([['Successfully Added Care Teams']]);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/CareTeams`);
  });

  it('ensures error notification is not thrown when creating new care team', async () => {
    const mockErrorCallback = jest.fn();

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue(careTeam1),
        };
      })
    );

    submitForm(formValues, fhirBaseURL, organizations, practitioners, (t) => t, '', '').catch(
      mockErrorCallback
    );

    await act(async () => {
      await flushPromises();
    });
    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  it('submits care team edit correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue(careTeam1),
        };
      })
    );

    submitForm(formValues, fhirBaseURL, organizations, practitioners, (t) => t, '308', id).catch(
      jest.fn()
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock.mock.calls).toMatchObject([['Successfully Updated Care Teams']]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Successfully Updated Care Teams');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/CareTeams');
  });

  it('handles error when user creation fails', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockRejectedValue('API Failed'),
        };
      })
    );

    submitForm(formValues, fhirBaseURL, organizations, practitioners, (t) => t, '', '').catch(
      jest.fn()
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  });

  it('handles error when user edit fails', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockRejectedValue('API Failed'),
        };
      })
    );

    submitForm(formValues, fhirBaseURL, organizations, practitioners, (t) => t, '308', id).catch(
      jest.fn()
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  });
});
