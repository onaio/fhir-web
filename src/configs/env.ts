export const WEBSITE_NAME = process.env.REACT_APP_WEBSITE_NAME || 'OpenSRP Web';
export type WEBSITE_NAME = typeof WEBSITE_NAME;

export const BACKEND_ACTIVE = process.env.REACT_APP_BACKEND_ACTIVE === 'true';
export type BACKEND_ACTIVE = typeof BACKEND_ACTIVE;

export const OPENSRP_LOGOUT_URL =
  process.env.REACT_APP_OPENSRP_LOGOUT_URL ||
  'https://opensrp-stage.smartregister.org/opensrp/logout.do';
export type OPENSRP_LOGOUT_URL = typeof OPENSRP_LOGOUT_URL;
export const OPENSRP_OAUTH_STATE = process.env.REACT_APP_OPENSRP_OAUTH_STATE || 'opensrp';
export type OPENSRP_OAUTH_STATE = typeof OPENSRP_OAUTH_STATE;
export const ENABLE_OPENSRP_OAUTH = process.env.REACT_APP_ENABLE_OPENSRP_OAUTH === 'true';
export type ENABLE_OPENSRP_OAUTH = typeof ENABLE_OPENSRP_OAUTH;

// notice the ending is NOT / here
export const OPENSRP_ACCESS_TOKEN_URL =
  process.env.REACT_APP_OPENSRP_ACCESS_TOKEN_URL ||
  'https://reveal-stage.smartregister.org/opensrp/oauth/token';
export type OPENSRP_ACCESS_TOKEN_URL = typeof OPENSRP_ACCESS_TOKEN_URL;

// notice the ending is NOT / here
export const OPENSRP_AUTHORIZATION_URL =
  process.env.REACT_APP_OPENSRP_AUTHORIZATION_URL ||
  'https://reveal-stage.smartregister.org/opensrp/oauth/authorize';
export type OPENSRP_AUTHORIZATION_URL = typeof OPENSRP_AUTHORIZATION_URL;

export const OPENSRP_CLIENT_ID = process.env.REACT_APP_OPENSRP_CLIENT_ID || '';
export type OPENSRP_CLIENT_ID = typeof OPENSRP_CLIENT_ID;

/** The domain name */
export const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME || 'http://localhost:3000';
export type DOMAIN_NAME = typeof DOMAIN_NAME;

export const OPENSRP_USER_URL =
  process.env.REACT_APP_OPENSRP_USER_URL ||
  'https://reveal-stage.smartregister.org/opensrp/user-details';
export type OPENSRP_USER_URL = typeof OPENSRP_USER_URL;

export const NAVBAR_BRAND_IMG_SRC =
  process.env.REACT_APP_NAVBAR_BRAND_IMG_SRC ||
  'https://github.com/OpenSRP/opensrp-web/raw/master/clients/core/src/assets/images/logo.png';
export type NAVBAR_BRAND_IMG_SRC = typeof NAVBAR_BRAND_IMG_SRC;

export const KEYCLOAK_LOGOUT_URL =
  process.env.REACT_APP_KEYCLOAK_LOGOUT_URL ||
  'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout';
export type KEYCLOAK_LOGOUT_URL = typeof KEYCLOAK_LOGOUT_URL;

export const OPENSRP_API_BASE_URL =
  process.env.REACT_APP_OPENSRP_API_BASE_URL ||
  'https://reveal-stage.smartregister.org/opensrp/rest/';
export type OPENSRP_API_BASE_URL = typeof OPENSRP_API_BASE_URL;

export const KEYCLOAK_API_BASE_URL =
  process.env.REACT_APP_KEYCLOAK_API_BASE_URL ||
  'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
export type KEYCLOAK_API_BASE_URL = typeof KEYCLOAK_API_BASE_URL;

/** Express server settings */

export const EXPRESS_OAUTH_GET_STATE_URL =
  process.env.REACT_APP_EXPRESS_OAUTH_GET_STATE_URL || 'http://localhost:3000/oauth/state';
export type EXPRESS_OAUTH_GET_STATE_URL = typeof EXPRESS_OAUTH_GET_STATE_URL;

export const EXPRESS_OAUTH_LOGOUT_URL =
  process.env.REACT_APP_EXPRESS_OAUTH_LOGOUT_URL || 'http://localhost:3000/logout';
export type EXPRESS_OAUTH_LOGOUT_URL = typeof EXPRESS_OAUTH_LOGOUT_URL;
