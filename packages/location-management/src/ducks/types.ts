import { Dictionary } from '@onaio/utils';
import { Geometry } from 'geojson';
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
export interface ExtraField {
  title: string;
  key: string;
  meta?: Meta;
}

/** single node description after coming in from the api */
export type RawHierarchyNode = HierarchyNode<RawHierarchyNodeMap>;

/** single node description after our initial custom parsing in preparation of
 * building the tree model
 */
export type ParsedHierarchyNode = HierarchyNode<ParsedHierarchyNode[]> & ExtraField;

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

/** interface to describe URL params object */
export interface URLParams {
  [key: string]: string | number | boolean;
}

/** The shape of a jurisdiction received from the OpenSRP API */
export interface OpenSRPJurisdiction {
  id: string;
  geometry?: Geometry;
  properties: {
    code?: string;
    geographicLevel: number;
    name: string;
    parentId?: string;
    status: string;
    version: string | number;
  };
  serverVersion: number;
  type: 'Feature';
}

/** Object containing known API endpoints by name */
export interface APIEndpoints {
  [key: string]: string;
}

/** Convenient type for either an array of jurisdictions or of tree nodes */
export type TreeNodeType = OpenSRPJurisdiction | TreeNode;

/** default component props */
export interface Props {
  opensrpBaseURL: string;
}
