/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { healthCareServiceResourceType } from './constants';
import { Organization } from '@opensrp/fhir-team-management';

/** interface for Objects */

export interface HealthcareService
  extends Require<IfhirR4.IHealthcareService, 'id' | 'providedBy' | 'active' | 'name'> {
  resourceType: typeof healthCareServiceResourceType;
}

export type HealthcareServiceDetail = HealthcareService & { organization?: Organization };
