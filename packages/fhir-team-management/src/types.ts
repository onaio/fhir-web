/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import {
  ORGANIZATION_RESOURCE_TYPE,
  PRACTITIONERROLE_RESOURCE_TYPE,
  PRACTITIONER_RESOURCE_TYPE,
} from './constants';

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: typeof ORGANIZATION_RESOURCE_TYPE;
}

export type OrganizationDetail = Organization & {
  practitionerInfo: { name: string; id: string }[];
};

export interface Practitioner extends Require<IfhirR4.IPractitioner, 'id' | 'active' | 'name'> {
  resourceType: typeof PRACTITIONER_RESOURCE_TYPE;
}

export interface PractitionerRole extends Require<IfhirR4.IPractitionerRole, 'id' | 'active'> {
  resourceType: typeof PRACTITIONERROLE_RESOURCE_TYPE;
  practitioner: Require<Reference, 'reference' | 'display'>; // reference have the "Practitioner/" then append the practitoner uuid
  organization: Require<Reference, 'reference' | 'display'>; // reference have he "Organization/" then append the practitoner uuid
}
