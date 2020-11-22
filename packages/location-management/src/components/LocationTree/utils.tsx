import { Dictionary } from '@onaio/utils';
import { cloneDeep } from 'lodash';
import TreeModel from 'tree-model';

/** describes a node's attribute field */
export interface HierarchyNodeAttributes {
  geographicLevel: number;
  structureCount?: number;
}

/** Generic type to create types for a single node where children prop is generic */
export interface HierarchyNode<TChild> {
  id: string;
  label: string;
  title: string;
  key: string;
  node: {
    locationId: string;
    name: string;
    parentLocation?: { locationId: string; voided: boolean };
    attributes: HierarchyNodeAttributes;
    voided: boolean;
  };
  children?: TChild;
  parent?: string;
}
/** properties that will be added to meta field */
export interface Meta {
  selected?: boolean;
  actionBy?: string;
  metaStructureCount?: number;
}

/** field that we will use to add ad-hoc information to a node
 * this field will be added to each node during parsing the raw data from the api
 */
export interface MetaField {
  meta?: Meta;
}

/** single node description after coming in from the api */
export type RawHierarchyNode = HierarchyNode<RawHierarchyNodeMap>;

/** single node description after our initial custom parsing in preparation of
 * building the tree model
 */
export type ParsedHierarchyNode = HierarchyNode<ParsedHierarchyNode[]> & MetaField;

/** in the opensrp api hierarchy response, the raw hierarchy will be key'd
 * by the node's id
 */
export interface RawHierarchyNodeMap {
  [id: string]: RawHierarchyNode;
}

/** describes the full api Response (raw opensrp hierarchy) */
export interface RawOpenSRPHierarchy {
  locationsHierarchy: {
    map: RawHierarchyNodeMap;
    parentChildren: Dictionary<string[]>;
  };
}

/** helper type, shortened form */
export type TreeNode = TreeModel.Node<ParsedHierarchyNode>;

/** describes callback used by the autoSelect functionality */
export type AutoSelectCallback = (node: TreeNode) => boolean;

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
 * @param {RawOpenSRPHierarchy} map - value of map in the rawOpenSRPHierarchy
 * @returns {Dictionary} - returns Parent jurisdiction object
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
export const generateJurisdictionTree = (apiResponse: RawOpenSRPHierarchy) => {
  const tree = new TreeModel();
  const hierarchy = parseHierarchy(apiResponse);
  const root = tree.parse<ParsedHierarchyNode>(hierarchy);
  return root;
};

/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean;
}

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
