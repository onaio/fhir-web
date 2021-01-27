import { formatDate, downloadManifestFile } from '../utils';
import { fixManifestFiles, downloadFile } from '../../ducks/tests/fixtures';
import fetch from 'jest-fetch-mock';
import { getFetchOptions } from '@opensrp/server-service';
import { submitForm } from '../utils';
import sampleFile from './sampleFile.json';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.createObjectURL = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.revokeObjectURL = jest.fn();

describe('utils/formatDate', () => {
  it('should accept different date formats', () => {
    expect(formatDate('2019-10-20T15:21:50.227+02:00')).toEqual('2019-10-20');
    expect(formatDate('december 18, 2019, 8:45:22 PM')).toEqual('2019-12-18');
  });

  it('should add prefix 0 to days and months less than 10', () => {
    // month
    expect(formatDate('june 18, 2019, 8:45:22 PM')).toEqual('2019-06-18');
    // day
    expect(formatDate('december 8, 2019, 8:45:22 PM')).toEqual('2019-12-08');
    // day and  month
    expect(formatDate('June 8, 2019, 8:45:22 PM')).toEqual('2019-06-08');
  });
});

describe('utils/downloadManifestFile', () => {
  const baseURL = 'https://test-example.com/rest';
  const downloadEndPoint = 'form-download';
  const accessToken = 'hunter2';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('downloads manifest file correctly', async () => {
    fetch.once(JSON.stringify(downloadFile));
    await downloadManifestFile(
      accessToken,
      baseURL,
      downloadEndPoint,
      fixManifestFiles[0],
      true,
      getFetchOptions
    );

    expect(fetch.mock.calls).toEqual([
      [
        'https://test-example.com/restform-download?form_identifier=test-form-1.json&form_version=1.0.26&is_json_validator=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('it downloads correctly if is not json validator', async () => {
    fetch.once(JSON.stringify(downloadFile));
    await downloadManifestFile(
      accessToken,
      baseURL,
      downloadEndPoint,
      fixManifestFiles[0],
      false,
      getFetchOptions
    );

    expect(fetch.mock.calls).toEqual([
      [
        'https://test-example.com/restform-download?form_identifier=test-form-1.json&form_version=1.0.26',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });
});

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
  const alertErrorMock = jest.fn();
  const endpoint = '/clientForm';

  it('submits', async () => {
    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

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

  it('submits with default endpoint value', async () => {
    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock
    );

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
    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      false,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

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
    fetch.mockResponse(
      'Unknown error. Kindly confirm that the form does not already exist on the server',
      { status: 500 }
    );

    submitForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(alertErrorMock).toHaveBeenCalledWith(
      'Unknown error. Kindly confirm that the form does not already exist on the server'
    );
    expect(setIfDoneMock).not.toHaveBeenCalled();
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
  });
});
