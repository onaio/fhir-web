import { setEnv } from './utils';

export const WEBSITE_NAME = setEnv('REACT_APP_WEBSITE_NAME', 'OpenSRP Web');

/** Activate the healthcare menu */
export const ENABLE_HEALTHCARE_SERVICES =
  setEnv('REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES', 'false') === 'true';

export const OPENSRP_OAUTH_SCOPES = setEnv('REACT_APP_OPENSRP_OAUTH_SCOPES', 'profile').split(',');

export const ENABLE_FHIR_GROUP = setEnv('REACT_APP_ENABLE_FHIR_GROUP', 'false') === 'true';

export const DEFAULT_ACTIVITY_DURATION_DAYS = Number(
  setEnv('REACT_APP_DEFAULT_ACTIVITY_DURATION_DAYS', 7)
);

export const PLAN_ASSIGNMENT_AT_GEO_LEVEL = Number(
  setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', 0)
);

export const MAIN_LOGO_SRC = setEnv(
  'REACT_APP_MAIN_LOGO_SRC',
  'https://github.com/OpenSRP/web/raw/main/app/src/assets/images/opensrp-logo-color.png'
);

export const DATE_FORMAT = setEnv('REACT_APP_DATE_FORMAT', 'YYYY-MM-DD');

export const DEFAULT_TIME = setEnv('REACT_APP_DEFAULT_TIME', 'T00:00:00+00:00');

export const ENABLE_FHIR_TEAMS = setEnv('REACT_APP_ENABLE_FHIR_TEAMS', 'false') === 'true';

/** Activate patients menu */
export const ENABLE_PATIENTS_MODULE = setEnv('REACT_APP_ENABLE_FHIR_PATIENTS', 'false') === 'true';

export const BACKEND_ACTIVE = setEnv('REACT_APP_BACKEND_ACTIVE', 'false') === 'true';

export const OPENSRP_LOGOUT_URL = setEnv('REACT_APP_OPENSRP_LOGOUT_URL', undefined);
export const OPENSRP_OAUTH_STATE = setEnv('REACT_APP_OPENSRP_OAUTH_STATE', 'opensrp');
export const ENABLE_OPENSRP_OAUTH = setEnv('REACT_APP_ENABLE_OPENSRP_OAUTH', 'false') === 'true';

// notice the ending is NOT / here
export const OPENSRP_ACCESS_TOKEN_URL = setEnv(
  'REACT_APP_OPENSRP_ACCESS_TOKEN_URL',
  'https://opensrp-stage.smartregister.org/opensrp/oauth/token'
);

// notice the ending is NOT / here
export const OPENSRP_AUTHORIZATION_URL = setEnv(
  'REACT_APP_OPENSRP_AUTHORIZATION_URL',
  'https://opensrp-stage.smartregister.org/opensrp/oauth/authorize'
);

export const OPENSRP_CLIENT_ID = setEnv('REACT_APP_OPENSRP_CLIENT_ID', '');

/** The domain name */
export const DOMAIN_NAME = setEnv('REACT_APP_DOMAIN_NAME', 'http://localhost:3000');

export const OPENSRP_USER_URL = setEnv(
  'REACT_APP_OPENSRP_USER_URL',
  'https://opensrp-stage.smartregister.org/opensrp/user-details'
);

export const NAVBAR_BRAND_IMG_SRC = setEnv(
  'REACT_APP_NAVBAR_BRAND_IMG_SRC',
  'https://github.com/OpenSRP/opensrp-web/raw/master/clients/core/src/assets/images/logo.png'
);

export const KEYCLOAK_LOGOUT_URL = setEnv(
  'REACT_APP_KEYCLOAK_LOGOUT_URL',
  'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout'
);

export const OPENSRP_API_BASE_URL = setEnv(
  'REACT_APP_OPENSRP_API_BASE_URL',
  'https://opensrp-stage.smartregister.org/opensrp/rest/'
);

export const OPENSRP_API_V2_BASE_URL = setEnv(
  'REACT_APP_OPENSRP_API_V2_BASE_URL',
  'https://opensrp-stage.smartregister.org/opensrp/rest/v2/'
);

export const KEYCLOAK_API_BASE_URL = setEnv(
  'REACT_APP_KEYCLOAK_API_BASE_URL',
  'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
);

