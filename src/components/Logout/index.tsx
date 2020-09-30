import { logout } from '@opensrp/server-logout';
import React from 'react';
import { useHistory } from 'react-router';
import {
  DOMAIN_NAME,
  KEYCLOAK_LOGOUT_URL,
  OPENSRP_LOGOUT_URL,
  EXPRESS_OAUTH_LOGOUT_URL,
  BACKEND_ACTIVE,
} from '../../configs/env';
import { getPayloadOptions } from '../../services';
import Ripple from '../page/Loading';
import { notification } from 'antd';

/** HOC function that calls function that logs out the user from both opensrp
 * and keycloak.
 *
 * @returns {Function} returns Ripple component
 */
export const CustomLogout: React.FC = (): JSX.Element => {
  const history = useHistory();
  const payload = getPayloadOptions(new AbortController().signal, 'GET');
  const redirectUri = BACKEND_ACTIVE ? EXPRESS_OAUTH_LOGOUT_URL : DOMAIN_NAME;
  logout(payload, OPENSRP_LOGOUT_URL, KEYCLOAK_LOGOUT_URL, redirectUri).catch((error) => {
    notification.error({
      message: error,
      description: '',
    });
    history.push('/');
  });
  return <Ripple />;
};
