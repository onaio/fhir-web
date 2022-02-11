import { getPatientName, submitForm } from '../utils';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import * as fhirCient from 'fhirclient';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import * as fixtures from './fixtures';

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
  const orgs = fixtures.organizations.entry.map((org) => ({
    id: org.resource.id,
    name: org.resource.name,
  }));

  const practitioners = fixtures.practitioners.entry.map((practitioner) => ({
    id: practitioner.resource.id,
    name: getPatientName(practitioner),
  }));
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const fhirBaseURL = 'https://r4.smarthealthit.org/';
  const id = 'cab07278-c77b-4bc7-b154-bcbf01b7d35b';

  it('submits role creation correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue(fixtures.practitionerRole1),
        };
      })
    );

    submitForm(fixtures.formValues, fhirBaseURL, orgs, practitioners, '', '').catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['Successfully Added Practitioner Role'],
    ]);
    expect(historyPushMock).toHaveBeenCalledWith(`/admin/PractitionerRole`);
  });

  it('ensures error notification is not thrown when creating new practitioner role', async () => {
    const mockErrorCallback = jest.fn();

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue(fixtures.practitionerRole1),
        };
      })
    );

    submitForm(fixtures.formValues, fhirBaseURL, orgs, practitioners, '', '').catch(
      mockErrorCallback
    );

    await act(async () => {
      await flushPromises();
    });
    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  it('submits practitioner role edit correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue(fixtures.practitionerRole1),
        };
      })
    );

    submitForm(fixtures.formValues, fhirBaseURL, orgs, practitioners, '388', id).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['Successfully Updated Practitioner Role'],
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Successfully Updated Practitioner Role');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/PractitionerRole');
  });

  it('submits practitioner role edit successfully if practitioner or org not set in payload', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(history, 'push');

    const newValues = {
      ...fixtures.formValues,
      orgsId: '',
      practitionersId: '',
    };

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockResolvedValue(fixtures.practitionerRole1),
        };
      })
    );

    submitForm(newValues, fhirBaseURL, orgs, practitioners, '388', id).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationSuccessMock.mock.calls).toMatchObject([
      ['Successfully Updated Practitioner Role'],
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Successfully Updated Practitioner Role');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/PractitionerRole');
  });

  it('handles error when roler creation fails', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockRejectedValue('API Failed'),
        };
      })
    );

    submitForm(fixtures.formValues, fhirBaseURL, orgs, practitioners, '', '').catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  });

  it('handles error when role edit fails', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: jest.fn().mockRejectedValue('API Failed'),
        };
      })
    );

    submitForm(fixtures.formValues, fhirBaseURL, orgs, practitioners, '308', id).catch(jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  });
});
