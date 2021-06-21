import FHIR from 'fhirclient';
import { Groups, GroupDetail } from '.';
import { PATIENT_GET } from './constants';
import { FHIRResponse, ProcessFHIRResponse, FhirObject, ProcessFHIRObject } from './fhirutils';
import { Patient } from './types';

/**
 * Function to load selected healthcareservice for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadHealthcareDetails(props: {
  healthcareservice: Groups;
  fhirBaseURL: string;
}): Promise<GroupDetail> {
  const { fhirBaseURL, healthcareservice } = props;
  const serve = FHIR.client(fhirBaseURL);

  const orgid = healthcareservice.providedBy?.reference?.split('/')[1];

  const organization = orgid
    ? await serve
        .request(PATIENT_GET + orgid)
        .then((res: FhirObject<Patient>) => ProcessFHIRObject(res))
    : undefined;

  return { ...healthcareservice, ...(organization && { organization: organization }) };
}
