/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

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
