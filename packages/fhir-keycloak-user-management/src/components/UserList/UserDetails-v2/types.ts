import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';


export interface PractitionerDetail extends Resource {
  fhir: {
    careteams?: ICareTeam[];
    teams?: IOrganization[];
    locationHierarchyList?: any[]; // TODO - import LocationHierarchy
    practitionerRoles?: IPractitionerRole[];
    groups?: IGroup[];
    practitioner?: IPractitioner[]
  }
}

export interface RoleMapping {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}

export interface ClientRoleMapping {
  id: string;
  client: string;
  mappings: RoleMapping[]
}

export interface KeycloakUserRoleMappings {
  realmMappings?: RoleMapping[];
  clientMappings?: Record<string, ClientRoleMapping>
}

export interface PractitionerDetail extends Resource {
  fhir: {
    careteams?: ICareTeam[];
    teams?: IOrganization[];
    locationHierarchyList?: any[]; // TODO - import LocationHierarchy
    practitionerRoles?: IPractitionerRole[];
    groups?: IGroup[];
    practitioner?: IPractitioner[]
  }
}