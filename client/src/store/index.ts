// going to use this store initializer instead of the one in
// @opensrp/store package, for some reason its not working
// wehn passed to the redux provider
import { connectReducer, getConnectedStore } from '@onaio/connected-reducer-registry';
import { gateKeeperReducer, gateKeeperReducerName } from '@onaio/gatekeeper';
import reducerRegistry, { combine, Registry } from '@onaio/redux-reducer-registry';
import session, { reducerName as sessionReducer } from '@onaio/session-reducer';
import {
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
} from '@opensrp/store';
import { Reducer } from 'redux';
import { RouterState } from 'connected-react-router';

/** Initial reducers in the reducer registry */
const defaultReducers: Registry = {
  router: connectReducer as Reducer<RouterState>,
};

/** Add users reducer to registry */
defaultReducers[sessionReducer] = session;
defaultReducers[gateKeeperReducerName] = gateKeeperReducer;
// added this segment because registering from the user management
// package component is failing
defaultReducers[keycloakUsersReducerName] = keycloakUsersReducer;

/** The initial store for the reveal web app */
const store = getConnectedStore(defaultReducers);

/** Set listener to add reducers to store when registered */
reducerRegistry.setChangeListener((reducers) => {
  store.replaceReducer(combine(reducers));
});

export default store;
