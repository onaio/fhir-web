export const WEBSITE_NAME = process.env.REACT_APP_WEBSITE_NAME || 'OpenSRP Web';

export const BACKEND_ACTIVE = process.env.REACT_APP_BACKEND_ACTIVE === 'true';

export const OPENSRP_LOGOUT_URL =
  process.env.REACT_APP_OPENSRP_LOGOUT_URL ||
  'https://opensrp-stage.smartregister.org/opensrp/logout.do';
export const OPENSRP_OAUTH_STATE = process.env.REACT_APP_OPENSRP_OAUTH_STATE || 'opensrp';
export const ENABLE_OPENSRP_OAUTH = process.env.REACT_APP_ENABLE_OPENSRP_OAUTH === 'true';

// notice the ending is NOT / here
export const OPENSRP_ACCESS_TOKEN_URL =
  process.env.REACT_APP_OPENSRP_ACCESS_TOKEN_URL ||
  'https://reveal-stage.smartregister.org/opensrp/oauth/token';

// notice the ending is NOT / here
export const OPENSRP_AUTHORIZATION_URL =
  process.env.REACT_APP_OPENSRP_AUTHORIZATION_URL ||
  'https://reveal-stage.smartregister.org/opensrp/oauth/authorize';

export const OPENSRP_CLIENT_ID = process.env.REACT_APP_OPENSRP_CLIENT_ID || '';

/** The domain name */
export const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME || 'http://localhost:3000';

export const OPENSRP_USER_URL =
  process.env.REACT_APP_OPENSRP_USER_URL ||
  'https://reveal-stage.smartregister.org/opensrp/user-details';

export const NAVBAR_BRAND_IMG_SRC =
  process.env.REACT_APP_NAVBAR_BRAND_IMG_SRC ||
  'https://github.com/OpenSRP/opensrp-web/raw/master/clients/core/src/assets/images/logo.png';

export const KEYCLOAK_LOGOUT_URL =
  process.env.REACT_APP_KEYCLOAK_LOGOUT_URL ||
  'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout';

export const OPENSRP_API_BASE_URL =
  process.env.REACT_APP_OPENSRP_API_BASE_URL ||
  'https://opensrp-stage.smartregister.org/opensrp/rest/';

export const KEYCLOAK_API_BASE_URL =
  process.env.REACT_APP_KEYCLOAK_API_BASE_URL ||
  'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';

/** Express server settings */
export const EXPRESS_OAUTH_GET_STATE_URL =
  process.env.REACT_APP_EXPRESS_OAUTH_GET_STATE_URL || 'http://localhost:3000/oauth/state';

export const EXPRESS_OAUTH_LOGOUT_URL =
  process.env.REACT_APP_EXPRESS_OAUTH_LOGOUT_URL || 'http://localhost:3000/logout';

/** Sentry */
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || '';
/** Do you want to disable login protection? */
export const DISABLE_LOGIN_PROTECTION = process.env.REACT_APP_DISABLE_LOGIN_PROTECTION === 'true';

/** Activate the product-catalogue menu */
export const ENABLE_PRODUCT_CATALOGUE = process.env.REACT_APP_ENABLE_PRODUCT_CATALOGUE === 'true';

/** Activate the plans menu */
export const ENABLE_PLANS = process.env.REACT_APP_ENABLE_PLANS === 'true';

/** Activate the plans menu */
export const ENABLE_LOCATIONS = process.env.REACT_APP_ENABLE_LOCATIONS === 'true';

export const DATE_FORMAT = process.env.REACT_APP_DATE_FORMAT || 'yyyy-MM-DD';

export const DEFAULT_TIME = process.env.REACT_APP_DEFAULT_TIME || 'T00:00:00+00:00';

export const DEFAULT_PLAN_DURATION_DAYS = process.env.REACT_APP_DEFAULT_PLAN_DURATION_DAYS || 20;

export const DEFAULT_ACTIVITY_DURATION_DAYS =
  process.env.REACT_APP_DEFAULT_ACTIVITY_DURATION_DAYS || 7;

export const PLAN_UUID_NAMESPACE =
  process.env.REACT_APP_PLAN_UUID_NAMESPACE || '85f7dbbf-07d0-4c92-aa2d-d50d141dde00';

export const ACTION_UUID_NAMESPACE =
  process.env.REACT_APP_ACTION_UUID_NAMESPACE || '35968df5-f335-44ae-8ae5-25804caa2d86';

export const DEFAULT_PLAN_VERSION = process.env.REACT_APP_DEFAULT_PLAN_VERSION || '1';

export const TASK_GENERATION_STATUS = process.env.REACT_APP_TASK_GENERATION_STATUS || 'internal';

/** Activate form configuration */
export const ENABLE_FORM_CONFIGURATION = process.env.REACT_APP_ENABLE_FORM_CONFIGURATION === 'true';

export const LANGUAGE_CODE = process.env.REACT_APP_LANGUAGE_CODE || 'en';

export const PROJECT_LANGUAGE_CODE = process.env.REACT_APP_PROJECT_LANGUAGE_CODE || 'eusm';
