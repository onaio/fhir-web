import { Store } from 'redux';
export declare function getApiToken(state: Partial<Store>): string;
/** get Access Token from the Redux store
 * @param {Partial<Store>} state - the redux store
 */
export declare function getAccessToken(state: Partial<Store>): string | null;
/** get the oAuth2 provider state parameter from the Redux store
 * @param {Partial<Store>} state - the redux store
 */
export declare function getOauthProviderState(state: Partial<Store>): string | null;
