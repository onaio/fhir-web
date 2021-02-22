/** users ducks modules: actions, actionCreators, reducer and selectors */
import { Dictionary } from '@onaio/utils';
import { keyBy, values } from 'lodash';
import intersect from 'fast_array_intersect';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'keycloakUserRoles';

/** Interface for user role json object */
export interface KeycloakUserRole {
  clientRole: boolean;
  composite: boolean;
  containerId: string;
  description: string;
  id: string;
  name: string;
}

// actions

/** action type for fetching keycloak user roles */
export const USER_ROLES_FETCHED = 'keycloak/reducer/userRoles/USER_ROLES_FETCHED';
/** action type for removing keycloak user roles */
export const REMOVE_USER_ROLES = 'keycloak/reducer/userRoles/REMOVE_USER_ROLES';

/** interface action to add user roles to store */
export interface FetchKeycloakUserRolesAction extends AnyAction {
  userRolesById: Dictionary<KeycloakUserRole>;
  type: typeof USER_ROLES_FETCHED;
}

/** Interface for remove user roles Action */
export interface RemoveKeycloakUserRolessAction extends AnyAction {
  userRolesById: Dictionary<KeycloakUserRole>;
  type: typeof REMOVE_USER_ROLES;
}

/** Create type for user roles reducer actions */
export type KeycloakUserRolesActionTypes =
  | FetchKeycloakUserRolesAction
  | RemoveKeycloakUserRolessAction
  | AnyAction;

// action Creators

/**
 * Fetch user roles action creator
 *
 * @param {Array} userRolesList - keycloak user roles
 * @returns {object} - returns an object of user roles
 */
export const fetchKeycloakUserRoles = (
  userRolesList: KeycloakUserRole[] = []
): FetchKeycloakUserRolesAction => {
  return {
    userRolesById: keyBy(userRolesList, (userRole: KeycloakUserRole) => userRole.id),
    type: USER_ROLES_FETCHED,
  };
};

/** Remove user roles action creator
 *
 * @returns {object} - the dispatcher to remove the user roles
 */
export const removeKeycloakUserRoles = (): RemoveKeycloakUserRolessAction => {
  return {
    userRolesById: {},
    type: REMOVE_USER_ROLES,
  };
};

// The reducer

/** interface for keycloak user roles state in redux store */
export interface KeycloakUserRolesState {
  userRolesById: Dictionary<KeycloakUserRole> | Dictionary;
}

/** Create an immutable keycloak user roles state */
export type ImmutableKeycloakUserRolesState = KeycloakUserRolesState &
  SeamlessImmutable.ImmutableObject<KeycloakUserRolesState>;

/** initial keycloak user roles state */
export const initialState: ImmutableKeycloakUserRolesState = SeamlessImmutable({
  userRolesById: {},
});

/**
 * the user roles reducer function
 *
 * @param {object} state - keycloak user roles states
 * @param {object} action - keycloak user roles actions
 * @returns {object} - the updated states
 */
export function reducer(
  state: ImmutableKeycloakUserRolesState = initialState,
  action: KeycloakUserRolesActionTypes
): ImmutableKeycloakUserRolesState {
  switch (action.type) {
    case USER_ROLES_FETCHED:
      return SeamlessImmutable({
        ...state,
        userRolesById: { ...state.userRolesById, ...action.userRolesById },
      });
    case REMOVE_USER_ROLES:
      return SeamlessImmutable({
        ...state,
        userRolesById: action.userRolesById,
      });

    default:
      return state;
  }
}

// Selectors

export interface Filters {
  id?: string[] /** get all roles whose ids appear in this array */;
  name?: string /** get user roles whose name includes text in the name field */;
  searchText?: string /** filter user roles with given text */;
}

/**
 * Gets id from Filter props
 *
 * @param _ - the redux store
 * @param props - the keycloak user role filters object
 */
export const getUserRolesIds = (_: Partial<Store>, props: Filters) => props.id;

/**
 * Gets name from Filter props
 *
 * @param _ - the redux store
 * @param props - the user roles filters object
 */
export const getRoleName = (_: Partial<Store>, props: Filters) => props.name;

/**
 * Gets searchText from filter props
 *
 * @param _ - the redux store
 * @param props - the user roles filters object
 */
export const getSearchText = (_: Partial<Store>, props: Filters) => props.searchText;

/** returns all user roles in the store as values whose keys are their respective ids
 *
 * @param {any} state - the redux store
 * @returns {object} - user roles object as values, respective ids as keys
 */
export function getKeycloakUserRolesById(
  state: Partial<Store>
): { [key: string]: KeycloakUserRole } {
  return (state as Dictionary)[reducerName].userRolesById;
}

/** gets keycloak user roles as an array of objects
 *
 * @param {any} state - the redux store
 * @returns {Array} - an array of user roles objs
 */
export function getKeycloakUserRolesArray(state: Partial<Store>): KeycloakUserRole[] {
  return values(getKeycloakUserRolesById(state));
}

export const getUserRoleByName = () =>
  /**
   * Gets all roles whose name includes phrase given in name filter prop
   *
   * @returns {Array} - roles whose name includes phrase given in name filter prop
   */
  createSelector(getKeycloakUserRolesArray, getRoleName, (userRolesArray, name) => {
    if (name === undefined) {
      return userRolesArray;
    }
    return userRolesArray.filter((userRole: KeycloakUserRole) =>
      userRole.name.toLowerCase().includes(name.toLowerCase())
    );
  });

export const getKeycloakUserRolesByIds = () =>
  /**
   * Gets all user roles whose identifiers appear in ids filter prop value
   *
   * @returns {Array} - user roles whose identifiers appear in ids filter prop value
   */
  createSelector(
    getKeycloakUserRolesById,
    getUserRolesIds,
    getKeycloakUserRolesArray,
    (userRolesById, ids, userRolesArray) => {
      if (ids === undefined) {
        return userRolesArray;
      }
      if (ids.length > 0) {
        return ids.map((id: string) => userRolesById[id]);
      }
      return [];
    }
  );

const userRolesByIdsSelector = getKeycloakUserRolesByIds();
const userRolesByNameSelector = getUserRoleByName();

export const makeKeycloakUserRolesSelector = () =>
  /** user roles array selector factory
   * aggregates response from all applied filters and returns results
   *
   * @returns {Array} - aggregates response from all applied filters and returns results
   */
  createSelector(
    userRolesByIdsSelector,
    userRolesByNameSelector,
    getSearchText,
    (arr1, arr2, searchText) => {
      const unfilteredResults = intersect([arr1, arr2], JSON.stringify);
      const matchesUserName = (userRole: KeycloakUserRole) => {
        if (searchText === undefined) {
          return true;
        }
        return userRole.name.toLowerCase().includes(searchText.toLowerCase());
      };
      return unfilteredResults.filter((role) => matchesUserName(role));
    }
  );
