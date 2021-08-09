import FHIR from 'fhirclient';
import { Organization, PractitionerRole, OrganizationDetail, Practitioner } from '.';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET } from './constants';
import { FHIRResponse } from '@opensrp/react-utils';

/**
 * Function to load selected Team for details
 *
 * @param props function properties containing data
 * @param {Organization} props.team team to load data of
 * @param {string} props.fhirBaseURL base url to use for data loading
 * @param {PractitionerRole[]} props.AllPractitionerRoles All practioner roles to use for data mapiing
 */
export async function loadTeamPractitioner(props: {
  team: Organization;
  fhirBaseURL: string;
  AllPractitionerRoles?: PractitionerRole[];
}): Promise<OrganizationDetail> {
  const { fhirBaseURL, team } = props;
  const serve = FHIR.client(fhirBaseURL);

  const AllRoles: PractitionerRole[] =
    props.AllPractitionerRoles ??
    (await serve
      .request(PRACTITIONERROLE_GET)
      .then((res: FHIRResponse<PractitionerRole>) => res.entry.map((e) => e.resource)));

  const practitionerrolesassignedref = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => role.practitioner.reference.split('/')[1]);

  const practitionerAssignedPromise = practitionerrolesassignedref.map((id) =>
    serve.request(`${PRACTITIONER_GET}${id}`).then((res: Practitioner) => res)
  );

  const practitionerAssigned = await Promise.all(practitionerAssignedPromise);

  return { ...team, practitioners: practitionerAssigned };
}
