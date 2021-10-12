import { Organization, PractitionerRole, OrganizationDetail } from '.';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { FHIR_RESOURCES_PAGE_SIZE } from './constants';

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
  const fhirParams = {
    _count: FHIR_RESOURCES_PAGE_SIZE,
    _getpagesoffset: 0,
  };

  const AllRoles: PractitionerRole[] =
    props.PractitionerRoles ??
    (await serve.list(fhirParams).then((res) => res.entry.map((e) => e.resource)));

  const practitionerAssigned = AllRoles.filter(
    (role) => role.organization.reference === `Organization/${team.id}`
  ).map((role) => ({
    id: role.practitioner.reference.split('/')[1],
    name: role.practitioner.display,
  }));

  return { ...team, practitionerInfo: practitionerAssigned };
}
