/**
 * store location hierarchy information
 * - should be able to add a tree model
 * - modify the tree model in a manner such that shallow comparison would yield false
 * - provide the selectors
 */

import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { ParsedHierarchyNode } from './locationHierarchy/types';
import { LocationTreeState } from './types';

/** reducer name for hierarchy reducer */
export const reducerName = 'location-hierarchy';

// **************************** actions *****************************

/** action to add a tree to store */
export const TREE_FETCHED = 'location-hierarchy/TREE_FETCHED';
export const FETCH_SINGLE_LOCATION = 'location-hierarchy/FETCH_SINGLE_LOCATION';
export const SET_LOCATION_TREE_STATE = 'location-hierarchy/SET_LOCATION_TREE_STATE';

/** describes action that adds a hierarchy tree to store */
export interface FetchedTreeAction extends AnyAction {
  type: typeof TREE_FETCHED;
  hierarchyObject: ParsedHierarchyNode[];
}

/** describes action that saves a hierarchy tree to store */
export interface SetLocationTreeStateAction extends AnyAction {
  type: typeof SET_LOCATION_TREE_STATE;
  hierarchyObject: LocationTreeState;
}

/** combined full action types | its a union */
export type TreeActionTypes = FetchedTreeAction | SetLocationTreeStateAction | AnyAction;

// **************************** action creators ****************************

/**
 * action creator when adding a tree to store
 *
 * @param {ParsedHierarchyNode} hierarchy - the raw hierarchy as received from opensrp
 * @returns {object} - action object
 */
export function fetchAllHierarchies(hierarchy: ParsedHierarchyNode[]): FetchedTreeAction {
  return {
    hierarchyObject: hierarchy,
    type: TREE_FETCHED,
  };
}

/**
 * action creator when adding a tree to store
 *
 * @param {LocationTreeState} hierarchy - the tree state to be expanded
 * @returns {object} - action object
 */
export function setLocationTreeState(hierarchy: LocationTreeState): SetLocationTreeStateAction {
  return {
    hierarchyObject: hierarchy,
    type: SET_LOCATION_TREE_STATE,
  };
}

// **************************** medusa ****************************

/** The store's slice state */
export interface TreeState {
  hierarchyArray: ParsedHierarchyNode[];
  locationTreeState: LocationTreeState | null;
}

/** Create an immutable tree state */
export type ImmutableTreeState = TreeState & SeamlessImmutable.ImmutableObject<TreeState>;

/** starting state */
export const initialState: ImmutableTreeState | Dictionary = SeamlessImmutable({
  hierarchyArray: [],
  locationTreeState: null,
});

// the reducer function
/**
 *
 * @param {Dictionary} state - the store
 * @param {AnyAction} action - the redux action
 * @returns {object} - updated state
 */
export function reducer(
  state: ImmutableTreeState | Dictionary = initialState,
  action: TreeActionTypes
) {
  switch (action.type) {
    case TREE_FETCHED:
      return {
        ...state,
        hierarchyArray: action.hierarchyObject,
      };

    case SET_LOCATION_TREE_STATE:
      return {
        ...state,
        locationTreeState: {
          node: action.hierarchyObject.node as ParsedHierarchyNode,
          keys: action.hierarchyObject.keys as React.Key[],
        },
      };

    default:
      return state;
  }
}

/**
 * gets array of all hierarchies
 *
 * @param {Store} state - the store
 * @returns {object} - returns item from location-hierarchy reducer
 */
export const getAllHierarchiesArray = (state: Partial<Store>): ParsedHierarchyNode[] =>
  (state as Dictionary)[reducerName].hierarchyArray;

export const getLocationTreeState = (state: Partial<Store>): LocationTreeState | null =>
  (state as Dictionary)[reducerName].locationTreeState;
