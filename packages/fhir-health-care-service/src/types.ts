/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { HEALTH_CARE_SERVICE_RESOURCE_TYPE } from './constants';

/** interface for Objects */

export interface HealthcareService
  extends Require<IfhirR4.IHealthcareService, 'id' | 'providedBy' | 'active' | 'name'> {
  resourceType: typeof HEALTH_CARE_SERVICE_RESOURCE_TYPE;
}

export type HealthcareServiceDetail = HealthcareService & { organization?: Organization };

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
}
