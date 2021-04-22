/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Identifier as FhirIdentifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

/** interface for FHIR response */
export interface FHIRResponse<T> {
  resourceType: string;
  id: string;
  meta: { lastUpdated: string };
  type: string;
  total: number;
  link: [{ relation: string; url: string }];
  entry: {
    fullUrl: string;
    resource: FhirObject<T>;
    search: { mode: string };
  }[];
}

export type FhirObject<T> = Omit<T, 'identifier'> & { identifier: FhirIdentifier[] };

export type Identifier = Require<FhirIdentifier, 'use' | 'value'>;
export type IdentifierObject = Record<FhirIdentifier.UseEnum, Identifier>;

/** interface for Objects */
export interface Organization
  extends Require<Omit<IfhirR4.IOrganization, 'identifier'>, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
  identifier: IdentifierObject;
}

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
