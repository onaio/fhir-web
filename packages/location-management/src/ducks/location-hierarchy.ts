/** store location hierarchy information
 * - should be able to add a tree model
 * - modify the tree model in a manner such that shallow comparison would yield false
 * - provide the selectors
 */

import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { TreeNode } from './types';

/** reducer name for hierarchy reducer */
export const reducerName = 'location-hierarchy';

// **************************** actions *****************************

/** action to add a tree to store */
export const TREE_FETCHED = 'location-hierarchy/TREE_FETCHED';

/** describes action that adds a hierarchy tree to store */
export interface FetchedTreeAction extends AnyAction {
  type: typeof TREE_FETCHED;
  hierarchyObject: TreeNode;
  isSingleHierarchy: boolean;
}

/** combined full action types | its a union */
export type TreeActionTypes = FetchedTreeAction | AnyAction;

// **************************** action creators ****************************

/** action creator when adding a tree to store
 *
 * @param {TreeNode} hierarchy - the raw hierarchy as received from opensrp
 * @param {boolean} isSingleHierarchy - boolean to toggle between single and multiple hierarchies
 * @returns {object} - action object
 */
export function fetchAllHierarchies(
  hierarchy: TreeNode,
  isSingleHierarchy = false
): FetchedTreeAction {
  return {
    hierarchyObject: {
      ...hierarchy,
    } as TreeNode,
    isSingleHierarchy,
    type: TREE_FETCHED,
  };
}

// **************************** medusa ****************************

/** The store's slice state */
export interface TreeState {
  hierarchyArray: TreeNode[];
  currentParentChildren: TreeNode[];
}

/** Create an immutable tree state */
export type ImmutableTreeState = TreeState & SeamlessImmutable.ImmutableObject<TreeState>;

/** starting state */
export const initialState: ImmutableTreeState | Dictionary = SeamlessImmutable({
  hierarchyArray: [],
  currentParentChildren: [],
  locationObject: {},
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
        hierarchyArray: action.isSingleHierarchy
          ? [action.hierarchyObject]
          : [...state.hierarchyArray, action.hierarchyObject],
      };
    default:
      return state;
  }
}

/** gets array of all hierarchies
 *
 * @param {Store} state - the store
 * @returns {object} - returns item from location-hierarchy reducer
 */
export const getAllHierarchiesArray = (state: Partial<Store>): Dictionary<TreeNode> =>
  (state as Dictionary)[reducerName].hierarchyArray;
