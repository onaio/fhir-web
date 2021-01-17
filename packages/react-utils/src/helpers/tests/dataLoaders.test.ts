/* eslint-disable @typescript-eslint/camelcase */
import { handleSessionOrTokenExpiry, OpenSRPService } from '../dataLoaders';
import fetch from 'jest-fetch-mock';
import MockDate from 'mockdate';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import * as fixtures from './fixtures';
import { updateExtraData } from '@onaio/session-reducer';
import { store } from '@opensrp/store';

describe('dataLoaders/OpenSRPService', () => {
  const baseURL = 'https://test.smartregister.org/opensrp/rest/';
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('OpenSRPService generic class constructor works', async () => {
    const planService = new OpenSRPService('organization', baseURL);
    expect(planService.baseURL).toEqual(baseURL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(`${baseURL}organization`);
  });

  it('works with default base url', async () => {
    const planService = new OpenSRPService('organization');
    expect(planService.baseURL).toEqual(OPENSRP_API_BASE_URL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization'
    );
  });
  it('getAcessTokenOrRedirect works correctly', async () => {
    MockDate.set('1-1-2021 19:31');

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
    MockDate.reset();
  });
});
