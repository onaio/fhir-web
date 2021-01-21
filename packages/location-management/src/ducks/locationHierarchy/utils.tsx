import {
  ParsedHierarchyNode,
  RawHierarchyNode,
  RawHierarchyNodeMap,
  RawOpenSRPHierarchy,
  TreeNode,
} from './types';
import { cloneDeep } from 'lodash';
import TreeModel from 'tree-model';
import cycle from 'cycle';

/** Parse the raw child hierarchy node map
 *
 * @param {RawHierarchyNodeMap} rawNodeMap - Object of raw hierarchy nodes
 * @returns {Array<ParsedHierarchyNode>} Array of Parsed hierarchy nodes
 */
const parseChildren = (rawNodeMap: RawHierarchyNodeMap) => {
  const rawHierarchyNode: RawHierarchyNode[] = Object.entries(rawNodeMap).map(
    ([_key, value]) => value
  );
  return rawHierarchyNode.map((child) => {
    const parsedNode: ParsedHierarchyNode = {
      ...child,
      title: child.label,
      key: child.label,
      children: child.children ? parseChildren(child.children) : undefined,
    };
    return parsedNode;
  });
};

/** parses the raw opensrp hierarchy to a hierarchy that we can quickly build
 * our tree model from.
 *
 * @param {RawOpenSRPHierarchy} raw - the response we get from opensrp
 * @returns {ParsedHierarchyNode} - returns Parent node with its children
 */
const parseHierarchy = (raw: RawOpenSRPHierarchy) => {
  // clone the locationTree, we are going to be mutating a copy
  const rawClone: RawOpenSRPHierarchy = cloneDeep(raw);

  // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const { map } = rawClone.locationsHierarchy;
  // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const rawNode: RawHierarchyNode = Object.entries(map).map(([_key, value]) => value)[0];
  const parsedNode: ParsedHierarchyNode = {
    ...rawNode,
    title: rawNode.label,
    key: rawNode.id,
    children: rawNode.children ? parseChildren(rawNode.children) : undefined,
  };

  return parsedNode;
};

/** takes the raw opensrp hierarchy response and creates a tree model structure
 *
 * @param {RawOpenSRPHierarchy} apiResponse - the response we get from opensrp
 * @returns {TreeNode} - returns root node
 */
export const generateJurisdictionTree = (apiResponse: RawOpenSRPHierarchy): TreeNode => {
  const tree = new TreeModel();
  const hierarchy = parseHierarchy(apiResponse);
  const root = tree.parse<ParsedHierarchyNode>(hierarchy);
  return root;
};

/**
 * serialize tree due to circular dependencies
 *
 * @param trees - trees to be serialized
 */
export const serializeTree = (trees: TreeNode[]) => {
  return JSON.stringify(trees.map((tree) => JSON.stringify(cycle.decycle(tree))));
};
