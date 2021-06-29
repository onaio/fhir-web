/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
}

export type OrganizationDetail = Organization & {
  practitioners: Practitioner[];
};

export interface Practitioner extends Require<IfhirR4.IPractitioner, 'id' | 'active' | 'name'> {
  resourceType: 'Practitioner';
}

export interface PractitionerRole extends Require<IfhirR4.IPractitionerRole, 'id' | 'active'> {
  resourceType: 'PractitionerRole';
  practitioner: Require<Reference, 'reference'>; // reference have the "Practitioner/" then append the practitoner uuid
  organization: Require<Reference, 'reference'>; // reference have he "Organization/" then append the practitoner uuid
}
