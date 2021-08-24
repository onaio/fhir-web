import { IncomingHttpHeaders } from 'http';
import queryString from 'querystring';
import { handleSessionOrTokenExpiry } from '@opensrp-web/react-utils';

import { throwNetworkError, throwHTTPError } from './errors';
/** defaults */
export const KEYCLOAK_API_BASE_URL = 'https://keycloak-test.smartregister.org/auth/realms/';

/** allowed http methods */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * get default HTTP headers for Keycloak service
 *
 * @param {string} accessToken - the access token
 * @param {string} accept - the MIME type to accept
 * @param {string} authorizationType - the authorization type
 * @param {string} contentType - the headers
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

/** converts filter params object to string
 *
 * @param {object} obj - the object representing filter params
 * @returns {string} filter params as a string
 */
export function getFilterParams(obj: URLParams): string {
  return Object.entries(obj)
    .map(([key, val]) => `${key}:${val}`)
    .join(',');
}

/**
 * get payload for fetch
 *
 * @param {object} _ - signal object that allows you to communicate with a DOM request
 * @param {string} accessToken - the access token
 * @param {string} method - the HTTP method
 * @returns {Object} the payload
 */
export function getFetchOptions(
  _: AbortSignal,
  accessToken: string,
  method: HTTPMethod
): { headers: HeadersInit; method: HTTPMethod } {
  return {
    headers: getDefaultHeaders(accessToken) as HeadersInit,
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

/** get acess token call back fn type */
type GetAccessTokenType = () => Promise<string | null>;

/** The Keycloak service class
 *
 * Sample usage:
 * -------------
 * const service = new KeycloakService('the-endpoint');
 *
 * **To list all objects**: service.list()
 *
 * **To get one object**: service.read('the-object-identifier')
 *
 * **To create a new object**: service.create(theObject)
 *
 * **To update an object**: service.update(theObject)
 */
export class KeycloakAPIService {
  public accessTokenOrCallBack: GetAccessTokenType | string;
  public baseURL: string;
  public endpoint: string;
  public generalURL: string;
  public getOptions: typeof getFetchOptions;
  public signal: AbortSignal;

  /**
   * Constructor method
   *
   * @param {function() | string } accessTokenOrCallBack - asyc fn for getting the access token or access token
   * @param {string} baseURL - the base Keycloak API URL
   * @param {string} endpoint - the Keycloak endpoint
   * @param {object} getPayload - a function to get the payload
   * @param {AbortSignal} signal - signal object that allows you to communicate with a DOM request
   */
  constructor(
    accessTokenOrCallBack: GetAccessTokenType | string = handleSessionOrTokenExpiry,
    baseURL: string = KEYCLOAK_API_BASE_URL,
    endpoint: string,
    getPayload: typeof getFetchOptions = getFetchOptions,
    signal: AbortSignal = new AbortController().signal
  ) {
    this.endpoint = endpoint;
    this.getOptions = getPayload;
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
  public static getURL(generalUrl: string, params: paramsType): string {
    if (params) {
      return `${generalUrl}?${queryString.stringify(params)}`;
    }
    return generalUrl;
  }

  /**
   * process received access token
   *
   * @param {function() | string} accessTokenCallBack - received access token
   */
  public static async processAcessToken(accessTokenCallBack: GetAccessTokenType | string) {
    if (typeof accessTokenCallBack === 'function') {
      return (await accessTokenCallBack()) as string;
    }
    return accessTokenCallBack;
  }

  /** create method
   * Send a POST request to the general endpoint containing the new object data
   * Successful requests will result in a HTTP status 201 response with no body
   *
   * @param {Promise} data - the data to be posted
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create<T>(
    data: T,
    params: paramsType = null,
    method: HTTPMethod = 'POST'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const url = KeycloakAPIService.getURL(this.generalURL, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const payload = {
      ...this.getOptions(this.signal, accessToken, method),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: JSON.stringify(data),
    };
    const response = await customFetch(url, payload);
    if (response) {
      if (response.ok || response.status === 201) {
        return response;
      }

      const defaultMessage = `KeycloakAPIService create on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** read method
   * Send a GET request to the url for the specific object
   *
   * @param {string|number} id - the identifier of the object
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async read(
    id: string | number,
    params: paramsType = null,
    method: HTTPMethod = 'GET'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const url = KeycloakAPIService.getURL(`${this.generalURL}/${id}`, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const response = await customFetch(url, this.getOptions(this.signal, accessToken, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `KeycloakAPIService read on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** update method
   * Simply send the updated object as PUT request to the general endpoint URL
   * Successful requests will result in a HTTP status 200/201 response with no body
   *
   * @param {Promise} data - the data to be posted
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update<T>(
    data: T,
    params: paramsType = null,
    method: HTTPMethod = 'PUT'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const url = KeycloakAPIService.getURL(this.generalURL, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const payload = {
      ...this.getOptions(this.signal, accessToken, method),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: JSON.stringify(data),
    };
    const response = await customFetch(url, payload);
    if (response) {
      if (response.ok) {
        return {};
      }
      const defaultMessage = `KeycloakAPIService update on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** list method
   * Send a GET request to the general API endpoint
   *
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} list of objects returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async list(params: paramsType = null, method: HTTPMethod = 'GET'): Promise<any> {
    const url = KeycloakAPIService.getURL(this.generalURL, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const response = await customFetch(url, this.getOptions(this.signal, accessToken, method));

    if (response) {
      if (response.ok) {
        return await response.json();
      }
      const defaultMessage = `KeycloakAPIService list on ${this.endpoint} failed, HTTP status ${response.status}`;
      await throwHTTPError(response, defaultMessage);
    }
  }

  /** delete method
   * Send a DELETE request to the general endpoint
   * Successful requests will result in a HTTP status 204
   *
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async delete(params: paramsType = null, method: HTTPMethod = 'DELETE'): Promise<any> {
    const url = KeycloakAPIService.getURL(this.generalURL, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const response = await fetch(url, this.getOptions(this.signal, accessToken, method));

    if (response.ok || response.status === 204 || response.status === 200) {
      return {};
    }
    const defaultMessage = `KeycloakAPIService delete on ${this.endpoint} failed, HTTP status ${response.status}`;
    await throwHTTPError(response, defaultMessage);
  }
}

export class KeycloakService extends KeycloakAPIService {
  constructor(
    endpoint: string,
    baseURL: string = KEYCLOAK_API_BASE_URL,
    accessTokenOrCallBack: typeof handleSessionOrTokenExpiry = handleSessionOrTokenExpiry,
    getPayload: typeof getFetchOptions = getFetchOptions
  ) {
    super(accessTokenOrCallBack, baseURL, endpoint, getPayload);
  }

  public async readFile(
    id?: string | number,
    params: URLParams | null = null,
    method: HTTPMethod = 'GET'
  ): Promise<Blob> {
    const url = KeycloakService.getURL(`${this.generalURL}/${id}`, params);
    const accessToken = await KeycloakAPIService.processAcessToken(this.accessTokenOrCallBack);
    const response = await fetch(url, this.getOptions(this.signal, accessToken, method));

    if (!response.ok) {
      throw new Error(
        `KeycloakService read on ${this.endpoint} failed, HTTP status ${response.status}`
      );
    }
    return await response.blob();
  }
}
