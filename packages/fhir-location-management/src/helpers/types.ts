import TreeModel from 'tree-model';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { Uri } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/uri';

export interface CommonHierarchyNode {
  nodeId: Uri;
  label: string;
  node: ILocation;
  parent?: Uri;
}

// describes a raw tree node as received within the raw hierarchy api response
export interface LocationHierarchyTreeNode extends CommonHierarchyNode {
  children?: Array<ChildNodeList>;
}

// describes the tree node (LocationHierarchyTreeNode) after parsing it
export interface ParsedHierarchyNode extends CommonHierarchyNode {
  children?: Array<ParsedHierarchyNode>;
}

// the root node has a different interface to all other children
export interface ParentNodeList {
  treeNodeId: Uri;
  treeNode: Array<LocationHierarchyTreeNode>;
}

// children tree nodes have a diff structure to the root parent node
export interface ChildNodeList {
  childId: Uri;
  treeNode: LocationHierarchyTreeNode;
}

// describes the locationHierarchy resource.
export interface LocationHierarchyResource extends Resource {
  LocationHierarchyTree: {
    locationsHierarchy: {
      listOfNodes: ParentNodeList;
      parentChildren: [
        {
          identifier: Uri;
          childIdentifiers: Uri[];
        }
      ];
    };
  };
}

/** helper type, shortened form */
export type TreeNode = TreeModel.Node<ParsedHierarchyNode>;

// https://www.hl7.org/fhir/valueset-location-status.html
export enum LocationUnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