/** Express server settings */
export const EXPRESS_OAUTH_GET_STATE_URL = setEnv(
  'REACT_APP_EXPRESS_OAUTH_GET_STATE_URL',
  'http://localhost:3000/oauth/state'
);

export const EXPRESS_OAUTH_LOGOUT_URL = setEnv(
  'REACT_APP_EXPRESS_OAUTH_LOGOUT_URL',
  'http://localhost:3000/logout'
);

/** Do you want to disable login protection? */
export const DISABLE_LOGIN_PROTECTION =
  setEnv('REACT_APP_DISABLE_LOGIN_PROTECTION', 'false') === 'true';

/** Activate the FHIR Care Team menu */
export const ENABLE_FHIR_CARE_TEAM = setEnv('REACT_APP_ENABLE_FHIR_CARE_TEAM', 'false') === 'true';

export const LANGUAGE_CODE = setEnv('REACT_APP_LANGUAGE_CODE', 'en');

export const PROJECT_CODE = setEnv('REACT_APP_PROJECT_CODE', 'eusm');

export const SUPPORTED_LANGUAGES = setEnv('REACT_APP_SUPPORTED_LANGUAGES', '').split(',');

export const ENABLE_LANGUAGE_SWITCHER =
  setEnv('REACT_APP_ENABLE_LANGUAGE_SWITCHER', 'false') === 'true';

export const ENABLE_FHIR_LOCATIONS = setEnv('REACT_APP_ENABLE_FHIR_LOCATIONS', 'false') === 'true';

export const ENABLE_FHIR_USER_MANAGEMENT =
  setEnv('REACT_APP_ENABLE_FHIR_USER_MANAGEMENT', 'false') === 'true';

export const FHIR_API_BASE_URL = setEnv(
  'REACT_APP_FHIR_API_BASE_URL',
  'https://fhir-auth.labs.smartregister.org/fhir'
);

export const ENABLE_TEAMS_ASSIGNMENT_MODULE =
  setEnv('REACT_APP_ENABLE_TEAMS_ASSIGNMENT_MODULE', 'false') === 'true';

export const KEYCLOAK_USERS_PAGE_SIZE = Number(setEnv('REACT_APP_KEYCLOAK_USERS_PAGE_SIZE', 20));

export const DISABLE_TEAM_MEMBER_REASSIGNMENT =
  setEnv('REACT_APP_DISABLE_TEAM_MEMBER_REASSIGNMENT', 'true') === 'true';

export const PAGINATION_SIZE = Number(setEnv('REACT_APP_PAGINATION_SIZE', 1000));

export const DEFAULTS_TABLE_PAGE_SIZE = Number(setEnv('REACT_APP_DEFAULTS_TABLE_PAGE_SIZE', 5));

export const FHIR_PATIENT_SORT_FIELDS = setEnv(
  'REACT_APP_FHIR_PATIENT_SORT_FIELDS',
  '-_lastUpdated'
).split(',');

export const FHIR_PATIENT_BUNDLE_SIZE = Number(setEnv('REACT_APP_FHIR_PATIENT_BUNDLE_SIZE', 5000));

export const FHIR_ROOT_LOCATION_ID = setEnv('REACT_APP_FHIR_ROOT_LOCATION_ID', '');

export const OPENSRP_WEB_VERSION = setEnv('REACT_APP_OPENSRP_WEB_VERSION', '');

export const SENTRY_CONFIGS = JSON.parse(setEnv('REACT_APP_SENTRY_CONFIG_JSON', '{}'));

export const ENABLE_QUEST = setEnv('REACT_APP_ENABLE_QUEST', 'false') === 'true';

export const ENABLE_FHIR_COMMODITY = setEnv('REACT_APP_ENABLE_FHIR_COMMODITY', 'false') === 'true';

export const COMMODITIES_LIST_RESOURCE_ID = setEnv('REACT_APP_COMMODITIES_LIST_RESOURCE_ID', '');

export const PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY = setEnv(
  'REACT_APP_PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY',
  undefined
);

export const AUTHZ_STRATEGY = setEnv('REACT_APP_AUTHZ_STRATEGY', 'keycloak');
