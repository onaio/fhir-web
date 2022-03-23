import { Organization, ORGANIZATION_RESOURCE_TYPE } from '@opensrp/fhir-team-management';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { HealthcareService, HealthcareServiceDetail } from '..';

/**
 * Function to load selected healthcareservice for details
 *
 * @param fhirBaseURL Base url of fhir server
 * @param healthcareservice data selected from the table
 */
export async function loadHealthcareOrganization(
  fhirBaseURL: string,
  healthcareservice: HealthcareService
): Promise<HealthcareServiceDetail> {
  const serve = new FHIRServiceClass<Organization>(fhirBaseURL, ORGANIZATION_RESOURCE_TYPE);

  const orgid = healthcareservice.providedBy?.reference?.split('/')[1];

  const organization = orgid ? await serve.read(orgid) : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return { ...healthcareservice, ...(organization && { organization: organization }) };
}
