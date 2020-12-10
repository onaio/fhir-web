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

/** Do you want to disable login protection? */
export const DISABLE_LOGIN_PROTECTION = process.env.REACT_APP_DISABLE_LOGIN_PROTECTION === 'true';

/** Activate the product-catalogue menu */
export const ENABLE_PRODUCT_CATALOGUE = process.env.REACT_APP_ENABLE_PRODUCT_CATALOGUE === 'true';

/** Activate the plans menu */
export const ENABLE_PLANS = process.env.REACT_APP_ENABLE_PLANS === 'true';
