import { Dictionary } from '@onaio/utils';
import TreeModel from 'tree-model';
import { IfhirR4 } from '@smile-cdr/fhirts';

/** describes a node's attribute field */
export interface HierarchyNodeAttributes {
  geographicLevel: number;
  structureCount?: number;
}

export interface FHIRTreeNode<TChild> {
  children?: TChild;
  label: string;
  title: string;
  id: string;
  childId: string;
  node: IfhirR4.ILocation;
  treeNode?: {
    node: IfhirR4.ILocation;
    children?: TChild;
    label: string;
  };
  nodeId: string;
}

export interface Node {
  locationId: string;
  name: string;
  parentLocation?: { locationId: string; voided: boolean };
  attributes: HierarchyNodeAttributes;
  voided: boolean;
}

/** Generic type to create types for a single node where children prop is generic */
export interface HierarchyNode<TChild> {
  id: string;
  label: string;
  node: Node;
  children?: TChild;
  parent?: string;
}

/** field that we will use to add ad-hoc information to a node
 * this field will be added to each node during parsing the raw data from the api
 */
export interface AddedFields {
  title: string;
  key: string;
  parent: string;
  parentId: string;
}

/** single node description after coming in from the api */
export type RawHierarchyNode = HierarchyNode<RawFHIRHierarchyNodeMap>;

export type RawFHIRHierarchyNode = FHIRTreeNode<RawFHIRHierarchyNodeMap>;

export type ParsedFHIRHierarchyNode = FHIRTreeNode<ParsedFHIRHierarchyNode[]> & AddedFields;

/** single node description after our initial custom parsing in preparation of
 * building the tree model
 */
export type ParsedHierarchyNode = HierarchyNode<ParsedHierarchyNode[]> & AddedFields;

/** in the opensrp api hierarchy response, the raw hierarchy will be key'd
 * by the node's id
 */
export interface RawFHIRHierarchyNodeMap {
  [id: string]: RawFHIRHierarchyNode;
}

/** describes the full api Response (raw opensrp hierarchy) */
export interface RawOpenSRPHierarchy {
  locationsHierarchy: {
    map: RawFHIRHierarchyNodeMap;
    parentChildren: Dictionary<string[]>;
  };
}

/** helper type, shortened form */
export type TreeNode = TreeModel.Node<ParsedHierarchyNode>;
