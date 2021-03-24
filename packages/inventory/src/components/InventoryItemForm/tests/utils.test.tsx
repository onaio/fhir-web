import MockDate from 'mockdate';
import moment from 'moment';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import fetch from 'jest-fetch-mock';
import * as notifications from '@opensrp/notifications';
import { isDateFuture, isDatePastOrToday, submitForm } from '../utils';
import lang from '../../../lang';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/InventoryItemForm/utils/submitForm', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const values = {
    productName: 'Motorbyke',
    quantity: 10,
    deliveryDate: '2021-02-08',
    accountabilityEndDate: '2021-04-08',
    unicefSection: 'Health',
    donor: 'ADB',
    poNumber: 89,
    servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    serialNumber: '12345',
  };
  const openSRPBaseURL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';
  const setSubmittingMock = jest.fn();
  const setIfDoneHereMock = jest.fn();
  const inventoryID = '69227a92-7979-490c-b149-f28669c6b760';

  it('submits when adding inventory item', async () => {
    await submitForm(values, openSRPBaseURL, setSubmittingMock, setIfDoneHereMock);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls).toHaveLength(2);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);

    expect(setIfDoneHereMock.mock.calls).toHaveLength(1);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);

    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(values),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    ]);
  });

  it('submits when editing an inventory item', async () => {
    await submitForm(values, openSRPBaseURL, setSubmittingMock, setIfDoneHereMock, inventoryID);

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls).toHaveLength(2);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);

    expect(setIfDoneHereMock.mock.calls).toHaveLength(1);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);

    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${inventoryID}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          ...values,
          stockId: inventoryID,
        }),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'PUT',
      },
    ]);
  });

  it('handles error when adding item', async () => {
    fetch.mockResponse('Server error here', { status: 500 });
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    await submitForm(values, openSRPBaseURL, setSubmittingMock, setIfDoneHereMock);

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(values),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    ]);
    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_GENERIC);
    expect(setSubmittingMock.mock.calls).toHaveLength(2);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneHereMock).not.toHaveBeenCalled();
  });

  it('handles error when editing item', async () => {
    fetch.mockResponse('Server error here', { status: 500 });
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    await submitForm(values, openSRPBaseURL, setSubmittingMock, setIfDoneHereMock, inventoryID);

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${inventoryID}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          ...values,
          stockId: inventoryID,
        }),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_GENERIC);
    expect(setSubmittingMock.mock.calls).toHaveLength(2);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneHereMock).not.toHaveBeenCalled();
  });
});

describe('components/InventoryItemForm/utils/isDatePastOrToday', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const today = '2020-08-10';

  beforeAll(() => {
    MockDate.set(today);
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('returns true for todays date', () => {
    expect(isDatePastOrToday(moment(today))).toEqual(true);
  });

  it('returns true for yesterdays date', () => {
    expect(isDatePastOrToday(moment('2020-08-09'))).toEqual(true);
  });

  it('returns false for tomorrows date', () => {
    expect(isDatePastOrToday(moment('2020-08-11'))).toEqual(false);
  });
});

describe('components/InventoryItemForm/utils/isDateFuture', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const today = '2020-08-10';

  beforeAll(() => {
    MockDate.set(today);
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('returns false for todays date', () => {
    expect(isDateFuture(moment(today))).toEqual(false);
  });

  it('returns false for yesterdays date', () => {
    expect(isDateFuture(moment('2020-08-09'))).toEqual(false);
  });

  it('returns true for tomorrows date', () => {
    expect(isDateFuture(moment('2020-08-11'))).toEqual(true);
  });
});
