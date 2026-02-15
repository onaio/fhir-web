/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dataLoaders from '../dataLoaders';
import nock from 'nock';
import * as fhirCient from 'fhirclient';
import fetch from 'jest-fetch-mock';
import MockDate from 'mockdate';
import * as opensrpService from '@opensrp/server-service';
import * as fixtures from './fixtures';
import { authenticateUser, updateExtraData } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import * as registry from '@onaio/connected-reducer-registry';
import flushPromises from 'flush-promises';
import { fhirR4 } from '@smile-cdr/fhirts';

const { fetchProtectedImage, OpenSRPService, handleSessionOrTokenExpiry, FHIRServiceClass } =
  dataLoaders;

jest.mock('@opensrp/pkg-config', () => {
  const actual = jest.requireActual('@opensrp/pkg-config');
  return {
    ...actual,
    getAllConfigs: () => ({
      appLoginURL: '/someUrl',
    }),
  };
});

jest.mock('@opensrp/server-service', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/server-service')),
}));

describe('helpers/dataLoaders/fetchProtectedImage', () => {
  (global as any).URL.createObjectURL = jest.fn().mockReturnValue('hello');

  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('returns the url of the protected image', async () => {
    const bytes = new Uint8Array(59);

    for (let i = 0; i < 59; i++) {
      bytes[i] = 32 + i;
    }

    fetch.mockResponseOnce(JSON.stringify([bytes.buffer]));

    const objectURL = await fetchProtectedImage(
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4'
    );

    await flushPromises();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4',
      {
        headers: {
          authorization: 'Bearer hunter2',
        },
        method: 'GET',
      },
    ]);
    /***
     * @todo Most appropriate test case would be to also assert
     * expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
     * but mocking a blob response was a challenge. Hence URL.createOjectURL was mocked
     * above as (global as any).URL.createObjectURL = jest.fn().mockReturnValue('hello');
     */
    expect(objectURL).toEqual('hello');
  });

  it('returns null if response is null', async () => {
    jest.spyOn(opensrpService, 'customFetch').mockReturnValue(null);

    const objectURL = await fetchProtectedImage(
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4'
    );

    await flushPromises();
    expect(objectURL).toEqual(null);
  });
});

