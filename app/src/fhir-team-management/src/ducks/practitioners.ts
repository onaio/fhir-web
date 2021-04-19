/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';

export interface Practitioner extends Require<IfhirR4.IPractitioner, 'id' | 'active'> {
  resourceType: 'Practitioner';
  identifier: [Identifier & { use: 'official' }];
}

export interface PractitionerRole extends Require<IfhirR4.IPractitionerRole, 'id' | 'active'> {
  resourceType: 'PractitionerRole';
  identifier: [Identifier & { use: 'official' }];
}
