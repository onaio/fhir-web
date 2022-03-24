import { Dictionary } from '@onaio/utils';
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
  node: {
    locationId: string;
    name: string;
    tags?: string[];
    parentLocation?: { locationId: string; voided: boolean };
    attributes: HierarchyNodeAttributes;
    voided: boolean;
  };
  children?: TChild;
  parent?: string;
}

/**
 * field that we will use to add ad-hoc information to a node
 * this field will be added to each node during parsing the raw data from the api
 */
export interface AddedFields {
  title: string;
  key: string;
}

/** single node description after coming in from the api */
export type RawHierarchyNode = HierarchyNode<RawHierarchyNodeMap>;

/**
 * single node description after our initial custom parsing in preparation of
 * building the tree model
 */
export type ParsedHierarchyNode = HierarchyNode<ParsedHierarchyNode[]> & AddedFields;

/**
 * in the opensrp api hierarchy response, the raw hierarchy will be key'd
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
