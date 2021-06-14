import FHIR from 'fhirclient';
import { HealthcareService, HealthcareServiceDetail } from '.';
import { ORGANIZATION_GET } from './constants';
import { FHIRResponse, ProcessFHIRResponse, FhirObject, ProcessFHIRObject } from './fhirutils';
import { Organization } from './types';

/**
 * Function to load selected healthcareservice for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadHealthcareDetails(props: {
  healthcareservice: HealthcareService;
  fhirBaseURL: string;
}): Promise<HealthcareServiceDetail> {
  const { fhirBaseURL, healthcareservice } = props;
  const serve = FHIR.client(fhirBaseURL);

  const orgid = healthcareservice.providedBy?.reference?.split('/')[1];

  const organization = orgid
    ? await serve
        .request(ORGANIZATION_GET + orgid)
        .then((res: FhirObject<Organization>) => ProcessFHIRObject(res))
    : undefined;

  return { ...healthcareservice, ...(organization && { organization: organization }) };
}
