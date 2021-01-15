import { store } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  OPENSRP_API_BASE_URL,
} from '@opensrp/server-service';
import { history } from '@onaio/connected-reducer-registry';
import { refreshToken } from '@onaio/gatekeeper';
import { getAccessToken, isTokenExpired } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';

/** OpenSRP service Generic class */
export class OpenSRPService<T extends object = Dictionary> extends GenericOpenSRPService<T> {
  /**
   *
   * @param {string} endpoint - the OpenSRP endpoint
   * @param {string} baseURL - base OpenSRP API URL
   * @param {Function} fetchOptions - function to return options to be passed to request
   */
  constructor(
    endpoint: string,
    baseURL: string = OPENSRP_API_BASE_URL,
    fetchOptions: typeof getFetchOptions = getFetchOptions
  ) {
    super(handleSessionOrTokenExpiry, baseURL, endpoint, fetchOptions);
  }
}

/** gets access token or redirects to login if session is expired */
export const handleSessionOrTokenExpiry = async () => {
  if (isTokenExpired(store.getState())) {
    try {
      // refresh token
      return await refreshToken('/refresh/token', store.dispatch, {});
    } catch (e) {
      history.push('/login');
      throw new Error('Session expired');
    }
  } else {
    return getAccessToken(store.getState());
  }
};
