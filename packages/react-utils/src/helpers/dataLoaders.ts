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

/**
 * Force token refresh regardless of current expiry state
 */
async function forceTokenRefresh(): Promise<string> {
  try {
    return await refreshToken(`${EXPRESS_TOKEN_REFRESH_URL}`, store.dispatch, {});
  } catch (e) {
    history.push(`${configs.appLoginURL}`);
    throw new Error('Session Expired');
  }
}

/**
 * Check if error is a 401 Unauthorized
 *
 * @param {Error} error - The error to check
 */
function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('401') || message.includes('unauthorized');
  }
  return false;
}

/**
 * Check if error is a transient server error (502, 503, 504)
 *
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is a transient server error
 */
function isTransientError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504') ||
      message.includes('bad gateway') ||
      message.includes('service unavailable')
    );
  }
  return false;
}

/**
 * Delay execution for a specified number of milliseconds
 *
 * @param {number} ms - The number of milliseconds to delay
 * @returns {Promise<void>} A promise that resolves after the delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry wrapper for FHIR client operations that throw errors on failure.
 * Handles 401 (token refresh + single retry), transient errors (502/503/504 with
 * exponential backoff), and throws immediately on all other errors.
 *
 * @param executeRequest - async callback that performs the FHIR client operation
 */
async function retryWithErrorHandling<T>(executeRequest: () => Promise<T>): Promise<T> {
  const maxAttempts = 4;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await executeRequest();
    } catch (error) {
      lastError = error as Error;

      // Handle 401 - refresh token and retry once
      if (isUnauthorizedError(error)) {
        await forceTokenRefresh();
        return await executeRequest();
      }

      // Handle transient errors - retry with backoff
      if (isTransientError(error) && attempt < maxAttempts - 1) {
        await delay(1000 * Math.pow(2, attempt));
        continue;
      }

      throw error;
    }
  }
  throw lastError;
}

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
  public headers: RequestInit['headers'] = {
    'Content-Type': 'application/fhir+json',
    'cache-control': 'no-cache',
  };

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

  public setHeaders(headers: Headers) {
    this.headers = headers;
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
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const serve = FHIR.client(this.buildState(accessToken));
      // TODO - using two clashing libraries to supply fhir resource typings, we should choose one.
      return serve.create<T>(payload as fhirclient.FHIR.Resource, {
        signal: this.signal,
        headers: this.headers,
      });
    });
  }

  public async update(payload: T) {
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const serve = FHIR.client(this.buildState(accessToken));
      // TODO - using two clashing libraries to supply fhir resource typings, we should choose one.
      return serve.update<T>(payload as fhirclient.FHIR.Resource, {
        signal: this.signal,
        headers: this.headers,
      });
    });
  }

  public async list(params: URLParams | null = null) {
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const queryStr = this.buildQueryParams(params);
      const serve = FHIR.client(this.buildState(accessToken));
      return serve.request<T>({ url: queryStr, headers: this.headers });
    });
  }

  public async read(id: string) {
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const serve = FHIR.client(this.buildState(accessToken));
      return serve.request<T>({
        url: `${this.resourceType}/${id}`,
        headers: this.headers,
      });
    });
  }

  public async customRequest(requestOptions: fhirclient.RequestOptions) {
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const serve = FHIR.client(this.buildState(accessToken));
      return serve.request({
        signal: this.signal,
        headers: this.headers,
        ...requestOptions,
      });
    });
  }

  public async delete(id: string) {
    return retryWithErrorHandling(async () => {
      const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
      const serve = FHIR.client(this.buildState(accessToken));
      return serve.delete(`${this.resourceType}/${id}`, {
        signal: this.signal,
        headers: this.headers,
      });
    });
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
