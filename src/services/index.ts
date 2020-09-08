import { OpenSRPService as OpenSRPServiceWeb } from '@opensrp/server-service';
import { IncomingHttpHeaders } from 'http';
import { OPENSRP_API_BASE_URL } from '../configs/env';
import store from '../store';
import { getAccessToken } from '../store/selectors';

/** allowed http methods */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** get default HTTP headers for OpenSRP service */
export function getDefaultHeaders(
  accept = 'application/json',
  authorizationType = 'Bearer',
  contentType = 'application/json;charset=UTF-8'
): IncomingHttpHeaders {
  return {
    accept,
    authorization: `${authorizationType} ${getAccessToken(store.getState())}`,
    'content-type': contentType,
  };
}

/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean;
}

/** converts filter params object to string
 * @param {URLParams} obj - the object representing filter params
 * @returns {string} filter params as a string
 */
export function getFilterParams(obj: URLParams): string {
  return Object.entries(obj)
    .map(([key, val]) => `${key}:${val}`)
    .join(',');
}

/** get payload for fetch
 * @param {AbortSignal} signal - signal object that allows you to communicate with a DOM request
 * @param {HTTPMethod} method - the HTTP method
 * @returns the payload
 */

export function getPayloadOptions(_: AbortSignal, method: HTTPMethod): any {
  return {
    headers: getDefaultHeaders() as HeadersInit,
    method,
  };
}

/** The OpenSRP service class
 * Extends class OpenSRPService from OpenSRPService web
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
export class OpenSRPService extends OpenSRPServiceWeb {
  constructor(
    endpoint: string,
    baseURL: string = OPENSRP_API_BASE_URL,
    getPayload: typeof getPayloadOptions = getPayloadOptions
  ) {
    super(baseURL, endpoint, getPayload);
  }

  public async readFile(
    id?: string | number,
    params: URLParams | null = null,
    method: HTTPMethod = 'GET'
  ): Promise<any> {
    const url = OpenSRPService.getURL(`${this.generalURL}/${id}`, params);
    const response = await fetch(url, this.getOptions(this.signal, method));

    if (!response.ok) {
      throw new Error(
        `OpenSRPService read on ${this.endpoint} failed, HTTP status ${response.status}`
      );
    }
    return await response.blob();
  }
}
