import { logout } from '@opensrp/server-logout';
import React from 'react';
import {
  DOMAIN_NAME,
  KEYCLOAK_LOGOUT_URL,
  OPENSRP_LOGOUT_URL,
  EXPRESS_OAUTH_LOGOUT_URL,
  BACKEND_ACTIVE,
} from '../../configs/env';
import { getFetchOptions } from '@opensrp/keycloak-service';
import { getAccessToken, getExtraData } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { useHistory } from 'react-router';
import { useTranslation } from '../../mls';

/** HOC function that calls function that logs out the user from both opensrp
 * and keycloak.
 *
 * @returns {Function} returns Ripple component
 */
export const CustomLogout: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { oAuth2Data } = getExtraData(store.getState());
  const idTokenHint = oAuth2Data?.id_token;
  const payload = getFetchOptions(
    new AbortController().signal,
    getAccessToken(store.getState()) as string,
    'GET'
  );
  const redirectUri = BACKEND_ACTIVE ? EXPRESS_OAUTH_LOGOUT_URL : DOMAIN_NAME;
  const history = useHistory();
  logout(payload, KEYCLOAK_LOGOUT_URL, redirectUri, OPENSRP_LOGOUT_URL, idTokenHint).catch(
    (_: Error) => {
      sendErrorNotification(t('An error occurred'));
      history.push('/');
    }
  );
  return <Spin size="large" className="custom-spinner" />;
};
