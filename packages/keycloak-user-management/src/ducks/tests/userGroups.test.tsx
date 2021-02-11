/** Test file for the practitioners ducks module */
import { keyBy } from 'lodash';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  fetchKeycloakUserGroups,
  getKeycloakUserGroupsArray,
  getKeycloakUserGroupsById,
  makeKeycloakUserGroupsSelector,
  reducerName,
  removeKeycloakUserGroups,
  reducer as keycloakReducer,
} from '../userGroups';
import { userGroups } from './fixtures';

reducerRegistry.register(reducerName, keycloakReducer);

const userGroupsSelector = makeKeycloakUserGroupsSelector();

describe('reducers/keycloak/userGroups', () => {
  beforeEach(() => {
    store.dispatch(removeKeycloakUserGroups());
  });

  it('fetchKeycloakUserGroups actions actually adds data to store', () => {
    expect(getKeycloakUserGroupsById(store.getState())).toEqual({});
    expect(getKeycloakUserGroupsArray(store.getState())).toEqual([]);
    expect(userGroupsSelector(store.getState(), {})).toEqual([]);
    store.dispatch(fetchKeycloakUserGroups(userGroups));
    expect(getKeycloakUserGroupsById(store.getState())).toEqual(
      keyBy(userGroups, (userGroup) => userGroup.id)
    );
    expect(getKeycloakUserGroupsArray(store.getState())).toEqual(userGroups);
    expect(userGroupsSelector(store.getState(), { id: [userGroups[1].id] })).toHaveLength(1);
    expect(userGroupsSelector(store.getState(), { id: [] })).toHaveLength(0);
  });

  it('removeKeycloakUserGroups action removes users from store', () => {
    store.dispatch(fetchKeycloakUserGroups(userGroups));
    let numberOfUserGroups = getKeycloakUserGroupsArray(store.getState()).length;
    expect(numberOfUserGroups).toEqual(4);

    store.dispatch(removeKeycloakUserGroups());
    numberOfUserGroups = getKeycloakUserGroupsArray(store.getState()).length;
    expect(numberOfUserGroups).toEqual(0);
  });

  it('gets correct user group by name', () => {
    store.dispatch(fetchKeycloakUserGroups(userGroups));
    let userGroup = userGroupsSelector(store.getState(), { name: 'Admin' });
    expect(userGroup).toEqual([userGroups[0]]);
    userGroup = userGroupsSelector(store.getState(), { name: 'New Group' });
    expect(userGroup).toEqual([userGroups[1]]);
  });

  it('Searches groups by search text', () => {
    store.dispatch(fetchKeycloakUserGroups(userGroups));
    const result1 = userGroupsSelector(store.getState(), { searchText: 'Ad' });
    const result2 = userGroupsSelector(store.getState(), { searchText: 'MiN' });
    expect(result1).toEqual(result2);
    expect(result1[0]).toEqual(userGroups[0]);
  });
});
