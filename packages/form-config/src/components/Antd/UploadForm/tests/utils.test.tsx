import { submitForm } from '../utils';
import sampleFile from './sampleFile.json';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import * as notifications from '@opensrp/notifications';
import { ERROR_OCCURRED } from '../../../../constants';

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/UploadForm/utils/submitForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const values = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    form_name: 'foo',
    module: 'bar',
    // eslint-disable-next-line @typescript-eslint/camelcase
    form_relation: 'baz',
    form: sampleFile,
  };
  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest';
  const setSubmittingMock = jest.fn();
  const setIfDoneMock = jest.fn();

  it('submits', async () => {
    submitForm(values, accessToken, opensrpBaseURL, true, setSubmittingMock, setIfDoneMock);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneMock.mock.calls[0][0]).toEqual(true);
  });

  it('submits if json validator is false', async () => {
    submitForm(values, accessToken, opensrpBaseURL, false, setSubmittingMock, setIfDoneMock);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneMock.mock.calls[0][0]).toEqual(true);
  });

  it('handles error if form creation fails', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API has been hijacked by aliens'));

    submitForm(values, accessToken, opensrpBaseURL, false, setSubmittingMock, setIfDoneMock);

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith(ERROR_OCCURRED);
    expect(setIfDoneMock).not.toHaveBeenCalled();
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
  });
});
