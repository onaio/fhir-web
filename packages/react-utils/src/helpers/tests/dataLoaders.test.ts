/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fetchProtectedImage,
  handleSessionOrTokenExpiry,
  OpenSRPService,
  FHIRService,
} from '../dataLoaders';
import fetch from 'jest-fetch-mock';
import MockDate from 'mockdate';
import * as opensrpService from '@opensrp/server-service';
import * as fixtures from './fixtures';
import { authenticateUser, updateExtraData } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import * as registry from '@onaio/connected-reducer-registry';
import flushPromises from 'flush-promises';

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
        // eslint-disable-next-line @typescript-eslint/camelcase
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
    fetch.mockRejectOnce(() => Promise.reject(errorMessage));
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

  it('FHIRService works correctly', async () => {
    const serve = await FHIRService('https://test.fhir.com');
    expect(serve.getState()).toEqual({
      serverUrl: 'https://test.fhir.com',
      tokenResponse: { access_token: 'hunter2' },
    });
    // test correct auth headers are being created
    expect(serve.getAuthorizationHeader()).toEqual('Bearer hunter2');
  });
});
