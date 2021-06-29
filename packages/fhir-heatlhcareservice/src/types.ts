/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';

/** interface for Objects */

export interface HealthcareService
  extends Require<
    IfhirR4.IHealthcareService,
    'id' | 'providedBy' | 'comment' | 'extraDetails' | 'active' | 'name'
  > {
  resourceType: 'HealthcareService';
}

export type HealthcareServiceDetail = HealthcareService & { organization?: Organization };

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
}
