import { IncomingHttpHeaders } from 'http';
import { Dictionary } from '@onaio/utils';
import queryString from 'querystring';

import { throwNetworkError, throwHTTPError } from './errors';
/** defaults */
export const OPENSRP_API_BASE_URL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';

/** allowed http methods */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * get default HTTP headers for OpenSRP service
 *
 * @param {string} accessToken - the access token
 * @param {string} accept - the MIME type to accept
 * @param {string} authorizationType - the authorization type
 * @param {string} contentType - the content type
 * @returns {IncomingHttpHeaders} - the headers
 */
export function getDefaultHeaders(
  accessToken: string,
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

/**
 * get payload for fetch
 *
 * @param {object} _ - signal object that allows you to communicate with a DOM request
 * @param {string} accessToken - the access token
 * @param {string} method - the HTTP method
 * @param {object} data - data to be used for payload
 * @returns {Object} the payload
 */
export function getFetchOptions<T extends object = Dictionary>(
  _: AbortSignal,
  accessToken: string,
  method: HTTPMethod,
  data?: T
): RequestInit {
  return {
    headers: getDefaultHeaders(accessToken) as HeadersInit,
    method,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };
}

/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean | undefined;
}

export interface CustomFetch {
  (input: RequestInfo, init?: RequestInit | undefined): Promise<Response | undefined>;
}

export const customFetch: CustomFetch = async (...rest) => {
  try {
    return await fetch(...rest);
  } catch (err) {
    throwNetworkError(err as Error);
  }
};

/** params option type */
type ParamsType = URLParams | null;

/** get acess token call back fn type */
export type GetAccessTokenType = () => Promise<string | null>;

/**
 * The OpenSRP service class
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
export class OpenSRPService<PayloadT extends object = Dictionary> {
  public accessTokenOrCallBack: GetAccessTokenType | string;
  public baseURL: string;
  public endpoint: string;
  public generalURL: string;
  public getOptions: typeof getFetchOptions;
  public signal: AbortSignal;

  /**
   * Constructor method
   *
   * @param {Function | string } accessTokenOrCallBack - asyc fn for getting the access token or access token
   * @param {string} baseURL - the base OpenSRP API URL
   * @param {string} endpoint - the OpenSRP endpoint
   * @param {Function} getOptions - a function to get the payload
   * @param {AbortController} signal - abort signal
   */
  constructor(
    accessTokenOrCallBack: GetAccessTokenType | string,
    baseURL: string = OPENSRP_API_BASE_URL,
    endpoint: string,
    getOptions: typeof getFetchOptions = getFetchOptions,
    signal: AbortSignal = new AbortController().signal
  ) {
    this.endpoint = endpoint;
    this.getOptions = getOptions;
    this.signal = signal;
    this.baseURL = baseURL;
    this.generalURL = `${this.baseURL}${this.endpoint}`;
    this.accessTokenOrCallBack = accessTokenOrCallBack;
  }

  /**
   * appends any query params to the url as a querystring
   *
   * @param {string} generalUrl - the url
   * @param {object} params - the url params object
   * @returns {string} the final url
   */
  public static getURL(generalUrl: string, params: ParamsType): string {
    if (params) {
      return `${generalUrl}?${decodeURIComponent(queryString.stringify(params))}`;
    }
    return generalUrl;
  }

  /**
   * converts filter params object to string
   *
   * @param {object} obj - the object representing filter params
   * @returns {string} filter params as a string
   */
  public static getFilterParams(obj: URLParams | Record<string, unknown>): string {
    return Object.entries(obj)
      .map(([key, val]) => `${key}:${val}`)
      .join(',');
  }

  /**
   * process received access token
   *
   * @param {Function | string} accessTokenCallBack - received access token
   */
  public static async processAcessToken(accessTokenCallBack: GetAccessTokenType | string) {
    if (typeof accessTokenCallBack === 'function') {
      return (await accessTokenCallBack()) as string;
    }
    return accessTokenCallBack;
  }

  /**
   * create method
   * Send a POST request to the general endpoint containing the new object data
   * Successful requests will result in a HTTP status 201 response with no body
   *
   * @param {object} data - the data to be POSTed
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  public async create(
    data: PayloadT,
    params: ParamsType = null,
    method: HTTPMethod = 'POST'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const payload = {
      ...this.getOptions<PayloadT>(this.signal, accessToken, method, data),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    };
    const response = await customFetch(url, payload);
    if (response) {
      if (response.ok || response.status === 201) {
        return {};
      }

      const defaultMessage = `OpenSRPService create on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }

    return {};
  }

  /**
   * read method
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
    params: ParamsType = null,
    method: HTTPMethod = 'GET'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const url = OpenSRPService.getURL(`${this.generalURL}/${id}`, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const response = await customFetch(url, this.getOptions(this.signal, accessToken, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `OpenSRPService read on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /**
   * update method
   * Simply send the updated object as PUT request to the general endpoint URL
   * Successful requests will result in a HTTP status 200/201 response with no body
   *
   * @param {object} data - the data to be POSTed
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  public async update(
    data: PayloadT,
    params: ParamsType = null,
    method: HTTPMethod = 'PUT'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const payload = {
      ...this.getOptions<PayloadT>(this.signal, accessToken, method, data),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
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

  /**
   * list method
   * Send a GET request to the general API endpoint
   *
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} list of objects returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async list(params: ParamsType = null, method: HTTPMethod = 'GET'): Promise<any> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const response = await customFetch(url, this.getOptions(this.signal, accessToken, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `OpenSRPService list on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /**
   * delete method
   * Send a DELETE request to the general endpoint
   * Successful requests will result in a HTTP status 204
   *
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {object} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(
    params: ParamsType = null,
    method: HTTPMethod = 'DELETE'
  ): Promise<Record<string, unknown>> {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const response = await fetch(url, this.getOptions(this.signal, accessToken, method));
    if (response.ok || response.status === 204 || response.status === 200) {
      return {};
    }
    const defaultMessage = `OpenSRPService delete on ${this.endpoint} failed, HTTP status ${response.status}`;
    await throwHTTPError(response, defaultMessage);

    return {};
  }

  public async download(params: ParamsType = null, method: HTTPMethod = 'GET') {
    const url = OpenSRPService.getURL(this.generalURL, params);
    const accessToken = await OpenSRPService.processAcessToken(this.accessTokenOrCallBack);
    const response = await customFetch(url, this.getOptions(this.signal, accessToken, method));

    if (response) {
      if (response.ok) {
        return response;
      }
      const defaultMessage = `OpenSRPService download from ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
    return Promise.reject(response);
  }
}
