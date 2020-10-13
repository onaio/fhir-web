/// <reference types="node" />
import { OpenSRPService as OpenSRPServiceWeb } from '@opensrp/server-service';
import { IncomingHttpHeaders } from 'http';
import { KeycloakAPIService } from './keycloak';
/** allowed http methods */
declare type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/** defaults */
export declare const OPENSRP_API_BASE_URL = "https://opensrp-stage.smartregister.org/opensrp/rest/";
export declare const KEYCLOAK_API_BASE_URL = "https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage";
/** get default HTTP headers for OpenSRP service */
export declare function getDefaultHeaders(accessToken?: string, accept?: string, authorizationType?: string, contentType?: string): IncomingHttpHeaders;
/** Payload options interface */
interface PayloadOptions {
    headers: HeadersInit;
    method: HTTPMethod;
}
/** interface to describe URL params object */
export interface URLParams {
    [key: string]: string | number | boolean;
}
/** converts filter params object to string
 * @param {URLParams} obj - the object representing filter params
 * @returns {string} filter params as a string
 */
export declare function getFilterParams(obj: URLParams): string;
/** get payload for fetch
 * @param {AbortSignal} signal - signal object that allows you to communicate with a DOM request
 * @param {HTTPMethod} method - the HTTP method
 * @returns the payload
 */
export declare function getPayloadOptions(_: AbortSignal, method: HTTPMethod): PayloadOptions;
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
export declare class OpenSRPService extends OpenSRPServiceWeb {
    constructor(baseURL: string | undefined, endpoint: string, getPayload?: typeof getPayloadOptions);
    readFile(id?: string | number, params?: URLParams | null, method?: HTTPMethod): Promise<Blob>;
}
export declare class KeycloakService extends KeycloakAPIService {
    constructor(baseURL: string | undefined, endpoint: string, getPayload?: typeof getPayloadOptions);
    readFile(id?: string | number, params?: URLParams | null, method?: HTTPMethod): Promise<Blob>;
}
export {};
