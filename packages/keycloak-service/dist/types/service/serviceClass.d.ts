/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
/** defaults */
export declare const KEYCLOAK_API_BASE_URL = 'https://keycloak-test.smartregister.org/auth/realms/';
/** allowed http methods */
declare type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/**
 * get default HTTP headers for Keycloak service
 *
 * @param {string} accessToken - the access token
 * @param {string} accept - the MIME type to accept
 * @param {string} authorizationType - the authorization type
 * @param {string} contentType - the headers
 * @returns {IncomingHttpHeaders} - the headers
 */
export declare function getDefaultHeaders(
  accessToken: string,
  accept?: string,
  authorizationType?: string,
  contentType?: string
): IncomingHttpHeaders;
/** converts filter params object to string
 *
 * @param {object} obj - the object representing filter params
 * @returns {string} filter params as a string
 */
export declare function getFilterParams(obj: URLParams): string;
/**
 * get payload for fetch
 *
 * @param {object} _ - signal object that allows you to communicate with a DOM request
 * @param {string} accessToken - the access token
 * @param {string} method - the HTTP method
 * @returns {Object} the payload
 */
export declare function getFetchOptions(
  _: AbortSignal,
  accessToken: string,
  method: HTTPMethod
): {
  headers: HeadersInit;
  method: HTTPMethod;
};
/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean;
}
export interface CustomFetch {
  (input: RequestInfo, init?: RequestInit | undefined): Promise<Response | undefined>;
}
export declare const customFetch: CustomFetch;
/** params option type */
declare type paramsType = URLParams | null;
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
export declare class KeycloakAPIService {
  accessToken: string;
  baseURL: string;
  endpoint: string;
  generalURL: string;
  getOptions: typeof getFetchOptions;
  signal: AbortSignal;
  /**
   * Constructor method
   *
   * @param {string} accessToken - the access token
   * @param {string} baseURL - the base Keycloak API URL
   * @param {string} endpoint - the Keycloak endpoint
   * @param {object} getPayload - a function to get the payload
   * @param {AbortSignal} signal - signal object that allows you to communicate with a DOM request
   */
  constructor(
    accessToken: string,
    baseURL: string | undefined,
    endpoint: string,
    getPayload?: typeof getFetchOptions,
    signal?: AbortSignal
  );
  /**
   * appends any query params to the url as a querystring
   *
   * @param {string} generalUrl - the url
   * @param {object} params - the url params object
   * @returns {string} the final url
   */
  static getURL(generalUrl: string, params: paramsType): string;
  /** create method
   * Send a POST request to the general endpoint containing the new object data
   * Successful requests will result in a HTTP status 201 response with no body
   *
   * @param {Promise} data - the data to be posted
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  create<T>(data: T, params?: paramsType, method?: HTTPMethod): Promise<any>;
  /** read method
   * Send a GET request to the url for the specific object
   *
   * @param {string|number} id - the identifier of the object
   * @param {params} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  read(id: string | number, params?: paramsType, method?: HTTPMethod): Promise<any>;
  /** update method
   * Simply send the updated object as PUT request to the general endpoint URL
   * Successful requests will result in a HTTP status 200/201 response with no body
   *
   * @param {Promise} data - the data to be posted
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  update<T>(data: T, params?: paramsType, method?: HTTPMethod): Promise<any>;
  /** list method
   * Send a GET request to the general API endpoint
   *
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} list of objects returned by API
   */
  list(params?: paramsType, method?: HTTPMethod): Promise<any>;
  /** delete method
   * Send a DELETE request to the general endpoint
   * Successful requests will result in a HTTP status 204
   *
   * @param {object} params - the url params object
   * @param {string} method - the HTTP method
   * @returns {Promise<any>} the object returned by API
   */
  delete(params?: paramsType, method?: HTTPMethod): Promise<any>;
}
export declare class KeycloakService extends KeycloakAPIService {
  constructor(
    accessToken: string,
    endpoint: string,
    baseURL?: string,
    getPayload?: typeof getFetchOptions
  );
  readFile(id?: string | number, params?: URLParams | null, method?: HTTPMethod): Promise<Blob>;
}
export {};
