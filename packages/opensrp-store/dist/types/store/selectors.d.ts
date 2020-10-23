import { Store } from 'redux';
/**
 * @param {any} state - the redux store
 * @returns {Object} - the states
 */
export declare function getApiToken(state: Partial<Store>): string;
/** get Access Token from the Redux store
 *
 * @param {any} state - the redux store
 * @returns {Object} - the states
 */
export declare function getAccessToken(state: Partial<Store>): string | null;
/** get the oAuth2 provider state parameter from the Redux store
 *
 * @param {any} state - the redux store
 * @returns {Object} - the states
 */
export declare function getOauthProviderState(state: Partial<Store>): string | null;
