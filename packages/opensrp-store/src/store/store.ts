// import { connectReducer, getConnectedStore } from '@onaio/connected-reducer-registry';
import { gateKeeperReducer, gateKeeperReducerName } from '@onaio/gatekeeper';
import reducerRegistry, { combine, Registry, getStore } from '@onaio/redux-reducer-registry';
import session, { reducerName as sessionReducer } from '@onaio/session-reducer';
import { Reducer, Store } from 'redux';
// import { RouterState } from 'connected-react-router';
import { Dictionary } from '@onaio/utils';

/** declare globals interface */
declare global {
  interface Window {
    __PRELOADED_STATE__?: Dictionary;
  }
}

/** Declare type for initial state */
interface State {
  [key: string]: any;
}

/** Initial reducers in the reducer registry */
const defaultReducers: Registry = {};

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

/** Add users reducer to registry */
defaultReducers[sessionReducer] = session;
defaultReducers[gateKeeperReducerName] = gateKeeperReducer;

const getCustomStore = (reducers: Registry, initialState: State = {}) => {
  Object.keys(reducers).forEach((reducerName) => {
    reducerRegistry.register(reducerName, reducers[reducerName]);
  });

  return getStore(defaultReducers, initialState);
};

/** The initial store for the reveal web app */
export const store: Store = getCustomStore(defaultReducers, preloadedState);

/** Set listener to add reducers to store when registered */
reducerRegistry.setChangeListener((reducers) => {
  store.replaceReducer(combine(reducers));
});
