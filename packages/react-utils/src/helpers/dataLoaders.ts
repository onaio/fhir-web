import { store } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  OPENSRP_API_BASE_URL,
  customFetch,
  URLParams,
  GetAccessTokenType,
} from '@opensrp/server-service';
import queryString from 'querystring';
import { history } from '@onaio/connected-reducer-registry';
import { refreshToken } from '@onaio/gatekeeper';
import { getAccessToken, isTokenExpired } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';
import { EXPRESS_TOKEN_REFRESH_URL } from '../constants';
import { getAllConfigs } from '@opensrp/pkg-config';
import lang, { Lang } from '../lang';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { FHIRResponse } from '..';

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

/** A generic FHIR service class
 *
 * Sample usage:
 * -------------
 * const serve = new FHIRServiceClass('<base url>', '<resource type>');
 *
 * **To list all entries of a resource (GET request)**: serve.list()
 *
 * **To get one resource record**: service.read('<object id>')
 *
 * **To create a new resource**: service.create(payload)
 *
 * **To update a resource record**: service.update(payload)
 *
 * **To delete a resource entry**: service.delete(<id>)
 */
export class FHIRServiceClass<T = fhirclient.FHIR.Resource> {
  public accessTokenOrCallBack: GetAccessTokenType | string;
  public baseURL: string;
  public resourceType: string;

  /**
   * Constructor method
   *
   * @param {string} baseURL - the base FHIR URL
   * @param {string} resourceType - FHIR resource type string
   */
  constructor(baseURL: string, resourceType: string) {
    this.accessTokenOrCallBack = handleSessionOrTokenExpiry;
    this.baseURL = baseURL;
    this.resourceType = resourceType;
  }

  public buildQueryParams(params: URLParams | null) {
    if (params) {
      return `${this.resourceType}/_search?${decodeURIComponent(queryString.stringify(params))}`;
    }
    return this.resourceType;
  }

  private buildState(accessToken: string) {
    return {
      serverUrl: this.baseURL,
      tokenResponse: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: accessToken,
      },
    };
  }

  public async create(payload: T) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    return serve.create<T>(payload);
  }

  public async update(payload: T) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    return serve.update<T>(payload);
  }

  public async list(params: URLParams | null = null) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const queryStr = this.buildQueryParams(params);
    const serve = FHIR.client(this.buildState(accessToken));
    return serve.request<T>(queryStr);
  }

  public async read(id: string) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    return serve.request<T>(`${this.resourceType}/${id}`);
  }

  public async delete(id: string) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    return serve.delete(`${this.resourceType}/${id}`);
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
