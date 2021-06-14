import FHIR from 'fhirclient';
import { HealthcareService } from '.';
// import { PRACTITIONERROLE_GET, PRACTITIONER_GET } from './constants';
import { FHIRResponse, ProcessFHIRResponse, FhirObject, ProcessFHIRObject } from './fhirutils';

/**
 * Function to load selected healthcareservice for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadHealthcareDetails(props: {
  healthcareservice: HealthcareService;
  fhirbaseURL: string;
}): Promise<HealthcareService> {
  const { fhirbaseURL, healthcareservice } = props;
  const serve = FHIR.client(fhirbaseURL);

  console.log(healthcareservice);

  // const AllRoles: PractitionerRole[] =
  //   props.AllRoles ??
  //   (await serve
  //     .request(PRACTITIONERROLE_GET)
  //     .then((res: FHIRResponse<PractitionerRole>) => ProcessFHIRResponse(res)));

  // const practitionerrolesassignedref = AllRoles.filter(
  //   (role) => role.healthcareservice.reference === `HealthcareService/${healthcareservice.id}`
  // ).map((role) => role.practitioner.reference.split('/')[1]);

  // const practitionerAssignedPromise = practitionerrolesassignedref.map((id) =>
  //   serve
  //     .request(`${PRACTITIONER_GET}/${id}`)
  //     .then((res: FhirObject<Practitioner>) => ProcessFHIRObject(res))
  // );

  // const practitionerAssigned = await Promise.all(practitionerAssignedPromise);

  return { ...healthcareservice };
}
