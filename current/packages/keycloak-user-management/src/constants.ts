// Web URLs
export const URL_ADMIN = '/admin';
export const URL_USER_EDIT = URL_ADMIN + '/users/edit';
export const URL_USER = URL_ADMIN + '/users';
export const URL_USER_GROUPS = `${URL_ADMIN}/users/groups`;
export const URL_USER_ROLES = `${URL_ADMIN}/users/roles`;
export const URL_USER_GROUP_EDIT = `${URL_ADMIN}/users/groups/edit`;
export const URL_USER_CREATE = URL_ADMIN + '/users/new';
export const URL_USER_GROUP_CREATE = `${URL_ADMIN}/users/groups/new`;
export const URL_USER_CREDENTIALS = URL_ADMIN + '/users/credentials';
export const ORGANIZATION_BY_PRACTITIONER = 'organization/by-practitioner';

// Route params
export const ROUTE_PARAM_USER_ID = 'userId';
export const ROUTE_PARAM_USER_GROUP_ID = 'userGroupId';

// Keycloak API URLs
export const KEYCLOAK_URL_USERS = '/users';
export const KEYCLOAK_URL_USERS_COUNT = '/users/count';
export const KEYCLOAK_URL_USER_GROUPS = '/groups';
export const KEYCLOAK_URL_USER_ROLES = '/roles';
export const KEYCLOAK_URL_AVAILABLE_ROLES = '/role-mappings/realm/available';
export const KEYCLOAK_URL_ASSIGNED_ROLES = '/role-mappings/realm';
export const KEYCLOAK_URL_EFFECTIVE_ROLES = '/role-mappings/realm/composite';
export const KEYCLOAK_URL_RESET_PASSWORD = '/reset-password';
export const KEYCLOAK_URL_REQUIRED_USER_ACTIONS = '/authentication/required-actions/';

// OpenSRP API strings
export const PRACTITIONER = 'practitioner';
export const OPENSRP_CREATE_PRACTITIONER_ENDPOINT = `${PRACTITIONER}/user`;

// practitioner role
export const DELETE_PRACTITIONER_ROLE = 'practitionerRole/delete/';

// Query params
export const SEARCH_QUERY_PARAM = 'searchQuery';

export const UserQueryId = 'User';

export const SUPERVISOR = 'supervisor';
export const SUPERVISOR_USER_TYPE_CODE = '236321002';
export const PRACTITIONER_USER_TYPE_CODE = '405623001';
