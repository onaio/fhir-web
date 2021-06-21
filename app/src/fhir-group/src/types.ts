/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import { IdentifierObject } from './fhirutils';

/** interface for Objects */

export interface Groups
  extends Require<
    Omit<IfhirR4.IHealthcareService, 'identifier'>,
    'id' | 'providedBy' | 'comment' | 'extraDetails' | 'active' | 'name'
  > {
  resourceType: 'Group';
  identifier: IdentifierObject;
}

export type GroupDetail = Groups & { patient?: Patient };

/** interface for Objects */
export interface Patient
  extends Require<Omit<IfhirR4.IPatient, 'identifier'>, 'id' | 'active' | 'name'> {
  resourceType: 'Patient';
  identifier: IdentifierObject;
}
