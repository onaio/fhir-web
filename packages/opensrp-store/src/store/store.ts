import { getConnectedStore } from '@onaio/connected-reducer-registry';
import { gateKeeperReducer, gateKeeperReducerName } from '@onaio/gatekeeper';
import reducerRegistry, { combine, Registry, getStore } from '@onaio/redux-reducer-registry';
import session, { reducerName as sessionReducer } from '@onaio/session-reducer';
import { Reducer } from 'redux';
import { RouterState } from 'connected-react-router';
import { Dictionary } from '@onaio/utils';

/** declare globals interface */
declare global {
  interface Window {
    __PRELOADED_STATE__?: Dictionary;
  }
}

/** Initial reducers in the reducer registry */
// const defaultReducers: Registry = {
//   router: Reducer as Reducer,
// };
const defaultReducers = reducerRegistry.getReducers();

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

/** Add users reducer to registry */
defaultReducers[sessionReducer] = session;
defaultReducers[gateKeeperReducerName] = gateKeeperReducer;

/** The initial store for the reveal web app */
export const store = getStore(defaultReducers, preloadedState);

/** Set listener to add reducers to store when registered */
reducerRegistry.setChangeListener((reducers) => {
  store.replaceReducer(combine(reducers));
});
