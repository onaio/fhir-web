import { store } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  OPENSRP_API_BASE_URL,
  customFetch,
} from '@opensrp/server-service';
import { history } from '@onaio/connected-reducer-registry';
import { refreshToken } from '@onaio/gatekeeper';
import { getAccessToken, isTokenExpired } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';
import { EXPRESS_TOKEN_REFRESH_URL } from '../constants';
import { getAllConfigs } from '@opensrp/pkg-config';
import lang, { Lang } from '../lang';
import FHIR from 'fhirclient';

const configs = getAllConfigs();

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

/**
 * gets access token or redirects to login if session is expired
 *
 * @param langObject - look up of translations
 */
export const handleSessionOrTokenExpiry = async (langObject: Lang = lang) => {
  if (isTokenExpired(store.getState())) {
    try {
      // refresh token
      return await refreshToken(`${EXPRESS_TOKEN_REFRESH_URL}`, store.dispatch, {});
    } catch (e) {
      history.push(`${configs.appLoginURL}`);
      throw new Error(`${langObject.SESSION_EXPIRED_TEXT}`);
    }
  } else {
    return getAccessToken(store.getState());
  }
};

/**
 * Fetch an image that requires authentication and returns an
 * object URL from URL.createObjectURL
 *
 * @param imageURL the image source url
 */
export const fetchProtectedImage = async (imageURL: string) => {
  const token = await handleSessionOrTokenExpiry();
  const response = await customFetch(imageURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });

  if (response) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  return null;
};

/**
 * Higher order function that creates the FHIR Client instance and passes token
 * to request header
 *
 * Usage
 * -----------
 * const serve = await FHIRService("fhir base url")
 *
 * **To make a GET request: serve.request('fhir-resource-type')
 *
 * **To make a POST request: serve.create('fhir-resource-payload')
 *
 * **To make a PUT request: serve.update('fhir-resource-payload')
 *
 * **To DELETE a resource: serve.delete('<fhir-resource-type>/<id>')
 *
 * @param {string} fhirBaseURL - FHIR base URL
 */

export const FHIRService = async (fhirBaseURL: string) => {
  const token = await handleSessionOrTokenExpiry();
  // eslint-disable-next-line @typescript-eslint/camelcase
  const serve = FHIR.client({ serverUrl: fhirBaseURL, tokenResponse: { access_token: token } });
  return serve;
};
