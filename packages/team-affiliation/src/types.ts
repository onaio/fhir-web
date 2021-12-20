import { Dictionary } from '@onaio/utils';
/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import {
  ORGANIZATION_RESOURCE_TYPE,
  ORGANIZATIONAFFILIATION_RESOURCE_TYPE,
  LOCATION_RESOURCE_TYPE,
  LOCATIONHIERARCHY_RESOURCE_TYPE,
} from './constants';

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: typeof ORGANIZATION_RESOURCE_TYPE;
}

export type OrganizationDetail = Organization & {
  locationInfo: { name: string; id: string }[];
};

export interface Location extends Require<IfhirR4.ILocation, 'id' | 'name'> {
  resourceType: typeof LOCATION_RESOURCE_TYPE;
}

export interface OrganizationAffiliation
  extends Require<IfhirR4.IOrganizationAffiliation, 'id' | 'active'> {
  resourceType: typeof ORGANIZATIONAFFILIATION_RESOURCE_TYPE;
  location: Require<Reference, 'reference' | 'display'>[]; // reference have the "Location/" then append the practitoner uuid
  organization: Require<Reference, 'reference' | 'display'>; // reference have he "Organization/" then append the practitoner uuid
}

//ILocationHirerchy
export interface LocationHirerchyWrappar {
  entry: {
    resource: {
      resourceType: typeof LOCATIONHIERARCHY_RESOURCE_TYPE;
      id: String;
      meta: {
        profile: String[];
      };
      LocationHierarchyTree: {
        locationsHierarchy: {
          listOfNodes: TreeNodeWrapper;
          parentChildren?: any[];
        };
      };
      locationId: string;
    };
  }[];
}

export interface LocationHirerchy {
  resourceType: typeof LOCATIONHIERARCHY_RESOURCE_TYPE;
  id: String;
  meta: {
    profile: String[];
  };
  LocationHierarchyTree: {
    locationsHierarchy: {
      listOfNodes: TreeNodeWrapper;
      parentChildren?: any[];
    };
  };
  locationId: string;
}

export interface TreeNodeWrapper {
  treeNodeId?: string;
  childId?: string;
  treeNode: TreeNode[] | TreeNode;
}

export interface TreeNode {
  id?: string;
  nodeId: string;
  label: string;
  node: Location;
  parent?: string;
  children?: TreeNodeWrapper[];
}

export interface ParseNode {
  [key: string]: {
    id?: string;
    label: string;
    node: Location;
    parent?: string;
    children?: TreeNodeWrapper[];
  };
}
