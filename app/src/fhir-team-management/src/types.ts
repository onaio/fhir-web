/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';

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
    resource: T;
    search: { mode: string };
  }[];
}

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'name' | 'id' | 'active'> {
  resourceType: 'Organization';
  identifier: [Identifier & { use: 'official'; value: string }];
}

export interface Practitioner extends Require<IfhirR4.IPractitioner, 'id' | 'name' | 'active'> {
  resourceType: 'Practitioner';
  identifier: [Identifier & { use: 'official'; value: string }];
}

export interface PractitionerRole
  extends Require<IfhirR4.IPractitionerRole, 'id' | 'active' | 'practitioner' | 'organization'> {
  resourceType: 'PractitionerRole';
  identifier: [Identifier & { use: 'official'; value: string }];
  practitioner: Reference & { reference: string }; // reference have the "Practitioner/" then append the practitoner uuid
  organization: Reference & { reference: string }; // reference have he "Organization/" then append the practitoner uuid
}
