import { getFetchOptions } from '@opensrp/server-service';
import { OpenSRPServiceExtend, getToken } from '../services';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fetch = require('jest-fetch-mock');

const baseUrl = 'https://test.smartregister.org/opensrp/rest/';

describe('OpenSRPServiceExtend', () => {
  it('should get token', () => {
    expect(getToken(getFetchOptions)).toEqual('Bearer hunter2');
  });

  it('should post data', async () => {
    const service = new OpenSRPServiceExtend(baseUrl, 'files', getFetchOptions);
    await service.postData({ test: 'data' });
    expect(fetch.mock.calls).toEqual([
      [
        'https://test.smartregister.org/opensrp/rest/files',
        {
          body: {
            test: 'data',
          },
          headers: {
            Authorization: 'Bearer hunter2',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('OpenSRPService attaches a non successful apiResponse correctly', async () => {
    // json apiResponse object
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify('Some error happened'), { status: 500, statusText });
    const service = new OpenSRPServiceExtend(baseUrl, 'form');
    let error;
    try {
      await service.postData({ foo: 'bar' });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error('OpenSRPService create on form failed, HTTP status 500'));
    expect(error.description).toEqual('"Some error happened"');
    expect(error.statusText).toEqual('something happened');
    expect(error.statusCode).toEqual(500);
  });
});
