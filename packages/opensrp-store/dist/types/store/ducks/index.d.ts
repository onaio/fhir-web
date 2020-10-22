/** users ducks modules: actions, actionCreators, reducer and selectors */
import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import { OutputParametricSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';
/** The reducer name */
export declare const reducerName = 'keycloakUsers';
/** Interface for user json object */
export interface KeycloakUser {
  access?: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  createdTimestamp?: number;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore?: number;
  requiredActions?: string[];
  totp?: boolean;
  username: string;
}
/** action type for fetching keycloak users */
export declare const KEYCLOAK_USERS_FETCHED = 'keycloak/reducer/users/userS_FETCHED';
/** action type for removing keycloak users */
export declare const REMOVE_KEYCLOAK_USERS = 'keycloak/reducer/users/REMOVE_KEYCLOAK_USERS';
/** interface action to add users to store */
export interface FetchKeycloakUsersAction extends AnyAction {
  usersById: Dictionary<KeycloakUser>;
  type: typeof KEYCLOAK_USERS_FETCHED;
}
/** Interface for removeusersAction */
export interface RemoveKeycloakUsersAction extends AnyAction {
  usersById: Dictionary<KeycloakUser>;
  type: typeof REMOVE_KEYCLOAK_USERS;
}
/** Create type for users reducer actions */
export declare type KeycloakUsersActionTypes =
  | FetchKeycloakUsersAction
  | RemoveKeycloakUsersAction
  | AnyAction;
/**
 * Fetch users action creator
 *
 * @param {Array} usersList - keycloak users
 * @returns {object} - the dispatcher to remove the user
 */
export declare const fetchKeycloakUsers: (usersList?: KeycloakUser[]) => FetchKeycloakUsersAction;
/** Remove users action creator
 *
 * @returns {object} - the dispatcher to remove the user
 */
export declare const removeKeycloakUsers: () => RemoveKeycloakUsersAction;
/** interface for keycloak users state in redux store */
export interface KeycloakUsersState {
  usersById: Dictionary<KeycloakUser> | Dictionary;
}
/** Create an immutable keycloak users state */
export declare type ImmutableKeycloakUsersState = KeycloakUsersState &
  SeamlessImmutable.ImmutableObject<KeycloakUsersState>;
/** initial keycloak users state */
export declare const initialState: ImmutableKeycloakUsersState;
/**
 * the users reducer function
 *
 * @param {object} state - keycloak users states
 * @param {object} action - keycloak users actions
 * @returns {object} - the updated states
 */
export declare function reducer(
  state: ImmutableKeycloakUsersState | undefined,
  action: KeycloakUsersActionTypes
): ImmutableKeycloakUsersState;
export interface KeycloakUsersFilters {
  id: string[] /** get all users whose ids appear in this array */;
  username?: string /** get users whose username includes text in the username field */;
}
/**
 * Gets id from KeycloakUsersFilters
 *
 * @param {any} _ - the redux store
 * @param {Array} props - the keycloak users filters object
 * @returns {string} - the keycloak user id
 */
export declare const getUserIds: (
  _: Partial<Store<any, AnyAction>>,
  props: KeycloakUsersFilters
) => string[];
/**
 * Gets name from KeycloakUsersFilters
 *
 * @param {any} _ - the redux store
 * @param {object} props - the users filters object
 * @returns {string} - the keycloak user name
 */
export declare const getUsername: (
  _: Partial<Store<any, AnyAction>>,
  props: KeycloakUsersFilters
) => string | undefined;
/** returns all users in the store as values whose keys are their respective ids
 *
 * @param {any} state - the redux store
 * @returns {object} - users object as values, respective ids as keys
 */
export declare function getKeycloakUsersById(
  state: Partial<Store>
): {
  [key: string]: KeycloakUser;
};
/** gets keycloak users as an array of user objects
 *
 * @param {any} state - the redux store
 * @returns {Array} - an array of users objs
 */
export declare function getKeycloakUsersArray(state: Partial<Store>): KeycloakUser[];
/**
 * Gets all practitioners whose name includes phrase given in name filter prop
 *
 * @returns {Array} - practitioners whose name includes phrase given in name filter prop
 */
export declare const getUsersByUsername: () => OutputParametricSelector<
  Partial<Store<any, AnyAction>>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (res1: KeycloakUser[], res2: string | undefined) => KeycloakUser[]
>;
/**
 * Gets all users whose identifiers appear in ids filter prop value
 *
 * @returns {Array} - users whose identifiers appear in ids filter prop value
 */
export declare const getKeycloakUsersByIds: () => OutputParametricSelector<
  Partial<Store<any, AnyAction>>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (
    res1: {
      [key: string]: KeycloakUser;
    },
    res2: string[],
    res3: KeycloakUser[]
  ) => KeycloakUser[]
>;
/** practitioner array selector factory
 * aggregates response from all applied filters and returns results
 *
 * @returns {Array} - aggregates response from all applied filters and returns results
 */
export declare const makeKeycloakUsersSelector: () => OutputParametricSelector<
  Partial<Store<any, AnyAction>>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (res1: KeycloakUser[], res2: KeycloakUser[]) => KeycloakUser[]
>;
