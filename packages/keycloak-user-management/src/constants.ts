// Web URLs
export const URL_ADMIN = '/admin';
export const URL_USER_EDIT = URL_ADMIN + '/users/edit';
export const URL_USER = URL_ADMIN + '/users/list';
export const URL_USER_GROUPS = `${URL_ADMIN}/users/groups`;
export const URL_USER_GROUP_EDIT = `${URL_ADMIN}/users/groups/edit`;
export const URL_USER_CREATE = URL_ADMIN + '/users/new';
export const URL_USER_GROUP_CREATE = `${URL_ADMIN}/users/groups/new`;
export const URL_USER_CREDENTIALS = URL_ADMIN + '/users/credentials';

// Route params
export const ROUTE_PARAM_USER_ID = 'userId';
export const ROUTE_PARAM_USER_GROUP_ID = 'userGroupId';

// Keycloak API URLs
export const KEYCLOAK_URL_USERS = '/users';
export const KEYCLOAK_URL_USER_GROUPS = '/groups';
export const KEYCLOAK_URL_RESET_PASSWORD = '/reset-password';
export const KEYCLOAK_URL_REQUIRED_USER_ACTIONS = '/authentication/required-actions/';

// OpenSRP API strings
export const OPENSRP_CREATE_PRACTITIONER_ENDPOINT = 'practitioner/user';

// Query patams
export const SEARCH_QUERY_PARAM = 'searchQuery';
