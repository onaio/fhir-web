// url
export const URL_ADD_TEAM = 'teams/add';
export const URL_EDIT_TEAM = 'teams/edit';

//
// Practitioner
//
export const PRACTITIONER_GET = 'practitioner';
export const PRACTITIONER_COUNT = `${PRACTITIONER_GET}/count/`;
export const PRACTITIONER_ROLE = 'practitionerRole';
export const PRACTITIONER_POST = `${PRACTITIONER_ROLE}/add/`;
export const PRACTITIONER_DEL = `${PRACTITIONER_ROLE}/deleteByPractitioner`;

//
// Teams
//
export const TEAMS_GET = 'organization/';
export const TEAMS_COUNT = 'organization/count';
export const TEAMS_PUT = 'organization/';
export const TEAMS_POST = 'organization';
export const TEAMS_SEARCH = 'organization/search';
export const TEAM_PRACTITIONERS = 'organization/practitioner/';

export const ASSIGNED_LOCATIONS_AND_PLANS = 'assignedLocationsAndPlans/';

// Query patams
export const SEARCH_QUERY_PARAM = 'searchQuery';

export const OPENSRP_API_BASE_URL = 'https://opensrp-staging.smartregister.org/opensrp/rest/';

// router routes
export const TEAM_ASSIGNMENT_LIST_VIEW_URL = '/team-assignment';
export const TEAM_ASSIGNMENT_EDIT_VIEW_URL = '/team-assignment/edit';
export const TEAM_ASSIGNMENT_CREATE_VIEW_URL = 'team-assignment/new';
export const ORGANIZATION_ENDPOINT = 'organization';
export const HOME_URL = '/';
export const LOCATION_HIERARCHY_ENDPOINT = 'location/hierarchy';
export const ORGANIZATION_COUNT_ENDPOINT = 'organization/count';
export const PLANS_ENDPOINT = 'plans';
export const POST_ASSIGNMENTS_ENDPOINT = 'organization/assignLocationsAndPlans';
export const ASSIGNMENTS_ENDPOINT = 'organization/assignedLocationsAndPlans';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'team-assignment';
