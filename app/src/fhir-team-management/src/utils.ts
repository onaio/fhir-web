import FHIR from 'fhirclient';
import { Organization, PractitionerRole, OrganizationDetail, Practitioner } from '.';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET } from './constants';
import { FHIRResponse, ProcessFHIRResponse, FhirObject, ProcessFHIRObject } from './fhirutils';

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadTeamDetails(props: {
  team: Organization;
  fhirbaseURL: string;
  AllRoles?: PractitionerRole[];
}): Promise<OrganizationDetail> {
  const { fhirbaseURL, team } = props;
  const serve = FHIR.client(fhirbaseURL);

  const AllRoles: PractitionerRole[] =
    props.AllRoles ??
    (await serve
      .request(PRACTITIONERROLE_GET)
      .then((res: FHIRResponse<PractitionerRole>) => ProcessFHIRResponse(res)));

  const practitionerrolesassignedref = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => role.practitioner.reference.split('/')[1]);

  const practitionerAssignedPromise = practitionerrolesassignedref.map((id) =>
    serve
      .request(`${PRACTITIONER_GET}/${id}`)
      .then((res: FhirObject<Practitioner>) => ProcessFHIRObject(res))
  );

  const practitionerAssigned = await Promise.all(practitionerAssignedPromise);

  return { ...team, practitioners: practitionerAssigned };
}
