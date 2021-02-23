/** users ducks modules: actions, actionCreators, reducer and selectors */
import { Dictionary } from '@onaio/utils';
import { keyBy, values } from 'lodash';
import intersect from 'fast_array_intersect';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'keycloakUserGroups';

/** Interface for user group json object */
export interface KeycloakUserGroup {
  access?: {
    view: boolean;
    manage: boolean;
    manageMembership: boolean;
  };
  attributes?: Dictionary;
  clientRoles?: Dictionary;
  id: string;
  name: string;
  path: string;
  realmRoles?: string[];
  subGroups: string[];
}

// actions

/** action type for fetching keycloak user groups */
export const USER_GROUPS_FETCHED = 'keycloak/reducer/userGroups/USER_GROUPS_FETCHED';
/** action type for removing keycloak user groups */
export const REMOVE_USER_GROUPS = 'keycloak/reducer/userGroups/REMOVE_USER_GROUPS';

/** interface action to add user groups to store */
export interface FetchKeycloakUserGroupsAction extends AnyAction {
  userGroupsById: Dictionary<KeycloakUserGroup>;
  type: typeof USER_GROUPS_FETCHED;
}

/** Interface for removeusersAction */
export interface RemoveKeycloakUserGroupsAction extends AnyAction {
  userGroupsById: Dictionary<KeycloakUserGroup>;
  type: typeof REMOVE_USER_GROUPS;
}

/** Create type for user groups reducer actions */
export type KeycloakUserGroupsActionTypes =
  | FetchKeycloakUserGroupsAction
  | RemoveKeycloakUserGroupsAction
  | AnyAction;

// action Creators

/**
 * Fetch user groups action creator
 *
 * @param {Array} userGroupsList - keycloak user groups
 * @returns {object} - returns an object of user groups
 */
export const fetchKeycloakUserGroups = (
  userGroupsList: KeycloakUserGroup[] = []
): FetchKeycloakUserGroupsAction => {
  return {
    userGroupsById: keyBy(userGroupsList, (userGroup: KeycloakUserGroup) => userGroup.id),
    type: USER_GROUPS_FETCHED,
  };
};

/** Remove users action creator
 *
 * @returns {object} - the dispatcher to remove the user groups
 */
export const removeKeycloakUserGroups = (): RemoveKeycloakUserGroupsAction => {
  return {
    userGroupsById: {},
    type: REMOVE_USER_GROUPS,
  };
};

// The reducer

/** interface for keycloak user groups state in redux store */
export interface KeycloakUserGroupsState {
  userGroupsById: Dictionary<KeycloakUserGroup> | Dictionary;
}

/** Create an immutable keycloak users state */
export type ImmutableKeycloakUserGroupsState = KeycloakUserGroupsState &
  SeamlessImmutable.ImmutableObject<KeycloakUserGroupsState>;

/** initial keycloak users state */
export const initialState: ImmutableKeycloakUserGroupsState = SeamlessImmutable({
  userGroupsById: {},
});

/**
 * the users reducer function
 *
 * @param {object} state - keycloak users states
 * @param {object} action - keycloak users actions
 * @returns {object} - the updated states
 */
export function reducer(
  state: ImmutableKeycloakUserGroupsState = initialState,
  action: KeycloakUserGroupsActionTypes
): ImmutableKeycloakUserGroupsState {
  switch (action.type) {
    case USER_GROUPS_FETCHED:
      return SeamlessImmutable({
        ...state,
        userGroupsById: { ...state.userGroupsById, ...action.userGroupsById },
      });
    case REMOVE_USER_GROUPS:
      return SeamlessImmutable({
        ...state,
        userGroupsById: action.userGroupsById,
      });

    default:
      return state;
  }
}

// Selectors

export interface Filters {
  id?: string[] /** get all groups whose ids appear in this array */;
  name?: string /** get user groups whose name includes text in the name field */;
  searchText?: string /** filter user group with given text */;
}

/**
 * Gets id from KeycloakUsersFilters
 *
 * @param _ - the redux store
 * @param props - the keycloak user groups filters object
 */
export const getUserGroupsIds = (_: Partial<Store>, props: Filters) => props.id;

/**
 * Gets name from KeycloakUsersFilters
 *
 * @param _ - the redux store
 * @param props - the user groups filters object
 */
export const getGroupName = (_: Partial<Store>, props: Filters) => props.name;

/**
 * Gets searchText from filter props
 *
 * @param _ - the redux store
 * @param props - the user groups filters object
 */
export const getSearchText = (_: Partial<Store>, props: Filters) => props.searchText;

/** returns all user groups in the store as values whose keys are their respective ids
 *
 * @param {any} state - the redux store
 * @returns {object} - users object as values, respective ids as keys
 */
export function getKeycloakUserGroupsById(
  state: Partial<Store>
): { [key: string]: KeycloakUserGroup } {
  return (state as Dictionary)[reducerName].userGroupsById;
}

/** gets keycloak users as an array of user objects
 *
 * @param {any} state - the redux store
 * @returns {Array} - an array of users objs
 */
export function getKeycloakUserGroupsArray(state: Partial<Store>): KeycloakUserGroup[] {
  return values(getKeycloakUserGroupsById(state));
}

export const getUserGroupByName = () =>
  /**
   * Gets all groups whose name includes phrase given in name filter prop
   *
   * @returns {Array} - groups whose name includes phrase given in name filter prop
   */
  createSelector(getKeycloakUserGroupsArray, getGroupName, (userGroupsArray, name) => {
    if (name === undefined) {
      return userGroupsArray;
    }
    return userGroupsArray.filter((userGroup: KeycloakUserGroup) =>
      userGroup.name.toLowerCase().includes(name.toLowerCase())
    );
  });

export const getKeycloakUserGroupsByIds = () =>
  /**
   * Gets all user groups whose identifiers appear in ids filter prop value
   *
   * @returns {Array} - users whose identifiers appear in ids filter prop value
   */
  createSelector(
    getKeycloakUserGroupsById,
    getUserGroupsIds,
    getKeycloakUserGroupsArray,
    (userGroupsById, ids, userGroupsArray) => {
      if (ids === undefined) {
        return userGroupsArray;
      }
      if (ids.length > 0) {
        return ids.map((id: string) => userGroupsById[id]);
      }
      return [];
    }
  );

const userGroupsByIdsSelector = getKeycloakUserGroupsByIds();
const userGroupsByNameSelector = getUserGroupByName();

export const makeKeycloakUserGroupsSelector = () =>
  /** practitioner array selector factory
   * aggregates response from all applied filters and returns results
   *
   * @returns {Array} - aggregates response from all applied filters and returns results
   */
  createSelector(
    userGroupsByIdsSelector,
    userGroupsByNameSelector,
    getSearchText,
    (arr1, arr2, searchText) => {
      const unfilteredResults = intersect([arr1, arr2], JSON.stringify);
      const matchesUserName = (userGroup: KeycloakUserGroup) => {
        if (searchText === undefined) {
          return true;
        }
        return userGroup.name.toLowerCase().includes(searchText.toLowerCase());
      };
      return unfilteredResults.filter((group) => matchesUserName(group));
    }
  );
