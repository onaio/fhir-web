import * as globalUtils from '../../../helpers/utils';
import * as fixtures from './fixtures';
import {
  createCsv,
  buildCSVFileName,
  formatDDMMYYY,
  handleCardOrderDateChange,
  submitForm,
  getLocationDetails,
} from '../utils';
import { OpenSRPService } from '@opensrp/server-service';
import Papaparse from 'papaparse';
import fetch from 'jest-fetch-mock';
import { DownloadClientDataFormFields } from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import * as notifications from '@opensrp/notifications';
import lang from '../../../lang';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));
const mockDownload = jest.fn();
(globalUtils as any).downloadFile = mockDownload;

describe('components/DownloadClientData/utils/createCSV', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('downloads csv correctly', () => {
    const fileName = 'client_data';
    createCsv([fixtures.child1CsvEntry, fixtures.child2CsvEntry], fileName);
    expect(mockDownload).toBeCalled();
    // File name should be correct
    expect(mockDownload.mock.calls[0][1]).toEqual('client_data.csv');
    // Mime type should be correct
    expect(mockDownload.mock.calls[0][2]).toEqual('application/csv');
  });
});

describe('components/DownloadClientData/utils/buildCSVFileName', () => {
  const currentDate = new Date('2020-11-18');
  const realDate = Date;

  beforeAll(() => {
    // Mock new Date() but do not mock if date passed to constructor i.e
    // mock current date only
    const DateExtend = class extends Date {
      constructor(date: any) {
        if (date) {
          super(date);
        } else {
          return currentDate;
        }
      }
    };
    (global as any).Date = DateExtend;
  });

  afterAll(() => {
    global.Date = realDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('builds the csv file name correctly', () => {
    const fileName = buildCSVFileName('nairobi', '2020-01-01', '2020-04-30');

    expect(fileName).toEqual('Children_list_nairobi_18_11_2020_(01-01-2020 - 30-04-2020)');
  });
});

describe('components/DownloadClientData/utils/formatDDMMYYYY', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('formats a Date object correctly using the default delimiter', () => {
    expect(formatDDMMYYY(new Date('2020-11-18'))).toEqual('18/11/2020');
  });

  it('formats a Date object using custom delimiter', () => {
    expect(formatDDMMYYY(new Date('2020-11-18'), '-')).toEqual('18-11-2020');
  });
});

describe('components/DownloadClientData/utils/handleCardOrderDateChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets the card order data state', () => {
    const setCardOrderDateMock = jest.fn();
    const dateRange: [string, string] = ['2020-01-01', '2020-04-30'];
    handleCardOrderDateChange(dateRange, setCardOrderDateMock);
    expect(setCardOrderDateMock).toBeCalledWith(dateRange);
  });
});

describe('components/DownloadClientData/utils/submitForm', () => {
  const currentDate = new Date('2020-11-18');
  const realDate = Date;

  beforeAll(() => {
    // Mock new Date() but do not mock if date passed to constructor i.e
    // mock current date only
    const DateExtend = class extends Date {
      constructor(date: any) {
        if (date) {
          super(date);
        } else {
          return currentDate;
        }
      }
    };
    (global as any).Date = DateExtend;
  });

  afterAll(() => {
    global.Date = realDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const papaparseMock = jest.spyOn(Papaparse, 'unparse');
  const clientLocation = 'e2b4a441-21b5-4d03-816b-09d45b17cad7';
  const cardStatus = 'needs_card';
  const startDate = '2020-04-26';
  const endDate = '2020-12-26';
  const cardOrderDate: [string, string] = [startDate, endDate];
  const values: DownloadClientDataFormFields = {
    clientLocation,
    cardStatus,
    cardOrderDate,
  };
  const opensrpBaseURL = 'https://unicef-tunisia-stage.smartregister.org/opensrp/rest';
  const accessToken = 'hunter2';
  const setSubmittingMock = jest.fn();

  it('submits the form correctly', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=${clientLocation}&attribute=card_status:${cardStatus}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
    // File name should be correct
    expect(mockDownload.mock.calls[0][1]).toEqual(
      'Children_list_CSB Hopital Bouficha_18_11_2020_(26-04-2020 - 26-12-2020).csv'
    );
  });

  it('handles error if submission fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );
    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=${clientLocation}&attribute=card_status:${cardStatus}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
  });

  it('calls API correctly if card status is empty', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    submitForm(
      {
        ...values,
        cardStatus: '',
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );
    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=${clientLocation}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
  });

  it('handles an empty API response correctly', async () => {
    fetch.mockResponse(JSON.stringify([]));

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );
    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith('No data found');
  });

  it('filters correctly if start and end for date range is the same', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));
    submitForm(
      {
        ...values,
        cardOrderDate: ['2020-11-26', '2020-11-26'],
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry], {
      header: true,
    });
  });

  it('filters correctly if registration date does not meet range', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));
    submitForm(
      {
        ...values,
        cardOrderDate: ['2020-04-26', '2020-10-26'],
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(papaparseMock).toBeCalledWith([fixtures.child2CsvEntry], {
      header: true,
    });
  });

  it('does not fetch clients if location is empty', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    submitForm(
      {
        ...values,
        clientLocation: '',
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );
    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(papaparseMock).not.toHaveBeenCalled();
  });

  it('creates csv correctly if location is not found in hierarchy', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    submitForm(
      {
        ...values,
        clientLocation: 'a2b4a441-21b5-4d03-816b-09d45b17cad9', // id not in hierarchy
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      fixtures.locations,
      setSubmittingMock
    );
    await act(async () => {
      await flushPromises();
    });
    expect(papaparseMock).toBeCalledWith(
      [
        {
          ...fixtures.child1CsvEntry,
          facility_of_registration: '',
        },
        {
          ...fixtures.child2CsvEntry,
          facility_of_registration: '',
        },
      ],
      {
        header: true,
      }
    );
    expect(mockDownload.mock.calls[0][1]).toEqual(
      'Children_list__18_11_2020_(26-04-2020 - 26-12-2020).csv'
    );
  });
});

describe('components/DownloadClientData/utils/getLocationDetails', () => {
  it('returns location from hierarchy', () => {
    expect(getLocationDetails(fixtures.locations, 'e2b4a441-21b5-4d03-816b-09d45b17cad7')).toEqual(
      fixtures.locationTreeNode1
    );
  });

  it('returns null if location not found in hierarchy', () => {
    expect(getLocationDetails(fixtures.locations, 'a2b4a441-21b5-4d03-816b-09d45b17cad9')).toEqual(
      null
    );
  });

  it('returns location from nested hierarchy', () => {
    expect(
      getLocationDetails(
        [fixtures.locationTreeNode1, fixtures.locationTreeNode3],
        'u5b4a441-21b5-4d03-816b-09d45b17cad1'
      )
    ).toEqual(fixtures.locationTreeNode2);
  });
});