describe('dataLoaders/OpenSRPService', () => {
  const baseURL = 'https://test.smartregister.org/opensrp/rest/';
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

  it('OpenSRPService generic class constructor works', async () => {
    const planService = new OpenSRPService('organization', baseURL);
    expect(planService.baseURL).toEqual(baseURL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(`${baseURL}organization`);
  });

  it('works with default base url', async () => {
    const planService = new OpenSRPService('organization');
    expect(planService.baseURL).toEqual(opensrpService.OPENSRP_API_BASE_URL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization'
    );
  });
  it('handleSessionOrTokenExpiry works correctly', async () => {
    MockDate.set('1-1-2021 19:31');

    const pushMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (registry as any).history = {
      push: pushMock,
    };

    // no session found
    await handleSessionOrTokenExpiry().catch((e) => {
      expect(e.message).toEqual('Session Expired');
    });

    // acess token availble and not expired
    store.dispatch(updateExtraData(fixtures.userAuthData));
    const token = await handleSessionOrTokenExpiry();
    expect(token).toEqual(fixtures.userAuthData.oAuth2Data.access_token);

    // refresh token when expired
    fetch.once(JSON.stringify(fixtures.refreshTokenResponse));
    const authDataCopy = {
      ...fixtures.userAuthData,
      oAuth2Data: {
        ...fixtures.userAuthData.oAuth2Data,
        token_expires_at: '2019-01-02T14:11:20.102Z', // set token to expired
      },
    };
    store.dispatch(updateExtraData(authDataCopy));
    const newToken = await handleSessionOrTokenExpiry();
    expect(newToken).toEqual('refreshed-i-feel-new');

    // refresh token throws an error
    const errorMessage = 'API is down';
    fetch.mockRejectOnce(new Error(errorMessage));
    store.dispatch(updateExtraData(authDataCopy));
    await handleSessionOrTokenExpiry().catch((e) => {
      expect(e.message).toEqual('Session Expired');
    });

    //check redirection action
    expect(pushMock).toHaveBeenCalledWith('/someUrl');
    MockDate.reset();
  });
});

describe('dataloaders/FHIRService', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
    nock('https://test.fhir.org').get('/CareTeam').reply(200, fixtures.careTeams);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

  it('FHIRServiceClass constructor works correctly 2', async () => {
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    expect(fhir.baseURL).toEqual('https://test.fhir.org');
    expect(fhir.resourceType).toEqual('CareTeam');
  });

  it('buildQueryParams works', async () => {
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    expect(fhir.buildQueryParams(null)).toEqual('CareTeam');
    expect(fhir.buildQueryParams({ _count: '500', _getpagesoffset: '50' })).toEqual(
      'CareTeam/_search?_count=500&_getpagesoffset=50'
    );
  });

  it('FHIRServiceClass list method works without params', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fixtures.careTeams),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    const result = await fhir.list();
    await flushPromises();
    expect(requestMock.mock.calls).toEqual([
      [
        {
          headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/fhir+json',
          },
          url: 'CareTeam',
        },
      ],
    ]);
    expect(result).toEqual(fixtures.careTeams);
    // make sure every item of fhirlist returns the CareTeam
    expect(result.entry.every((e) => e.resource.resourceType === 'CareTeam')).toBeTruthy();
  });

  it('FHIRServiceClass list method works with params', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fixtures.careTeams),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    // without url params
    const result = await fhir.list({ _count: '100' });
    await flushPromises();
    expect(requestMock.mock.calls).toEqual([
      [
        {
          headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/fhir+json',
          },
          url: 'CareTeam/_search?_count=100',
        },
      ],
    ]);
    expect(result).toEqual(fixtures.careTeams);
    // make sure every item of fhirlist returns the CareTeam
    expect(result.entry.every((e) => e.resource.resourceType === 'CareTeam')).toBeTruthy();
  });

  it('FHIRServiceClass read method works', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fixtures.careTeam1),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    const result = await fhir.read('308');
    await flushPromises();
    expect(result).toEqual(fixtures.careTeam1);
  });

  it('FHIRServiceClass update method works', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const signal = new AbortController().signal;
    const updateMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          update: updateMock.mockResolvedValue(fixtures.careTeam1),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam', signal);
    const result = await fhir.update({ ...fixtures.careTeam1, name: 'New Name' });
    await flushPromises();
    expect(updateMock.mock.calls).toEqual([
      [
        {
          id: '308',
          identifier: [{ use: 'official', value: '93bc9c3d-6321-41b0-9b93-1275d7114e22' }],
          meta: {
            lastUpdated: '2021-06-18T06:07:29.649+00:00',
            source: '#9bf085bac3f61473',
            versionId: '4',
          },
          name: 'New Name',
          participant: [
            { member: { reference: 'Practitioner/206' } },
            { member: { reference: 'Practitioner/103' } },
          ],
          resourceType: 'CareTeam',
          status: 'active',
          subject: { reference: 'Group/306' },
        },
        {
          signal,
          headers: {
            'Content-Type': 'application/fhir+json',
            'cache-control': 'no-cache',
          },
        },
      ],
    ]);
    expect(result).toEqual(fixtures.careTeam1);
  });

  it('FHIRServiceClass create method works', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const createMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          create: createMock.mockResolvedValue(fixtures.careTeam1),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    const result = await fhir.create(fixtures.careTeam1);
    await flushPromises();
    expect(result).toEqual(fixtures.careTeam1);
  });

  it('FHIRServiceClass delete method works', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          delete: requestMock.mockResolvedValue('Success'),
        };
      })
    );
    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    const result = await fhir.delete('308');
    await flushPromises();
    expect(result).toEqual('Success');
  });
});

