import {
  ParsedHierarchyNode,
  RawHierarchyNode,
  RawHierarchyNodeMap,
  RawOpenSRPHierarchy,
  TreeNode,
  URLParams,
} from '../../ducks/types';
import { cloneDeep } from 'lodash';
import TreeModel from 'tree-model';

/** mutates the structure of the children property in a single node
 *
 * @param {RawHierarchyNode} rawNode - single node i.e. part of rawOpensrp hierarchy
 */
const parseChildren = (rawNode: RawHierarchyNode) => {
  // explicitly dictating the types since we are mutating the object to a diff structure.
  const typedRawNode = (rawNode as unknown) as ParsedHierarchyNode;

  if (typedRawNode.children) {
    typedRawNode.children = Object.entries(typedRawNode.children).map(([_, value]) => value);
    typedRawNode.children.forEach((child) => {
      const typedChild = (child as unknown) as RawHierarchyNode;
      typedChild.title = child.label;
      typedChild.key = child.label;
      parseChildren(typedChild);
    });
  }
};

/** extract the root node as a flat object
 *
 * @param {RawHierarchyNodeMap} map - value of map in the rawOpenSRPHierarchy
 * @returns {object} - returns Parent jurisdiction object
 */
const parseParent = (map: RawHierarchyNodeMap) => {
  const parentJurisdiction = Object.entries(map).map(([_, value]) => value)[0];
  parentJurisdiction.key = parentJurisdiction.id;
  parentJurisdiction.title = parentJurisdiction.label;
  return parentJurisdiction;
};

/** parses the raw opensrp hierarchy to a hierarchy that we can quickly build
 * our tree model from.
 *
 * @param {RawOpenSRPHierarchy} rawOpenSRPHierarchy - the response we get from opensrp
 * @returns {ParsedHierarchyNode} - returns Parent node with its children
 */
const parseHierarchy = (rawOpenSRPHierarchy: RawOpenSRPHierarchy) => {
  // clone the locationTree, we are going to be mutating a copy
  const rawLocationsTreeClone = cloneDeep(rawOpenSRPHierarchy);
  // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const { map } = rawLocationsTreeClone.locationsHierarchy;

  const parentNodeWithChildren = parseParent(map);
  parseChildren(parentNodeWithChildren);
  return (parentNodeWithChildren as unknown) as ParsedHierarchyNode;
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

/** converts filter params object to string
 *
 * @param {URLParams} obj - the object representing filter params
 * @returns {string} filter params as a string
 */
export function getFilterParams(obj: URLParams | {}): string {
  return Object.entries(obj)
    .map(([key, val]) => `${key}:${val}`)
    .join(',');
}
