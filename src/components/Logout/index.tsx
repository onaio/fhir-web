import { logout } from '@opensrp/server-logout';
import React from 'react';
import { useHistory } from 'react-router';
import { DOMAIN_NAME, KEYCLOAK_LOGOUT_URL, OPENSRP_LOGOUT_URL } from '../../configs/env';
import { getPayloadOptions } from '../../services';
import Ripple from '../page/Loading';

/** HOC function that calls function that logs out the user from both opensrp
 * and keycloak
 */
export const CustomLogout = () => {
  const history = useHistory();
  const payload = getPayloadOptions(new AbortController().signal, 'GET');
  const redirectUri = DOMAIN_NAME;
  logout(payload, OPENSRP_LOGOUT_URL, KEYCLOAK_LOGOUT_URL, redirectUri).catch((error) => {
    console.error(error); // refactor to show growl error
    history.push('/');
  });
  return <Ripple />;
};