describe('FHIRServiceClass retry behavior', () => {
  let origSetTimeout: typeof setTimeout;
  const mockGetToken = async () => 'hunter2';

  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
    jest.restoreAllMocks();
    // Make delay() resolve immediately so tests don't wait for real backoff
    origSetTimeout = global.setTimeout;
    global.setTimeout = ((fn: () => void) => {
      fn();
      return 0;
    }) as unknown as typeof setTimeout;
  });

  afterEach(() => {
    global.setTimeout = origSetTimeout;
  });

  it('retries on transient 502 error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('502 Bad Gateway'))
      .mockResolvedValueOnce(fixtures.careTeams);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.list();
    await flushPromises();

    expect(result).toEqual(fixtures.careTeams);
    // First call fails with 502, second succeeds
    expect(requestMock).toHaveBeenCalledTimes(2);
  });

  it('retries on transient 503 error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockResolvedValueOnce(fixtures.careTeams);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.list();
    await flushPromises();

    expect(result).toEqual(fixtures.careTeams);
    expect(requestMock).toHaveBeenCalledTimes(3);
  });

  it('refreshes token and retries on 401 unauthorized error', async () => {
    // Mock refreshToken response (forceTokenRefresh calls refreshToken which uses fetch)
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));

    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce(fixtures.careTeams);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.list();
    await flushPromises();

    expect(result).toEqual(fixtures.careTeams);
    // First call fails with 401, forceTokenRefresh is called, then retry succeeds
    expect(requestMock).toHaveBeenCalledTimes(2);
  });

  it('throws immediately on non-retryable error', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn().mockRejectedValue(new Error('404 Not Found'));
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    await expect(fhir.list()).rejects.toThrow('404 Not Found');
    await flushPromises();

    // Should not retry - only one call
    expect(requestMock).toHaveBeenCalledTimes(1);
  });

  it('exhausts retries on persistent transient error', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn().mockRejectedValue(new Error('504 Gateway Timeout'));
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    await expect(fhir.list()).rejects.toThrow('504 Gateway Timeout');
    await flushPromises();

    // maxRetries is 3, loop runs attempt 0,1,2,3 = 4 calls total
    expect(requestMock).toHaveBeenCalledTimes(4);
  });

  it('create retries on transient error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const createMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('502 Bad Gateway'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        create: createMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.create(fixtures.careTeam1);
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(createMock).toHaveBeenCalledTimes(2);
  });

  it('update retries on transient error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const updateMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        update: updateMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.update(fixtures.careTeam1);
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(updateMock).toHaveBeenCalledTimes(2);
  });

  it('read retries on transient error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('504 Gateway Timeout'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.read('308');
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(requestMock).toHaveBeenCalledTimes(2);
  });

  it('delete retries on transient error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const deleteMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('502 Bad Gateway'))
      .mockResolvedValueOnce('Success');
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        delete: deleteMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.delete('308');
    await flushPromises();

    expect(result).toEqual('Success');
    expect(deleteMock).toHaveBeenCalledTimes(2);
  });

  it('customRequest retries on transient error then succeeds', async () => {
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockResolvedValueOnce(fixtures.careTeams);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.customRequest({ url: 'CareTeam' });
    await flushPromises();

    expect(result).toEqual(fixtures.careTeams);
    expect(requestMock).toHaveBeenCalledTimes(2);
  });

  it('create retries on 401 unauthorized error', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const createMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        create: createMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.create(fixtures.careTeam1);
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(createMock).toHaveBeenCalledTimes(2);
  });

  it('update retries on 401 unauthorized error', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const updateMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        update: updateMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.update(fixtures.careTeam1);
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(updateMock).toHaveBeenCalledTimes(2);
  });

  it('read retries on 401 unauthorized error', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce(fixtures.careTeam1);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.read('308');
    await flushPromises();

    expect(result).toEqual(fixtures.careTeam1);
    expect(requestMock).toHaveBeenCalledTimes(2);
  });

  it('delete retries on 401 unauthorized error', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const deleteMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce('Success');
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        delete: deleteMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.delete('308');
    await flushPromises();

    expect(result).toEqual('Success');
    expect(deleteMock).toHaveBeenCalledTimes(2);
  });

  it('customRequest retries on 401 unauthorized error', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.refreshTokenResponse));
    const fhirMock = jest.spyOn(fhirCient, 'client');
    const requestMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('401 Unauthorized'))
      .mockResolvedValueOnce(fixtures.careTeams);
    fhirMock.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: requestMock,
      }))
    );

    const fhir = new FHIRServiceClass<fhirR4.CareTeam>('https://test.fhir.org', 'CareTeam');
    fhir.accessTokenOrCallBack = mockGetToken;
    const result = await fhir.customRequest({ url: 'CareTeam' });
    await flushPromises();

    expect(result).toEqual(fixtures.careTeams);
    expect(requestMock).toHaveBeenCalledTimes(2);
  });
});
