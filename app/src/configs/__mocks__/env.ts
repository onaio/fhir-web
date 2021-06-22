export const OPENSRP_API_BASE_URL = 'https://test.smartregister.org/opensrp/rest/';
export const KEYCLOAK_API_BASE_URL =
  'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
export const ENABLE_PRODUCT_CATALOGUE = true;
export const ENABLE_INVENTORY = true;
export const LANGUAGE_CODE = 'en';
export const PROJECT_LANGUAGE_CODE = 'eusm';
export const SUPPORTED_LANGUAGES = ['en', 'fr'];
export const ENABLE_LANGUAGE_SWITCHER = true;
export const ENABLE_OPENSRP_OAUTH = false;
export const OPENSRP_ROLES = {
  USERS: 'ROLE_EDIT_KEYCLOAK_USERS',
  PLANS: 'ROLE_VIEW_KEYCLOAK_USERS',
  LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
  CARD_SUPPORT: 'ROLE_VIEW_KEYCLOAK_USERS',
  INVENTORY: 'ROLE_VIEW_KEYCLOAK_USERS',
  TEAMS: 'ROLE_VIEW_KEYCLOAK_USERS',
  PRODUCT_CATALOGUE: 'ROLE_VIEW_KEYCLOAK_USERS',
  FORM_CONFIGURATION: 'ROLE_VIEW_KEYCLOAK_USERS',
};
export const MAIN_LOGO_SRC =
  'https://github.com/OpenSRP/web/raw/master/app/src/assets/images/opensrp-logo-color.png';
export const PLAN_ASSIGNMENT_AT_GEO_LEVEL = 1;

export const OPENSRP_LOGOUT_URL = 'https://opensrp-stage.smartregister.org/opensrp/logout.do';

export const OPENSRP_OAUTH_STATE = 'REACT_APP_OPENSRP_OAUTH_STATE';

// notice the ending is NOT / here
export const OPENSRP_ACCESS_TOKEN_URL =
  'https://opensrp-stage.smartregister.org/opensrp/oauth/token';

// notice the ending is NOT / here
export const OPENSRP_AUTHORIZATION_URL =
  'https://opensrp-stage.smartregister.org/opensrp/oauth/authorize';

export const NAVBAR_BRAND_IMG_SRC =
  'https://github.com/OpenSRP/opensrp-web/raw/master/clients/core/src/assets/images/logo.png';

export const KEYCLOAK_LOGOUT_URL =
  'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout';

/** Express server settings */
export const EXPRESS_OAUTH_GET_STATE_URL = 'http://localhost:3000/oauth/state';

export const EXPRESS_OAUTH_LOGOUT_URL = 'http://localhost:3000/logout';

export const DOMAIN_NAME = 'http://localhost:3000';
