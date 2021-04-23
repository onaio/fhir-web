/** store location hierarchy information
 * - should be able to add a tree model
 * - modify the tree model in a manner such that shallow comparison would yield false
 * - provide the selectors
 */

import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { RawOpenSRPHierarchy, TreeNode } from './types';
import { generateJurisdictionTree } from './utils';
import { createSelector } from 'reselect';
import { values } from 'lodash';

/** reducer name for hierarchy reducer */
export const hierarchyReducerName = 'locationHierarchy';

// **************************** actions *****************************

/** action to add a tree to store */
export const TREE_FETCHED = 'opensrp/locations/hierarchy/TREE_FETCHED';

/** remove trees */
export const DEFOREST = 'opensrp/locations/hierarchy/DEFOREST';

/** describes action that adds a tree to store */
export interface FetchedTreeAction extends AnyAction {
  type: typeof TREE_FETCHED;
  treeByRootId: Dictionary<TreeNode>;
}

/** describes action to remove all trees */
export interface DeforestAction extends AnyAction {
  type: typeof DEFOREST;
  treeByRootId: {};
}

/** combined full action types | its a union */
export type TreeActionTypes = FetchedTreeAction | DeforestAction | AnyAction;

// **************************** action creators ****************************

/** action creator when adding a tree to store
 *
 * @param apiResponse - the raw hierarchy as received from opensrp
 * @param treeId - the treeId to use while saving to the store
 */
export function fetchTree(
  apiResponse: RawOpenSRPHierarchy,
  treeId: string | null = null
): FetchedTreeAction {
  const tree = generateJurisdictionTree(apiResponse);
  return {
    treeByRootId: {
      [treeId ? treeId : tree.model.id]: tree,
    },
    type: TREE_FETCHED,
  };
}

/** clear all the trees */
export function deforest(): DeforestAction {
  return {
    treeByRootId: {},
    type: DEFOREST,
  };
}

// **************************** reducer ****************************

/** The store's slice state
 */
export interface TreeState {
  treeByRootId: Dictionary<TreeNode> | {};
}

/** Create an immutable tree state */
export type ImmutableTreeState = TreeState & SeamlessImmutable.ImmutableObject<TreeState>;

/** starting state */
export const initialState: ImmutableTreeState = SeamlessImmutable({
  treeByRootId: {},
});

// the reducer function
/**
 *
 * @param {Dictionary} state - the store
 * @param {AnyAction} action - the redux action
 * @returns {object} - updated state
 */
export function hierarchyReducer(
  state: ImmutableTreeState | Dictionary = initialState,
  action: TreeActionTypes
) {
  switch (action.type) {
    case TREE_FETCHED:
      return {
        ...state,
        treeByRootId: { ...state.treeByRootId, ...action.treeByRootId },
      };
    case DEFOREST:
      return {
        ...state,
        treeByRootId: action.treeByRootId,
      };
    default:
      return state;
  }
}

/** prop filters to customize selector queries */
export interface Filters {
  rootJurisdictionId?: string[] /** specify which tree to act upon, undefined allows all */;
  geoLevel?: number /** get locations at the specified level */;
  searchQuery?: string /** search query to filter nodes against, by name and id */;
}

/** retrieve the rootJurisdiction value
 *
 * @param _ - the store
 * @param props -  the filterProps
 */
export const getRootJurisdictionId = (_: Partial<Store>, props: Filters) =>
  props.rootJurisdictionId;

/** retrieve the geoLevel value
 *
 * @param _ - the store
 * @param props -  the filterProps
 */
export const getGeoLevel = (_: Partial<Store>, props: Filters) => props.geoLevel;

/** retrieve the geoLevel value
 *
 * @param _ - the store
 * @param props -  the filterProps
 */
export const getSearchQuery = (_: Partial<Store>, props: Filters) => props.searchQuery;

/** gets all trees key'd by the rootNodes id
 *
 * @param state - the store
 * @param _ -  the filterProps
 */
export const getTreesByRootId = (state: Partial<Store>, _: Filters): Dictionary<TreeNode> =>
  (state as Dictionary)[hierarchyReducerName].treeByRootId;

/** factory that returns a selector to retrieve the tree(s) using their rootNode's ids */
export const getTreesByIds = () =>
  createSelector(getTreesByRootId, getRootJurisdictionId, (treesById, rootIds): TreeNode[] => {
    const allTreesArray = values(treesById);
    if (rootIds === undefined) {
      return allTreesArray;
    }
    const treesOfInterest: TreeNode[] = [];
    rootIds.forEach((rootId) => {
      const treeOfInterest = treesById[rootId] as TreeNode | undefined;
      if (treeOfInterest) {
        treesOfInterest.push(treeOfInterest);
      }
    });
    return treesOfInterest;
  });

const treeSelectors = getTreesByIds();

/** factory that returns a selector to retrieve the tree(s) using their rootNode's ids
 * the selector will return all nodes if geographic level is undefined
 */
export const getLocationsByLevel = () =>
  createSelector(treeSelectors, getGeoLevel, (trees, geoLevel): TreeNode[] => {
    let locationsOfInterest: TreeNode[] = [];
    trees.forEach((tree) => {
      locationsOfInterest = [
        ...locationsOfInterest,
        ...tree.all((node) => {
          if (geoLevel === undefined) {
            return true;
          }
          return node.model.node.attributes.geographicLevel === geoLevel;
        }),
      ];
    });
    return locationsOfInterest;
  });

const geoLevelSelector = getLocationsByLevel();

/** factory that returns a selector that can be used to filter the nodes by either their
 * labels or ids
 */
export const getLocationsByNameAndId = () =>
  createSelector(geoLevelSelector, getSearchQuery, (nodes, searchQuery): TreeNode[] => {
    if (searchQuery === undefined) {
      return nodes;
    }
    const matchesName = (node: TreeNode) =>
      node.model.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesId = (node: TreeNode) => node.model.id === searchQuery;
    return nodes.filter((node) => {
      return matchesName(node) || matchesId(node);
    });
  });
