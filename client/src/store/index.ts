import { connectReducer, getConnectedStore } from '@onaio/connected-reducer-registry';
import { gateKeeperReducer, gateKeeperReducerName } from '@onaio/gatekeeper';
import reducerRegistry, { combine, Registry } from '@onaio/redux-reducer-registry';
import session, { reducerName as sessionReducer } from '@onaio/session-reducer';
import { Reducer } from 'redux';
import { RouterState } from 'connected-react-router';

/** Initial reducers in the reducer registry */
const defaultReducers: Registry = {
  router: connectReducer as Reducer<RouterState>,
};

/** Add users reducer to registry */
defaultReducers[sessionReducer] = session;
defaultReducers[gateKeeperReducerName] = gateKeeperReducer;

/** The initial store for the reveal web app */
const store = getConnectedStore(defaultReducers);

/** Set listener to add reducers to store when registered */
reducerRegistry.setChangeListener((reducers) => {
  store.replaceReducer(combine(reducers));
});

export default store;
