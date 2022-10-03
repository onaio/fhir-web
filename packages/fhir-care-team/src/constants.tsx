// url

// Query patams
export const SEARCH_QUERY_PARAM = 'searchQuery';

// FHIR API strings
export const careTeamResourceType = 'CareTeam';
export const groupResourceType = 'Group';
export const practitionerResourceType = 'Practitioner';
export const organizationResourceType = 'Organization';
export const URL_ADMIN = '/admin';
export const FHIR_CARE_TEAM = 'CareTeam';
export const FHIR_GROUPS = 'Group';
export const FHIR_PRACTITIONERS = 'Practitioner';
export const URL_EDIT_CARE_TEAM = `${URL_ADMIN}/CareTeam/edit`;
export const URL_CREATE_CARE_TEAM = `${URL_ADMIN}/CareTeam/new`;
export const URL_CARE_TEAM = `${URL_ADMIN}/CareTeams`;

// Route params
export const ROUTE_PARAM_CARE_TEAM_ID = 'careTeamId';

// form magic strings
export const uuid = 'uuid' as const;
export const id = 'id' as const;
export const name = 'name' as const;
export const status = 'status' as const;
export const practitionerParticipants = 'practitionerParticipants' as const;
export const organizationParticipants = 'organizationParticipants' as const;
export const managingOrganizations = 'managingOrganizations' as const;
