import * as globalUtils from '../../../helpers/utils';
import * as fixtures from './fixtures';
import {
  createCsv,
  buildCSVFileName,
  formatDDMMYYY,
  handleCardOrderDateChange,
  submitForm,
} from '../utils';
import { OpenSRPService } from '@opensrp/server-service';
import Papaparse from 'papaparse';
import fetch from 'jest-fetch-mock';
import { DownloadClientDataFormFields } from '..';
import { OPENSRP_URL_CLIENT_SEARCH } from '../../../constants';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { notification } from 'antd';
import { ERROR_OCCURED } from '../../../../../../client/node_modules/@opensrp/user-management/src';
/* eslint-disable @typescript-eslint/no-explicit-any */

describe('components/DownloadClientData/utils/createCSV', () => {
  it('downloads csv correctly', () => {
    const mockDownload = jest.fn();
    (globalUtils as any).downloadFile = mockDownload;
    const fileName = 'client_data';
    createCsv([fixtures.csvEntry1, fixtures.csvEntry2], fileName);
    expect(mockDownload).toBeCalled();
    // File name should be correct
    expect(mockDownload.mock.calls[0][1]).toEqual('client_data');
    // Mime type should be correct
    expect(mockDownload.mock.calls[0][2]).toEqual('application/csv');
  });
});

describe('components/DownloadClientData/utils/buildCSVFileName', () => {
  it('builds the csv file name correctly', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date('2020-11-18'));
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    const fileName = buildCSVFileName('nairobi', '2020-01-01', '2020-04-30');

    expect(fileName).toEqual('Children_list_nairobi_18_11_2020_(01-01-2020 - 30-04-2020)');
  });
});

describe('components/DownloadClientData/utils/formatDDMMYYYY', () => {
  it('formats a Date object correctly using the default delimiter', () => {
    expect(formatDDMMYYY(new Date('2020-11-18'))).toEqual('18/11/2020');
  });

  it('formats a Date object using custom delimiter', () => {
    expect(formatDDMMYYY(new Date('2020-11-18'), '-')).toEqual('18-11-2020');
  });
});

describe('components/DownloadClientData/utils/handleCardOrderDateChange', () => {
  it('sets the card order data state', () => {
    const setCardOrderDateMock = jest.fn();
    const dateRange: [string, string] = ['2020-01-01', '2020-04-30'];
    handleCardOrderDateChange(dateRange, setCardOrderDateMock);
    expect(setCardOrderDateMock).toBeCalledWith(dateRange);
  });
});

describe('components/DownloadClientData/utils/submitForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDownload = jest.fn();
  const papaparseMock = jest.spyOn(Papaparse, 'unparse');
  (globalUtils as any).downloadFile = mockDownload;
  const clientLocation = 'e2b4a441-21b5-4d03-816b-09d45b17cad7';
  const cardStatus = 'needs_card';
  const startDate = '2020-01-01';
  const endDate = '2020-04-30';
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
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child, fixtures.child2]));

    submitForm(values, accessToken, opensrpBaseURL, OpenSRPService, setSubmittingMock);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `${opensrpBaseURL}${OPENSRP_URL_CLIENT_SEARCH}?startDate=${startDate}&endDate=${endDate}&registration_location=${clientLocation}&attribute=card_status:${cardStatus}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).toBeCalledWith([fixtures.csvEntry1, fixtures.csvEntry2], {
      header: true,
    });
  });

  it('handles error if submission fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notification, 'error');

    submitForm(values, accessToken, opensrpBaseURL, OpenSRPService, setSubmittingMock);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `${opensrpBaseURL}${OPENSRP_URL_CLIENT_SEARCH}?startDate=${startDate}&endDate=${endDate}&registration_location=${clientLocation}&attribute=card_status:${cardStatus}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: '',
    });
  });

  it('calls API correctly if non-required params are empty', async () => {
    fetch.mockResponse(JSON.stringify([fixtures.mother, fixtures.child, fixtures.child2]));

    submitForm(
      {
        ...values,
        clientLocation: '',
        cardStatus: '',
      },
      accessToken,
      opensrpBaseURL,
      OpenSRPService,
      setSubmittingMock
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(fetch.mock.calls[0]).toEqual([
      `${opensrpBaseURL}${OPENSRP_URL_CLIENT_SEARCH}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).toBeCalledWith([fixtures.csvEntry1, fixtures.csvEntry2], {
      header: true,
    });
  });

  it('handles an empty API response correctly', async () => {
    fetch.mockResponse(JSON.stringify([]));

    const notificationErrorMock = jest.spyOn(notification, 'error');

    submitForm(values, accessToken, opensrpBaseURL, OpenSRPService, setSubmittingMock);
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);

    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(papaparseMock).not.toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'No data found',
      description: '',
    });
  });
});
