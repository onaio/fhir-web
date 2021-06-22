/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import { IdentifierObject } from './fhirutils';

/** interface for Objects */
export interface Organization
  extends Require<Omit<IfhirR4.IOrganization, 'identifier'>, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
  identifier: IdentifierObject;
}

export type OrganizationDetail = Organization & { practitioners: Practitioner[] };

export interface Practitioner
  extends Require<Omit<IfhirR4.IPractitioner, 'identifier'>, 'id' | 'active' | 'name'> {
  resourceType: 'Practitioner';
  identifier: IdentifierObject;
}

export interface PractitionerRole
  extends Require<Omit<IfhirR4.IPractitionerRole, 'identifier'>, 'id' | 'active'> {
  resourceType: 'PractitionerRole';
  identifier: IdentifierObject;
  practitioner: Require<Reference, 'reference'>; // reference have the "Practitioner/" then append the practitoner uuid
  organization: Require<Reference, 'reference'>; // reference have he "Organization/" then append the practitoner uuid
}
