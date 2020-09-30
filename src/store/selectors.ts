import { reducerName as sessionReducerName } from '@onaio/session-reducer';
import { Store } from 'redux';
import { Dictionary } from '@onaio/utils/dist/types/types';

/** get API Token from the Redux store
 *
 * @param {Partial<Store>} state - the redux store
 */
interface StoreState {
  session: {
    [key: string]: Dictionary;
  };
}
/**
 * @param {Partial<Store>} state - the redux store
 * @returns {Object} - the states
 */
export function getApiToken(state: Partial<Store>): string {
  const { extraData } = (state as StoreState)[sessionReducerName];
  return extraData.api_token || null;
}

/** get Access Token from the Redux store
 *
 * @param {Partial<Store>} state - the redux store
 * @returns {Object} - the states
 */
export function getAccessToken(state: Partial<Store>): string | null {
  const { extraData } = (state as StoreState)[sessionReducerName];
  if (extraData.oAuth2Data && extraData.oAuth2Data.access_token) {
    return extraData.oAuth2Data.access_token;
  }
  return null;
}

/** get the oAuth2 provider state parameter from the Redux store
 *
 * @param {Partial<Store>} state - the redux store
 * @returns {Object} - the states
 */
export function getOauthProviderState(state: Partial<Store>): string | null {
  const { extraData } = (state as StoreState)[sessionReducerName];
  if (extraData.oAuth2Data && extraData.oAuth2Data.state) {
    return extraData.oAuth2Data.state;
  }
  return null;
}
