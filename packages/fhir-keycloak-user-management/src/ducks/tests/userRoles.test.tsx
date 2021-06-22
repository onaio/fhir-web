/** Test file for the practitioners ducks module */
import { keyBy } from 'lodash';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  fetchKeycloakUserRoles,
  getKeycloakUserRolesArray,
  getKeycloakUserRolesById,
  makeKeycloakUserRolesSelector,
  reducerName,
  removeKeycloakUserRoles,
  reducer as keycloakReducer,
} from '../userRoles';
import { userRoles } from './fixtures';

reducerRegistry.register(reducerName, keycloakReducer);

const userRolesSelector = makeKeycloakUserRolesSelector();

describe('reducers/keycloak/userRoles', () => {
  beforeEach(() => {
    store.dispatch(removeKeycloakUserRoles());
  });

  it('fetchKeycloakUserRoles actions actually adds data to store', () => {
    expect(getKeycloakUserRolesById(store.getState())).toEqual({});
    expect(getKeycloakUserRolesArray(store.getState())).toEqual([]);
    expect(userRolesSelector(store.getState(), {})).toEqual([]);
    store.dispatch(fetchKeycloakUserRoles(userRoles));
    expect(getKeycloakUserRolesById(store.getState())).toEqual(
      keyBy(userRoles, (userRole) => userRole.id)
    );
    expect(getKeycloakUserRolesArray(store.getState())).toEqual(userRoles);
    expect(userRolesSelector(store.getState(), { id: [userRoles[1].id] })).toHaveLength(1);
    expect(userRolesSelector(store.getState(), { id: [] })).toHaveLength(0);
  });

  it('removeKeycloakUserRoles action removes users from store', () => {
    store.dispatch(fetchKeycloakUserRoles(userRoles));
    let numberOfUserRoles = getKeycloakUserRolesArray(store.getState()).length;
    expect(numberOfUserRoles).toEqual(8);

    store.dispatch(removeKeycloakUserRoles());
    numberOfUserRoles = getKeycloakUserRolesArray(store.getState()).length;
    expect(numberOfUserRoles).toEqual(0);
  });

  it('gets correct user role by name', () => {
    store.dispatch(fetchKeycloakUserRoles(userRoles));
    let userRole = userRolesSelector(store.getState(), { name: 'ev' });
    expect(userRole).toEqual([userRoles[0]]);
    userRole = userRolesSelector(store.getState(), { name: 'plans' });
    expect(userRole).toEqual([userRoles[4]]);
  });

  it('Searches roles by search text', () => {
    store.dispatch(fetchKeycloakUserRoles(userRoles));
    const result1 = userRolesSelector(store.getState(), { searchText: 'edit' });
    const result2 = userRolesSelector(store.getState(), { searchText: 'EdI' });
    expect(result1).toEqual(result2);
    expect(result1[0]).toEqual(userRoles[1]);
  });
});
