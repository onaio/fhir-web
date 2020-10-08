import { logout } from '@opensrp/server-logout';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import {
  DOMAIN_NAME,
  KEYCLOAK_LOGOUT_URL,
  OPENSRP_LOGOUT_URL,
  EXPRESS_OAUTH_LOGOUT_URL,
  BACKEND_ACTIVE,
} from '../../configs/env';
import { getFetchOptions } from '@opensrp/keycloak-service';
import Ripple from '../page/Loading';
import { getAccessToken } from '@onaio/session-reducer';
import store from '../../store';
import { sendErrorNotification } from '../../utils/Notification/Notifications';

/** HOC function that calls function that logs out the user from both opensrp
 * and keycloak
 */
export const CustomLogout: React.FC = (): JSX.Element => {
  const payload = getFetchOptions(
    new AbortController().signal,
    getAccessToken(store.getState()) as string,
    'GET'
  );
  const redirectUri = BACKEND_ACTIVE ? EXPRESS_OAUTH_LOGOUT_URL : DOMAIN_NAME;
  logout(payload, OPENSRP_LOGOUT_URL, KEYCLOAK_LOGOUT_URL, redirectUri).catch((error) => {
    sendErrorNotification(error);
    history.push('/');
  });
  return <Ripple />;
};
