import { URL_USER } from '@opensrp/user-management';

export const practitionerResourceType = 'Practitioner';
export const careTeamResourceType = 'CareTeam';
export const organizationResourceType = 'Organization';
export const groupResourceType = 'Group';
export const practitionerRoleResourceType = 'PractitionerRole';
export const keycloakRoleMappingsEndpoint = 'role-mappings';
export const practitionerDetailsResourceType = 'PractitionerDetail';

// keycloak endpoints strings
export const keycloakCountEndpoint = 'count';
export const keycloakGroupEndpoint = 'groups';
export const keycloakMembersEndpoint = 'members';

// router urls
export const USER_DETAILS_URL = `${URL_USER}/details`;

// form field names
export const NATIONAL_ID_FORM_FIELD = 'nationalId';
export const PHONE_NUMBER_FORM_FIELD = 'phoneNumber';

export const renderExtraFields = [NATIONAL_ID_FORM_FIELD, PHONE_NUMBER_FORM_FIELD];
