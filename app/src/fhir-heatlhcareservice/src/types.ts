/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import { IdentifierObject } from './fhirutils';

/** interface for Objects */

export interface HealthcareService
  extends Require<
    Omit<IfhirR4.IHealthcareService, 'identifier'>,
    'id' | 'providedBy' | 'comment' | 'extraDetails' | 'active' | 'name'
  > {
  resourceType: 'HealthcareService';
  identifier: IdentifierObject;
}

/** interface for Objects */
// export interface Organization
//   extends Require<Omit<IfhirR4.IOrganization, 'identifier'>, 'id' | 'active' | 'name'> {
//   resourceType: 'Organization';
//   identifier: IdentifierObject;
// }
