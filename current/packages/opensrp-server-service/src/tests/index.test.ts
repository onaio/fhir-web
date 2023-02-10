/* eslint-disable @typescript-eslint/naming-convention */
import { getDefaultHeaders, OpenSRPService, OPENSRP_API_BASE_URL } from '..';
import { createPlan, plansListResponse } from './fixtures/plans';
import { sampleErrorObj } from './fixtures/session';
import { throwNetworkError, throwHTTPError, HTTPError } from '../errors';
import fetch from 'jest-fetch-mock';
const getAccessToken = (): Promise<string> =>
  new Promise((resolve, _) => {
    return resolve('hunter2');
  });

describe('services/OpenSRP', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('getDefaultHeaders works', async () => {
    expect(getDefaultHeaders('iLoveOov')).toEqual({
      accept: 'application/json',
      authorization: 'Bearer iLoveOov',
      'content-type': 'application/json;charset=UTF-8',
    });
  });

  it('OpenSRPService constructor works', async () => {
    const planService = new OpenSRPService('hunter2', OPENSRP_API_BASE_URL, 'plans');
    expect(planService.baseURL).toEqual('https://opensrp-stage.smartregister.org/opensrp/rest/');
    expect(planService.endpoint).toEqual('plans');
    expect(planService.generalURL).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/plans'
    );
  });

  it('getFilterParams works', async () => {
    expect(OpenSRPService.getFilterParams({})).toEqual('');
    expect(OpenSRPService.getFilterParams({ foo: 'bar', leet: 1337, mosh: 'pitt' })).toEqual(
      'foo:bar,leet:1337,mosh:pitt'
    );
  });

  it('processAcessToken works', async () => {
    // token passed as string
    let result = await OpenSRPService.processAcessToken('hunter2');
    expect(result).toEqual('hunter2');
    // call back passed
    result = await OpenSRPService.processAcessToken(getAccessToken);
    expect(result).toEqual('hunter2');
  });

  // list method

  it('OpenSRPService list method works', async () => {
    fetch.mockResponseOnce(JSON.stringify(plansListResponse));
    const planService = new OpenSRPService('hunter2', OPENSRP_API_BASE_URL, 'plans');
    const result = await planService.list();
    expect(result).toEqual(plansListResponse);
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
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

  it('OpenSRPService list method params work', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'location');

    await service.list({ is_jurisdiction: true, attribute: 'card_status:needs_card' });
    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true&attribute=card_status:needs_card',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('OpenSRPService list method should handle http errors', async () => {
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify(sampleErrorObj), { status: 500, statusText });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await planService.list();
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(new Error('OpenSRPService list on plans failed, HTTP status 500'));
    expect(error.name).toEqual('HTTPError');
    expect(error.statusCode).toEqual(500);
  });

  // delete method

  it('OpenSRPService delete method works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new OpenSRPService('hunter2', OPENSRP_API_BASE_URL, 'practitioners');
    const result = await service.delete({ practitioner: 'someone' });
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioners?practitioner=someone',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
    ]);
  });

  it('OpenSRPService delete method on solo endpoint', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new OpenSRPService(
      getAccessToken,
      OPENSRP_API_BASE_URL,
      'practitioners/someId'
    );
    const result = await service.delete();
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioners/someId',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
    ]);
  });

  it('OpenSRPService delete method should handle http errors', async () => {
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify(sampleErrorObj), { status: 500, statusText });
    const service = new OpenSRPService('hunter2', OPENSRP_API_BASE_URL, 'practitioners');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await service.delete({});
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(
      new Error('OpenSRPService delete on practitioners failed, HTTP status 500')
    );
    expect(error.description).toEqual(JSON.stringify(sampleErrorObj));
    expect(error.statusText).toEqual('something happened');
    expect(error.statusCode).toEqual(500);
  });

  // read method

  it('OpenSRPService read method works', async () => {
    fetch.mockResponseOnce(JSON.stringify(plansListResponse[0]));
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    const result = await planService.read('0e85c238-39c1-4cea-a926-3d89f0c98427');
    expect(result).toEqual(plansListResponse[0]);
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans/0e85c238-39c1-4cea-a926-3d89f0c98427',
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

  it('OpenSRPService read method handles null response', async () => {
    fetch.mockResponseOnce(JSON.stringify(null));
    const taskService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'task');
    const result = await taskService.read('079a7fe8-ef46-462f-9c5c-8b2490344e4a');
    expect(result).toEqual(null);
  });

  it('OpenSRPService read method params work', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'location');

    await service.read('62b2f313', { is_jurisdiction: true });
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/62b2f313?is_jurisdiction=true'
    );
  });

  it('OpenSRPService read method should handle http errors', async () => {
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify(sampleErrorObj), { status: 500, statusText });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await planService.read('0e85c238-39c1-4cea-a926-3d89f0c98427');
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(new Error('OpenSRPService read on plans failed, HTTP status 500'));
    expect(error.description).toEqual(JSON.stringify(sampleErrorObj));
    expect(error.statusText).toEqual('something happened');
    expect(error.statusCode).toEqual(500);
  });

  it('OpenSRPService create method works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    const result = await planService.create(createPlan);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(createPlan),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('OpenSRPService create method params work', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });
    const service = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'location');

    await service.create({ foo: 'bar' }, { is_jurisdiction: true });
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true'
    );
  });

  it('OpenSRPService create method should handle http errors', async () => {
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify(sampleErrorObj), { status: 500, statusText });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await planService.create({ foo: 'bar' });
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(new Error('OpenSRPService create on plans failed, HTTP status 500'));
    expect(error.description).toEqual(JSON.stringify(sampleErrorObj));
    expect(error.statusText).toEqual('something happened');
    expect(error.statusCode).toEqual(500);
  });

  it('can create own body when posting ', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });
    const sampleObj = { message: 'We do not do that here' };
    const customOptions = () => {
      return {
        body: JSON.stringify(sampleObj),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
        },
        method: 'POST',
      };
    };
    const placeboPayload = {
      message: 'We actually do',
    };
    const planService = new OpenSRPService(
      getAccessToken,
      OPENSRP_API_BASE_URL,
      'plans',
      customOptions
    );
    const result = await planService.create(placeboPayload);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"message":"We do not do that here"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('OpenSRPService update method works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    const obj = {
      ...createPlan,
      status: 'retired',
    };
    const result = await planService.update(obj);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(obj),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
  });

  it('OpenSRPService update method params work', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'location');

    await service.update({ foo: 'bar' }, { is_jurisdiction: true });
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true'
    );
  });

  it('OpenSRPService update method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await planService.update({ foo: 'bar' });
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(new Error('OpenSRPService update on plans failed, HTTP status 500'));
  });

  it('OpenSRPService attaches a non successful apiResponse correctly', async () => {
    // json apiResponse object
    const statusText = 'something happened';
    fetch.mockResponseOnce(JSON.stringify('Some error happened'), { status: 500, statusText });
    const planService = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'plans');
    let error: HTTPError = new HTTPError({} as Response, '');
    try {
      await planService.update({ foo: 'bar' });
    } catch (e) {
      error = e as HTTPError;
    }
    expect(error).toEqual(new Error('OpenSRPService update on plans failed, HTTP status 500'));
    expect(error.description).toEqual('"Some error happened"');
    expect(error.statusText).toEqual('something happened');
    expect(error.statusCode).toEqual(500);
  });

  it('Can create own body when updating', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const sampleObj = { message: 'We do not do that here' };
    const customOptions = () => {
      return {
        body: JSON.stringify(sampleObj),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
        },
        method: 'PUT',
      };
    };
    const placeboPayload = {
      message: 'We actually do',
    };
    const planService = new OpenSRPService(
      getAccessToken,
      OPENSRP_API_BASE_URL,
      'plans',
      customOptions
    );
    const result = await planService.update(placeboPayload);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"message":"We do not do that here"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
          },
          method: 'PUT',
        },
      ],
    ]);
  });

  it('OpenSRPService download method works', async () => {
    fetch.mockResponseOnce('test blob data', {
      status: 200,
      headers: { 'content-disposition': 'attachment; filename=test.pdf' },
    });
    const serve = new OpenSRPService(getAccessToken, OPENSRP_API_BASE_URL, 'download-file/001');

    const response = await serve.download();

    const contentDisposition = response.headers.get('content-disposition');
    expect(contentDisposition).toEqual('attachment; filename=test.pdf');

    const blob = await response.blob();
    // checking constructor name is the only reliable way to verify the object's constructing class is "blob-like"
    expect(blob.constructor.name === 'Blob').toBeTruthy();

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/download-file/001',
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

describe('src/errors', () => {
  it('does not create a network error', () => {
    /// increase test coverage.
    try {
      const error = new SyntaxError();
      throwNetworkError(error);
    } catch (err) {
      expect((err as HTTPError).name).toEqual('SyntaxError');
    }
  });

  it('creates a network error', () => {
    /// increase test coverage.
    try {
      const error = new TypeError();
      throwNetworkError(error);
    } catch (err) {
      expect((err as HTTPError).name).toEqual('NetworkError');
    }
  });

  it('throws HTTPErrors', async () => {
    try {
      const sampleResponse = new Response(JSON.stringify({}), {
        status: 500,
        statusText: 'Nothing',
      });
      await throwHTTPError(sampleResponse);
    } catch (err) {
      expect((err as HTTPError).name).toEqual('HTTPError');
    }
  });
});
