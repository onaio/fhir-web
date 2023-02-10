import { Providers } from '@onaio/gatekeeper';
import {
  ENABLE_OPENSRP_OAUTH,
  OPENSRP_ACCESS_TOKEN_URL,
  OPENSRP_AUTHORIZATION_URL,
  OPENSRP_CLIENT_ID,
  DOMAIN_NAME,
  OPENSRP_OAUTH_STATE,
  OPENSRP_USER_URL,
  OPENSRP_OAUTH_SCOPES,
} from './env';

/** Authentication Configs */
const providers: Providers = {};
if (ENABLE_OPENSRP_OAUTH) {
  providers.OpenSRP = {
    accessTokenUri: OPENSRP_ACCESS_TOKEN_URL,
    authorizationUri: OPENSRP_AUTHORIZATION_URL,
    clientId: OPENSRP_CLIENT_ID,
    redirectUri: `${DOMAIN_NAME}/oauth/callback/OpenSRP/`,
    scopes: OPENSRP_OAUTH_SCOPES,
    state: OPENSRP_OAUTH_STATE,
    userUri: OPENSRP_USER_URL,
  };
}

export { providers };
