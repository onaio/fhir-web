import { store } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  OPENSRP_API_BASE_URL,
  customFetch,
  URLParams,
  GetAccessTokenType,
} from '@opensrp/server-service';
import { history } from '@onaio/connected-reducer-registry';
import { refreshToken } from '@onaio/gatekeeper';
import { getAccessToken, isTokenExpired } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';
import { EXPRESS_TOKEN_REFRESH_URL } from '../constants';
import { getAllConfigs } from '@opensrp/pkg-config';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import type { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

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
    super(handleSessionOrTokenExpiry as GetAccessTokenType, baseURL, endpoint, fetchOptions);
  }
}

/**
 * A generic FHIR service class
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
export class FHIRServiceClass<T extends IResource> {
  public accessTokenOrCallBack: GetAccessTokenType | string;
  public baseURL: string;
  public resourceType: string;
  public signal: AbortSignal;

  /**
   * Constructor method
   *
   * @param {string} baseURL - the base FHIR URL
   * @param {string} resourceType - FHIR resource type string
   * @param {AbortSignal} signal - Abort fetch request
   */
  constructor(
    baseURL: string,
    resourceType: string,
    signal: AbortSignal = new AbortController().signal
  ) {
    this.accessTokenOrCallBack = handleSessionOrTokenExpiry as GetAccessTokenType;
    this.baseURL = baseURL;
    this.resourceType = resourceType;
    this.signal = signal;
  }

  public buildQueryParams(params: URLParams | null) {
    if (params) {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, element]) => {
        urlParams.append(key, element?.toString() ?? '');
      });
      return `${this.resourceType}/_search?${urlParams.toString()}`;
    }
    return this.resourceType;
  }

  private buildState(accessToken: string) {
    return {
      serverUrl: this.baseURL,
      tokenResponse: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: accessToken,
      },
    };
  }

  public async create(payload: T) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    // TODO - using two clashing libraries to supply fhir resource typings, we should choose one.
    return serve.create<T>(payload as fhirclient.FHIR.Resource, { signal: this.signal });
  }

  public async update(payload: T) {
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const serve = FHIR.client(this.buildState(accessToken));
    // TODO - using two clashing libraries to supply fhir resource typings, we should choose one.
    return serve.update<T>(payload as fhirclient.FHIR.Resource, { signal: this.signal });
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
    return serve.delete(`${this.resourceType}/${id}`, { signal: this.signal });
  }
}

/**
 * gets access token or redirects to login if session is expired
 *
 */
export async function handleSessionOrTokenExpiry() {
  if (isTokenExpired(store.getState())) {
    try {
      // refresh token
      return await refreshToken(`${EXPRESS_TOKEN_REFRESH_URL}`, store.dispatch, {});
    } catch (e) {
      history.push(`${configs.appLoginURL}`);
      throw new Error('Session Expired');
    }
  } else {
    return getAccessToken(store.getState());
  }
}

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
