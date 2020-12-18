/** Organizations redux module */
import { Dictionary } from '@onaio/utils';
import { keyBy, values } from 'lodash';
import { Store } from 'redux';
import { AnyAction } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'organizations';

/** interface for Organization coding property */
interface OrganizationCoding {
  code: string;
  display: string;
  system: string;
}

/** interface for the type key in an organization Object */
interface OrganizationType {
  coding: OrganizationCoding[];
}

/** interface for a Organization object */
export interface Organization {
  active: boolean;
  id: number;
  identifier: string;
  name: string;
  partOf?: number;
  type?: OrganizationType;
}

// action interfaces

/** action type for action that adds Organizations to store */
export const ORGANIZATIONS_FETCHED = 'src/store/ducks/organizations/reducer/TEAM_FETCHED';
/** action type for REMOVE_TEAMS action */
export const REMOVE_ORGANIZATIONS = 'src/store/ducks/organizations/reducer/REMOVE_TEAMS';

/** interface for organizations fetched action */
export interface FetchOrganizationsAction extends AnyAction {
  overwrite: boolean;
  organizationsByIdentifier: { [key: string]: Organization };
  type: typeof ORGANIZATIONS_FETCHED;
}

/** interface for action that removes organizations from store */
export interface RemoveOrganizationsAction extends AnyAction {
  organizationsByIdentifier: { [key: string]: Organization };
  type: typeof REMOVE_ORGANIZATIONS;
}

/** interface for Organizations state in store */
interface OrgsStoreState {
  organizationsByIdentifier: { [key: string]: Organization } | {};
}

/** initial state for Organizations records in store */
const initialOrgsStoreState: ImmutableOrgsStoreState = SeamlessImmutable({
  organizationsByIdentifier: {},
});

/** single type for all action types */
type OrganizationActionTypes = FetchOrganizationsAction | RemoveOrganizationsAction | AnyAction;

// immutable organization state in dux
export type ImmutableOrgsStoreState = OrgsStoreState &
  SeamlessImmutable.ImmutableObject<OrgsStoreState>;

/** the Organization reducer function
 *
 * @param {object} state the store
 * @param {object} action the action
 * @returns {object} -
 */
export default function reducer(state = initialOrgsStoreState, action: OrganizationActionTypes) {
  switch (action.type) {
    case ORGANIZATIONS_FETCHED:
      return SeamlessImmutable({
        ...state,
        organizationsByIdentifier: action.overwrite
          ? { ...action.organizationsByIdentifier } // this repopulates the store with newly fetched data
          : { ...state.organizationsByIdentifier, ...action.organizationsByIdentifier }, // this adds fetched data to existing store data,
      });
    case REMOVE_ORGANIZATIONS:
      return SeamlessImmutable({
        ...state,
        organizationsByIdentifier: action.organizationsByIdentifier,
      });
    default:
      return state;
  }
}

// actions

/** action to remove organizations form store */
export const removeOrganizationsAction: RemoveOrganizationsAction = {
  organizationsByIdentifier: {},
  type: REMOVE_ORGANIZATIONS,
};

// action creators

/** creates action to add fetched organizations to store
 *
 * @param {object []} organizationsList - array of organizations to be added to store
 * @param {boolean} overwrite - whether to replace organization records in state
 *
 * @returns {object} - action with organizations payload that is added to store
 */
export const fetchOrganizations = (
  organizationsList: Organization[],
  overwrite = false
): FetchOrganizationsAction => {
  return {
    organizationsByIdentifier: keyBy(organizationsList, (organization) => organization.identifier),
    overwrite,
    type: ORGANIZATIONS_FETCHED,
  };
};

// selectors

/** filter params for organization selectors */
interface OrganizationFilters {
  identifiers?: string[] /** array of UUID to get their corresponding organizations */;
}

/**
 * Gets identifiers from OrganizationFilters
 *
 * @param {object} _ - the redux store
 * @param {object} props - the organization filters object
 * @returns {string} -
 */
export const getIdentifiers = (_: Partial<Store>, props: OrganizationFilters) => props.identifiers;

/** get organizations as an object where their ids are the keys and the objects
 * the values
 *
 * @param {object} state - Portion of the store
 *
 * @returns {object} -
 */
export function getOrganizationsById(state: Partial<Store>): Dictionary<Organization> {
  return (state as Dictionary)[reducerName].organizationsByIdentifier;
}

/** Get all organizations as an array
 *
 * @param {object} state - Part of the redux store
 *
 * @returns {object} - all organizations in store as an array
 */
export function getOrganizationsArray(state: Partial<Store>): Organization[] {
  return values(getOrganizationsById(state));
}

// MEMOIZED SELECTORS

/**
 * Gets all organizations whose identifiers appear in identifiers filter prop value
 *
 * @returns {object} -
 */
export const getOrganizationsByIds = () =>
  createSelector(
    getOrganizationsById,
    getIdentifiers,
    getOrganizationsArray,
    (orgsById, identifiers, orgsArray) => {
      if (identifiers === undefined) {
        return orgsArray;
      }
      if (identifiers.length > 0) {
        return identifiers.map((id) => orgsById[id]);
      }
      return [];
    }
  );

/** organization array selector factory
 * aggregates response from all applied filters and returns results
 *
 * @returns {object} -
 */
export const makeOrgsArraySelector = () =>
  createSelector(getOrganizationsByIds(), (orgs1) => {
    return orgs1;
  });
