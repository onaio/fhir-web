/**
 * Returns a value in window._env_ or process.env or the defaultValue passed in.
 * @param name - The configurable name that is a property of the environment/configuration.
 * @param defaultValue - The default value to return the value is not defined in process.env and window._env_.
 */
function pick(name: string, defaultValue: any) {
  let { [name]: envValue } = process.env;
  let value = envValue === undefined ? defaultValue : envValue;

  if (typeof (window as any)._env_ === 'undefined') {
    return value;
  }
  let { [name]: confValue } = (window as any)._env_;

  return confValue === undefined ? value : confValue;
}

export const WEBSITE_NAME = pick('REACT_APP_WEBSITE_NAME', 'OpenSRP Web');

export const BACKEND_ACTIVE = pick('REACT_APP_BACKEND_ACTIVE', 'false') === 'true';

export const OPENSRP_LOGOUT_URL = pick(
  'REACT_APP_OPENSRP_LOGOUT_URL',
  'https://opensrp-stage.smartregister.org/opensrp/logout.do'
);
export const OPENSRP_OAUTH_STATE = pick('REACT_APP_OPENSRP_OAUTH_STATE', 'opensrp');
export const ENABLE_OPENSRP_OAUTH = pick('REACT_APP_ENABLE_OPENSRP_OAUTH', 'false') === 'true';

// notice the ending is NOT / here
export const OPENSRP_ACCESS_TOKEN_URL = pick(
  'REACT_APP_OPENSRP_ACCESS_TOKEN_URL',
  'https://reveal-stage.smartregister.org/opensrp/oauth/token'
);

// notice the ending is NOT / here
export const OPENSRP_AUTHORIZATION_URL = pick(
  'REACT_APP_OPENSRP_AUTHORIZATION_URL',
  'https://reveal-stage.smartregister.org/opensrp/oauth/authorize'
);

export const OPENSRP_CLIENT_ID = pick('REACT_APP_OPENSRP_CLIENT_ID', '');

/** The domain name */
export const DOMAIN_NAME = pick('REACT_APP_DOMAIN_NAME', 'http://localhost:3000');

export const OPENSRP_USER_URL = pick(
  'REACT_APP_OPENSRP_USER_URL',
  'https://reveal-stage.smartregister.org/opensrp/user-details'
);

export const NAVBAR_BRAND_IMG_SRC = pick(
  'REACT_APP_NAVBAR_BRAND_IMG_SRC',
  'https://github.com/OpenSRP/opensrp-web/raw/master/clients/core/src/assets/images/logo.png'
);

export const KEYCLOAK_LOGOUT_URL = pick(
  'REACT_APP_KEYCLOAK_LOGOUT_URL',
  'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout'
);

export const OPENSRP_API_BASE_URL = pick(
  'REACT_APP_OPENSRP_API_BASE_URL',
  'https://opensrp-stage.smartregister.org/opensrp/rest/'
);
export type OPENSRP_API_BASE_URL = typeof OPENSRP_API_BASE_URL;

export const KEYCLOAK_API_BASE_URL = pick(
  'REACT_APP_KEYCLOAK_API_BASE_URL',
  'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
);

/** Express server settings */
export const EXPRESS_OAUTH_GET_STATE_URL = pick(
  'REACT_APP_EXPRESS_OAUTH_GET_STATE_URL',
  'http://localhost:3000/oauth/state'
);

export const EXPRESS_OAUTH_LOGOUT_URL = pick(
  'REACT_APP_EXPRESS_OAUTH_LOGOUT_URL',
  'http://localhost:3000/logout'
);

/** Do you want to disable login protection? */
export const DISABLE_LOGIN_PROTECTION =
  pick('REACT_APP_DISABLE_LOGIN_PROTECTION', 'false') === 'true';

/** Activate the product-catalogue menu */
export const ENABLE_PRODUCT_CATALOGUE = pick('REACT_APP_ENABLE_PRODUCT_CATALOGUE', 'false') === 'true';
