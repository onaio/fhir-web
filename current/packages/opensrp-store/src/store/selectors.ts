import { reducerName as sessionReducerName } from '@onaio/session-reducer';
import { Store } from 'redux';
import { Dictionary } from '@onaio/utils';
import { createSelector } from 'reselect';

/**
 * get API Token from the Redux store
 *
 * @param {any} state - the redux store
 */
interface StoreState {
  session: {
    [key: string]: Dictionary;
  };
}

interface APIFilters {
  accessToken?: boolean;
  apiToken?: boolean;
  providerState?: boolean;
}

/**
 * Fetch access token from store if access_token filter val is true
 *
 * @param {object} _ - redux store
 * @param {object} props - api filters object
 * @returns {boolean} returns boolean value
 */
export const fetchAccessToken = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.accessToken ? props.accessToken : null;

/**
 * Fetch api token from store if api_token filter val is true
 *
 * @param {object} _ redux store
 * @param {object} props api filters object
 * @returns {boolean} returns boolean value
 */
export const fetchApiToken = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.apiToken ? props.apiToken : null;

/**
 * Fetch oauth provider state from store if providerState filter val is true
 *
 * @param {Object} _ redux store
 * @param {Object} props api filters object
 * @returns {boolean} returns boolean value
 */
export const fetchOauthProviderState = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.providerState ? props.providerState : null;

/**
 * Gets extra data object from store
 *
 * @param {object} state - redux store
 * @returns {Object}
 */

export const getExtraData = (state: Partial<Store>): Dictionary =>
  (state as StoreState)[sessionReducerName].extraData;

/**
 * API state selector
 *
 * @returns {Object} - the states
 */
export const makeAPIStateSelector = () =>
  createSelector(
    [fetchAccessToken, fetchApiToken, fetchOauthProviderState, getExtraData],
    (accessToken, apiToken, oauthState, extraData) => {
      if (accessToken) {
        return extraData.oAuth2Data && extraData.oAuth2Data.access_token
          ? extraData.oAuth2Data.access_token
          : null;
      } else if (apiToken) {
        return extraData.api_token ? extraData.api_token : null;
      } else if (oauthState) {
        return extraData.oAuth2Data && extraData.oAuth2Data.state
          ? extraData.oAuth2Data.state
          : null;
      }
    }
  );
