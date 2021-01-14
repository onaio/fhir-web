import { Dictionary } from '@onaio/utils';
import { useReducer } from 'react';

// action types
export const START_LOAD = 'START_LOAD';
export const END_LOAD = 'END_LOAD';

// unified description of actions
export interface ActionType {
  type: typeof START_LOAD | typeof END_LOAD;
  key: string;
}

/** describes the state of the reducer */
export type State = Dictionary<boolean>;

/** reducer function for useLoadingReducer hook
 *
 * @param state local reducer's state
 * @param action - action to start or stop loading
 */
export const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case START_LOAD:
      return {
        ...state,
        [action.key]: true,
      };
    case END_LOAD:
      return {
        ...state,
        [action.key]: false,
      };
    default:
      return state;
  }
};

/** a useLoadingReducer hook, help manage the loading state of the component
 * across several promises.
 *
 * One alternative to this hook and one that might be more appropriate is to
 * use the promise.all syntax
 *
 * @example
 * const promise1 = Promise.resolve(3);
 * const promise2 = 42;
 * const promise3 = new Promise((resolve, reject) => {
 *   setTimeout(resolve, 100, 'foo');
 * });
 *
 * Promise.all([promise1, promise2, promise3]).then((values) => {
 *   console.log(values);
 * }).catch().finally(() => {
 *    // set loading to false
 *   });
 *
 * however there are a few cases where the above might not work and hence a useCase for this hook
 * , for e.g. when promises are spread across hooks, or where they are nested.
 *
 * @param initialLoadingState - whether to start in loading state or not
 */
export const useLoadingReducer = (initialLoadingState = true) => {
  const initialLoadingStateKey = 'initialState';
  const initialState: State = { [initialLoadingStateKey]: initialLoadingState };

  const [store, dispatch] = useReducer(reducer, initialState);

  const changeLoading = (key: string, loadStatus: boolean) => {
    const type = loadStatus ? START_LOAD : END_LOAD;
    dispatch({
      key,
      type,
    });
    return key;
  };

  /** sets loading to true for loading sequence with the  passed in key
   *
   * @param key - target this load entry
   * @param condition - by default start loading will start the loading sequence to true, this overrides that
   *
   * @returns the key
   */
  const startLoading = (key: string, condition = true) => {
    return changeLoading(key, condition);
  };

  /** closes a loading entry
   *
   * @param key - loading entry to target
   */
  const stopLoading = (key: string) => {
    return changeLoading(key, false);
  };

  /** if there is no other state other than initialState, return the value
   * of initial state as loading. otherwise disregard initial state if there are other
   * entries.
   */

  /** returns the combined state of loading entries, basically does a logical `or` on each of the
   * loading entries
   */
  const loading = () => {
    // remove initialState if there is more than one entry
    const numOfEntries = Object.entries(store).length;
    let storeSliceOfInterest = store;
    if (numOfEntries > 1) {
      const nonDefaultStore: State = {};
      Object.entries(store).forEach(([key, value]) => {
        if (key !== initialLoadingStateKey) {
          nonDefaultStore[key] = value;
        }
      });
      storeSliceOfInterest = nonDefaultStore;
    }
    const reducingFn = (accumulator: boolean, currentValue: boolean) => accumulator || currentValue;
    return Object.values(storeSliceOfInterest).reduce(reducingFn, false);
  };

  return { startLoading, stopLoading, loading };
};

/** types for useLoadingReducer exposed api */
export type StartLoading = (key: string, condition?: boolean) => void;
export type StopLoading = (key: string) => void;
export type Loading = () => boolean;
