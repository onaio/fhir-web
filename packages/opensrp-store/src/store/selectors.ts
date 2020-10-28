import { reducerName as sessionReducerName } from '@onaio/session-reducer';
import { Store } from 'redux';
import { Dictionary } from '@onaio/utils';
import { createSelector } from 'reselect';

/** get API Token from the Redux store
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

/** Fetch access token from store if access_token filter val is true
 *
 * @param _ - redux store
 * @param props - api filters object
 * @returns {boolean}
 */

export const fetchAccessToken = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.accessToken || null;

/** Fetch api token from store if api_token filter val is true
 *
 * @param _ redux store
 * @param props api filters object
 * @returns {boolean}
 */

export const fetchApiToken = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.apiToken || null;

/** Fetch oauth provider state from store if providerState filter val is true
 *
 * @param _ redux store
 * @param props api filters object
 * @returns {boolean}
 */

export const fetchOauthProviderState = (_: Partial<Store>, props: APIFilters): boolean | null =>
  props.providerState || null;

/** Gets extra data object from store
 *
 * @param state - redux store
 */

export const getExtraData = (state: Partial<Store>): Dictionary =>
  (state as StoreState)[sessionReducerName].extraData;

/**
 * @param {any} state - the redux store
 * @returns {Object} - the states
 */

export const makeAPIStateSelector = () =>
  createSelector(
    [fetchAccessToken, fetchApiToken, fetchOauthProviderState, getExtraData],
    (accessToken, apiToken, oauthState, extraData) => {
      if (accessToken) {
        return (extraData.oAuth2Data && extraData.oAuth2Data.access_token) || null;
      } else if (apiToken) {
        return extraData.api_token || null;
      } else if (oauthState) {
        return (extraData.oAuth2Data && extraData.oAuth2Data.state) || null;
      }
    }
  );
