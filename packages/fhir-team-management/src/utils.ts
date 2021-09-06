import FHIR from 'fhirclient';
import { Organization, PractitionerRole, OrganizationDetail } from '.';
import { PRACTITIONERROLE_GET } from './constants';
import { FHIRResponse } from '@opensrp/react-utils';

/**
 * Function to load selected Team for details
 *
 * @param props function properties containing data
 * @param {Organization} props.team team to load data of
 * @param {string} props.fhirBaseURL base url to use for data loading
 * @param {PractitionerRole[]} props.PractitionerRoles All practioner roles to use for data mapiing
 */
export async function loadTeamPractitioner(props: {
  team: Organization;
  fhirBaseURL: string;
  PractitionerRoles?: PractitionerRole[];
}): Promise<OrganizationDetail> {
  const { fhirBaseURL, team } = props;
  const serve = FHIR.client(fhirBaseURL);

  const AllRoles: PractitionerRole[] =
    props.PractitionerRoles ??
    (await serve
      .request(PRACTITIONERROLE_GET)
      .then((res: FHIRResponse<PractitionerRole>) => res.entry.map((e) => e.resource)));

  const practitionerAssigned = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => ({
    id: role.practitioner.reference.split('/')[1],
    name: role.practitioner.display,
  }));

  return { ...team, practitionerInfo: practitionerAssigned };
}
