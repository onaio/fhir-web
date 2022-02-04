/** simple store to track state of selected nodes
 */

import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { TreeNode } from '../helpers/types';

/** reducer name for hierarchy reducer */
export const reducerName = 'location-tree-state';

// **************************** actions *****************************

/** action to add a tree state to store */
export const SET_LOCATION_TREE_STATE = `${reducerName}/SET_LOCATION_TREE_STATE`;

export interface LocationTreeState {
  selectedNode?: TreeNode;
}

// **************************** action creators ****************************

/** describes action that saves the selectedNode to store */
export interface SetLocationTreeStateAction extends AnyAction {
  type: typeof SET_LOCATION_TREE_STATE;
  node: TreeNode;
}

/** combined full action types | its a union */
export type TreeActionTypes = SetLocationTreeStateAction | AnyAction;

/**
 * action creator when adding the selectedNode to store
 *
 * @param node - the selectedNode
 * @returns - action object
 */
export function setLocationTreeState(node: TreeNode): SetLocationTreeStateAction {
  return {
    node: node,
    type: SET_LOCATION_TREE_STATE,
  };
}

/** Create an immutable tree state */
export type ImmutableTreeState = LocationTreeState &
  SeamlessImmutable.ImmutableObject<LocationTreeState>;

/** starting state */
export const initialState: ImmutableTreeState = SeamlessImmutable({
  selectedNode: undefined,
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
    case SET_LOCATION_TREE_STATE:
      return {
        ...state,
        selectedNode: action.selectedNode,
      };

    default:
      return state;
  }
}

/**
 * retrieves the stored selected node
 *
 * @param state - the store
 */
export const getSelectedNode = (state: Partial<Store>) => {
  return (state as Dictionary)[reducerName].selectedNode as TreeNode | undefined;
};
