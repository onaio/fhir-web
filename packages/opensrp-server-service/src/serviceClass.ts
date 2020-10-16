import { IncomingHttpHeaders } from 'http';
import queryString from 'querystring';

import { throwNetworkError, throwHTTPError } from './errors';
/** defaults */
export const OPENSRP_API_BASE_URL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';

/** allowed http methods */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** get default HTTP headers for OpenSRP service
 *
 * @param {string} accessToken - the access token
 * @param {string} accept - the MIME type to accept
 * @param {string} authorizationType - the authorization type
 * @param {string} contentType - the content type
 * @returns {IncomingHttpHeaders} - the headers
 */
export function getDefaultHeaders(
  accessToken = 'hunter2',
  accept = 'application/json',
  authorizationType = 'Bearer',
  contentType = 'application/json;charset=UTF-8'
): IncomingHttpHeaders {
  return {
    accept,
    authorization: `${authorizationType} ${accessToken}`,
    'content-type': contentType,
  };
}

/** get payload for fetch
 *
 * @param {AbortSignal} signal - signal object that allows you to communicate with a DOM request
 * @param {string} method - the HTTP method
 * @returns {object} - the payload
 */
export function getFetchOptions(
  signal: AbortSignal,
  method: HTTPMethod
): { headers: HeadersInit; method: HTTPMethod } {
  return {
    headers: getDefaultHeaders() as HeadersInit,
    method,
  };
}

/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean;
}

export interface CustomFetch {
  (input: RequestInfo, init?: RequestInit | undefined): Promise<Response | undefined>;
}

export const customFetch: CustomFetch = async (...rest) => {
  try {
    return await fetch(...rest);
  } catch (err) {
    throwNetworkError(err);
  }
};

/** params option type */
type paramsType = URLParams | null;

/** The OpenSRP service class
 *
 * Sample usage:
 * -------------
 * const service = new OpenSRPService('the-endpoint');
 *
 * **To list all objects**: service.list()
 *
 * **To get one object**: service.read('the-object-identifier')
 *
 * **To create a new object**: service.create(theObject)
 *
 * **To update an object**: service.update(theObject)
 */
export class OpenSRPService {
  public baseURL: string;
  public endpoint: string;
  public generalURL: string;
  public getOptions: typeof getFetchOptions;
  public signal: AbortSignal;

  /**
   * Constructor method
   *
   * @param {string} baseURL - the base OpenSRP API URL
   * @param {string} endpoint - the OpenSRP endpoint
   * @param {function()} getPayload - a function to get the payload
   * @param {AbortController} signal - abort signal
   */
  constructor(
    baseURL: string = OPENSRP_API_BASE_URL,
    endpoint: string,
    getPayload: typeof getFetchOptions = getFetchOptions,
    signal: AbortSignal = new AbortController().signal
  ) {
    this.endpoint = endpoint;
    this.getOptions = getPayload;
    this.signal = signal;
    this.baseURL = baseURL;
    this.generalURL = `${this.baseURL}${this.endpoint}`;
  }

  /** appends any query params to the url as a querystring
   *
   * @param {string} generalUrl - the url
   * @param {object} params - the url params object
   * @returns {string} the final url
   */
  public static getURL(generalUrl: string, params: paramsType): string {
    if (params) {
      return `${generalUrl}?${queryString.stringify(params)}`;
    }
    return generalUrl;
  }

  /** converts filter params object to string
   *
   * @param {object} obj - the object representing filter params
   * @returns {string} filter params as a string
   */
  public static getFilterParams(obj: URLParams | Record<string, unknown>): string {
    return Object.entries(obj)
      .map(([key, val]) => `${key}:${val}`)
      .join(',');
  }

  /** create method
   * Send a POST request to the general endpoint containing the new object data
   * Successful requests will result in a HTTP status 201 response with no body
   *
   * @param {object} data - the data to be POSTed
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  public async create<T>(
    data: T,
    params: paramsType = null,
    method: HTTPMethod = 'POST'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const payload = {
      ...this.getOptions(this.signal, method),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: JSON.stringify(data),
    };
    const response = await customFetch(url, payload);
    if (response) {
      if (response.ok || response.status === 201) {
        return {};
      }

      const defaultMessage = `OpenSRPService create on ${this.endpoint} failed, HTTP status ${response?.status}`;
      await throwHTTPError(response, defaultMessage);
    }

    return {};
  }

  /** read method
   * Send a GET request to the url for the specific object
   *
   * @param {string|number} id - the identifier of the object
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async read(
    id: string | number,
    params: paramsType = null,
    method: HTTPMethod = 'GET'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const url = OpenSRPService.getURL(`${this.generalURL}/${id}`, params);
    const response = await customFetch(url, this.getOptions(this.signal, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `OpenSRPService read on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** update method
   * Simply send the updated object as PUT request to the general endpoint URL
   * Successful requests will result in a HTTP status 200/201 response with no body
   *
   * @param {object} data - the data to be POSTed
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  public async update<T>(
    data: T,
    params: paramsType = null,
    method: HTTPMethod = 'PUT'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const payload = {
      ...this.getOptions(this.signal, method),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: JSON.stringify(data),
    };
    const response = await customFetch(url, payload);
    if (response) {
      if (response.ok) {
        return {};
      }
      const defaultMessage = `OpenSRPService update on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }

    return {};
  }

  /** list method
   * Send a GET request to the general API endpoint
   *
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} list of objects returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async list(params: paramsType = null, method: HTTPMethod = 'GET'): Promise<any> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const response = await customFetch(url, this.getOptions(this.signal, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `OpenSRPService list on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** delete method
   * Send a DELETE request to the general endpoint
   * Successful requests will result in a HTTP status 204
   *
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete<T>(
    params: paramsType = null,
    method: HTTPMethod = 'DELETE'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const response = await fetch(url, this.getOptions(this.signal, method));

    if (response) {
      if (response.ok || response.status === 204 || response.status === 200) {
        return {};
      }
      const defaultMessage = `OpenSRPService delete on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }

    return {};
  }
}
