import { Organization, PractitionerRole, OrganizationDetail } from '.';
import { FHIRResponse, FHIRServiceClass } from '@opensrp/react-utils';

/**
 * Function to load selected Team for details
 *
 * @param props function properties containing data
 * @param {Organization} props.team team to load data of
 * @param {string} props.fhirBaseURL base url to use for data loading
 * @param {PractitionerRole[]} props.PractitionerRoles All practioner roles to use for data mapiing
 */
export async function loadTeamPractitionerInfo(props: {
  team: Organization;
  fhirBaseURL: string;
  PractitionerRoles?: PractitionerRole[];
}): Promise<OrganizationDetail> {
  const { fhirBaseURL, team } = props;
  const serve = new FHIRServiceClass<PractitionerRole>(fhirBaseURL, 'PractitionerRole');

  const AllRoles: PractitionerRole[] =
    props.PractitionerRoles ??
    (await serve
      .list()
      .then((res: FHIRResponse<PractitionerRole>) => res.entry.map((e) => e.resource)));

  const practitionerAssigned = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => ({
    id: role.practitioner.reference.split('/')[1],
    name: role.practitioner.display,
  }));

  return { ...team, practitionerInfo: practitionerAssigned };
}
