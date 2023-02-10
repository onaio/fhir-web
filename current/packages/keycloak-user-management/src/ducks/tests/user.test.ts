/** Test file for the practitioners ducks module */
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  getKeycloakUsersById,
  makeKeycloakUsersSelector,
  KeycloakUser,
  reducerName,
  removeKeycloakUsers,
  reducer as keycloakReducer,
} from '../user';
import { store } from '@opensrp/store';
import { keycloakUsersArray } from './fixtures';

reducerRegistry.register(reducerName, keycloakReducer);

const usersSelector = makeKeycloakUsersSelector();

describe('reducers/keycloak.reducer- integration test', () => {
  beforeEach(() => {
    store.dispatch(removeKeycloakUsers());
  });

  it('fetchedPractitioners actions actually adds data to store', () => {
    expect(getKeycloakUsersById(store.getState())).toEqual({});
    expect(getKeycloakUsersArray(store.getState())).toEqual([]);
    expect(usersSelector(store.getState(), {})).toEqual([]);
    store.dispatch(fetchKeycloakUsers(keycloakUsersArray as KeycloakUser[]));
    expect(getKeycloakUsersById(store.getState())).toEqual({
      '520b579e-70e9-4ae9-b1f8-0775c605b8d2': {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1599565616551,
        disableableCredentialTypes: [],
        email: 'test@onatest.com',
        emailVerified: false,
        enabled: true,
        firstName: 'Ona',
        id: '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
        lastName: 'Admin',
        notBefore: 1600329648,
        requiredActions: [],
        totp: false,
        username: 'ona-admin',
      },
      '80385001-f385-42ec-8edf-8591dc181a54': {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600156374050,
        disableableCredentialTypes: [],
        emailVerified: false,
        enabled: true,
        firstName: 'Ona',
        id: '80385001-f385-42ec-8edf-8591dc181a54',
        lastName: 'kenya',
        notBefore: 0,
        requiredActions: [],
        totp: false,
        username: 'ona',
      },
      '97f36061-52fb-4474-88f2-fd286311ff1d': {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600843525533,
        disableableCredentialTypes: [],
        email: 'dubdabasoduba@gmail.com',
        emailVerified: false,
        enabled: true,
        firstName: 'Benjamin',
        id: '97f36061-52fb-4474-88f2-fd286311ff1d',
        lastName: 'Mwalimu',
        notBefore: 0,
        requiredActions: ['UPDATE_PASSWORD'],
        totp: false,
        username: 'mwalimu',
      },
      'cab07278-c77b-4bc7-b154-bcbf01b7d35b': {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600156317992,
        disableableCredentialTypes: [],
        emailVerified: false,
        enabled: true,
        firstName: 'Demo',
        id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        lastName: 'kenya',
        notBefore: 0,
        requiredActions: [],
        totp: false,
        username: 'opensrp',
      },
    });
    expect(getKeycloakUsersArray(store.getState())).toEqual([
      {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600843525533,
        disableableCredentialTypes: [],
        email: 'dubdabasoduba@gmail.com',
        emailVerified: false,
        enabled: true,
        firstName: 'Benjamin',
        id: '97f36061-52fb-4474-88f2-fd286311ff1d',
        lastName: 'Mwalimu',
        notBefore: 0,
        requiredActions: ['UPDATE_PASSWORD'],
        totp: false,
        username: 'mwalimu',
      },
      {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600156374050,
        disableableCredentialTypes: [],
        emailVerified: false,
        enabled: true,
        firstName: 'Ona',
        id: '80385001-f385-42ec-8edf-8591dc181a54',
        lastName: 'kenya',
        notBefore: 0,
        requiredActions: [],
        totp: false,
        username: 'ona',
      },
      {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1599565616551,
        disableableCredentialTypes: [],
        email: 'test@onatest.com',
        emailVerified: false,
        enabled: true,
        firstName: 'Ona',
        id: '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
        lastName: 'Admin',
        notBefore: 1600329648,
        requiredActions: [],
        totp: false,
        username: 'ona-admin',
      },
      {
        access: {
          impersonate: false,
          manage: true,
          manageGroupMembership: true,
          mapRoles: true,
          view: true,
        },
        createdTimestamp: 1600156317992,
        disableableCredentialTypes: [],
        emailVerified: false,
        enabled: true,
        firstName: 'Demo',
        id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        lastName: 'kenya',
        notBefore: 0,
        requiredActions: [],
        totp: false,
        username: 'opensrp',
      },
    ]);
    expect(usersSelector(store.getState(), { id: [keycloakUsersArray[1].id] })).toHaveLength(1);
    expect(usersSelector(store.getState(), { id: [] })).toHaveLength(0);
  });

  it('removeKeycloakUsers action removes users from store', () => {
    store.dispatch(fetchKeycloakUsers(keycloakUsersArray as KeycloakUser[]));
    let numberOfUsers = getKeycloakUsersArray(store.getState()).length;
    expect(numberOfUsers).toEqual(4);

    store.dispatch(removeKeycloakUsers());
    numberOfUsers = getKeycloakUsersArray(store.getState()).length;
    expect(numberOfUsers).toEqual(0);
  });

  it('Searches users by search text', () => {
    store.dispatch(fetchKeycloakUsers(keycloakUsersArray as KeycloakUser[]));
    const result1 = usersSelector(store.getState(), { searchText: 'jam' });
    const result2 = usersSelector(store.getState(), { searchText: 'lIMu' });
    expect(result1).toEqual(result2);
    expect(result1[0]).toEqual(keycloakUsersArray[0]);
  });
});
