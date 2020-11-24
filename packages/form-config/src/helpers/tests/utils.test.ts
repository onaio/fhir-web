import { formatDate, downloadManifestFile } from '../utils';
import { fixManifestFiles, downloadFile } from '../../ducks/tests/fixtures';
import fetch from 'jest-fetch-mock';
import { getFetchOptions } from '@opensrp/server-service';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('downloads manifest file correctly', async () => {
    fetch.once(JSON.stringify(downloadFile));
    await downloadManifestFile(
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
