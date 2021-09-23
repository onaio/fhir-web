import { FHIRService } from 'react-utils/dist/types';
import { HealthcareService, HealthcareServiceDetail } from '.';
import { ORGANIZATION_GET } from './constants';
import { Organization } from './types';

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
  const serve = await FHIRService(fhirBaseURL);

  const orgid = healthcareservice.providedBy?.reference?.split('/')[1];

  const organization = orgid
    ? await serve.request(ORGANIZATION_GET + orgid).then((res: Organization) => res)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return { ...healthcareservice, ...(organization && { organization: organization }) };
}
