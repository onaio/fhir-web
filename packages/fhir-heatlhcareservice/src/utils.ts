import FHIR from 'fhirclient';
import { HealthcareService, HealthcareServiceDetail } from '.';
import { ORGANIZATION_GET } from './constants';
import { FhirObject, ProcessFHIRObject } from './fhirutils';
import { Organization } from './types';

/**
 * Function to load selected healthcareservice for details
 *
 * @param fhirBaseURL Base url of fhir server
 * @param healthcareservice data selected from the table
 */
export async function loadHealthcareDetails(
  fhirBaseURL: string,
  healthcareservice: HealthcareService
): Promise<HealthcareServiceDetail> {
  const serve = FHIR.client(fhirBaseURL);

  const orgid = healthcareservice.providedBy?.reference?.split('/')[1];

  const organization = orgid
    ? await serve
        .request(ORGANIZATION_GET + orgid)
        .then((res: FhirObject<Organization>) => ProcessFHIRObject(res))
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return { ...healthcareservice, ...(organization && { organization: organization }) };
}
