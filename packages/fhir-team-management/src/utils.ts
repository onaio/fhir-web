import FHIR from 'fhirclient';
import { Organization, PractitionerRole, OrganizationDetail, Practitioner } from '.';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET } from './constants';
import { FHIRResponse } from './fhirutils';

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadTeamDetails(props: {
  team: Organization;
  fhirBaseURL: string;
  AllRoles?: PractitionerRole[];
}): Promise<OrganizationDetail> {
  const { fhirBaseURL, team } = props;
  const serve = FHIR.client(fhirBaseURL);

  const AllRoles: PractitionerRole[] =
    props.AllRoles ??
    (await serve
      .request(PRACTITIONERROLE_GET)
      .then((res: FHIRResponse<PractitionerRole>) => res.entry.map((e) => e.resource)));

  const practitionerrolesassignedref = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => role.practitioner.reference.split('/')[1]);

  const practitionerAssignedPromise = practitionerrolesassignedref.map((id) =>
    serve.request(`${PRACTITIONER_GET}/${id}`).then((res: Practitioner) => res)
  );

  const practitionerAssigned = await Promise.all(practitionerAssignedPromise);

  return { ...team, practitioners: practitionerAssigned };
}
