import { customFetch, OpenSRPService } from '@opensrp/server-service';

/** allowed http methods */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Payload {
  headers: HeadersInit;
  method: HTTPMethod;
}

export const defaultErrorCallback = () => {
  return;
};

/**
 * custom function that logs user from both a keycloak authorization server
 * and the opensrp server
 *
 * @param payload - payload to add to the fetch request
 * @param keycloakLogoutUri - url to logout from keycloak
 * @param redirectUri - uri to redirect to after logout
 * @param opensrpLogoutUri - url to logout from opensrp
 * @param idTokenHint - when present keycloak can auto logout user.
 */
export const logout = async (
  payload: Payload,
  keycloakLogoutUri: string,
  redirectUri: string,
  opensrpLogoutUri?: string,
  idTokenHint?: string
) => {
  let filterParams = {};
  if (idTokenHint) {
    filterParams = {
      id_token_hint: idTokenHint,
      post_logout_redirect_uri: redirectUri,
    };
  }
  const fullKeycloakLogoutUri = OpenSRPService.getURL(keycloakLogoutUri, filterParams);
  const opensrpOptionalLogout = async () => {
    if (!opensrpLogoutUri) {
      return;
    }
    return await customFetch(opensrpLogoutUri, payload);
  };

  opensrpOptionalLogout()
    .then(() => {
      window.location.href = fullKeycloakLogoutUri;
    })
    .catch((error) => {
      throw error;
    });
  return null;
};
