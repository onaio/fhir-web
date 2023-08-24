import { ConnectedAPICallback, RouteParams, APICallbackProps } from '@onaio/gatekeeper';
import { getUser, User } from '@onaio/session-reducer';
import { trimStart } from 'lodash';
import querystring from 'querystring';
import React from 'react';
import { Navigate, Location, useLocation, withRouter } from 'react-router';
import { EXPRESS_OAUTH_GET_STATE_URL } from '../../../configs/env';
import { URL_EXPRESS_LOGIN, URL_HOME, URL_LOGOUT } from '../../../constants';
import { store } from '@opensrp/store';
import { Spin } from 'antd';
import { sendSuccessNotification } from '@opensrp/notifications';
import { useTranslation } from '../../../mls';
import type { TFunction } from '@opensrp/i18n';
/**
 * antd notification popup.
 *
 * @param {user} user details object
 */
export const openNotification = (user: User, t: TFunction): void => {
  sendSuccessNotification(`Welcome back, ${user.username}`);
};

/** checks if the value of next in searchParam is blacklisted
 *
 * @param {RouteComponentProps} props - the props should contain the routing state.
 * @returns {boolean} return the response
 */
export const nextIsValid = (location: Location): boolean => {
  let response = true;
  const indirectionURLs = [URL_LOGOUT];
  /** we should probably sieve some routes from being passed on.
   * For instance we don't need to redirect to logout since we are already in
   * the Unsuccessful Login component, meaning we are already logged out.
   */
  const stringifiedUrls = indirectionURLs.map((url) => querystring.stringify({ next: url }));
  for (const url of stringifiedUrls) {
    if (location.search.includes(url)) {
      response = false;
      break;
    }
  }
  return response;
};

export const BaseSuccessfulLoginComponent: React.FC = () => {
  let pathToRedirectTo = URL_HOME;
  const { t } = useTranslation();
  const location = useLocation();

  if (nextIsValid(location)) {
    const searchString = trimStart(location.search, '?');
    const searchParams = querystring.parse(searchString);
    const nextPath = searchParams.next as string | undefined;

    if (nextPath) {
      pathToRedirectTo = nextPath;
    }
    if (nextPath === '/') {
      const user = getUser(store.getState());
      openNotification(user, t);
    }
  }
  return <Navigate to={pathToRedirectTo} replace />;
};

export const SuccessfulLoginComponent = BaseSuccessfulLoginComponent;

const BaseUnsuccessfulLogin: React.FC = (props) => {
  const location = useLocation();
  let redirectTo = `${URL_EXPRESS_LOGIN}${location.search}`;
  if (!nextIsValid(location)) {
    redirectTo = URL_EXPRESS_LOGIN;
  }

  window.location.href = redirectTo;
  return <></>;
};

export const UnSuccessfulLogin = BaseUnsuccessfulLogin;

const CustomConnectedAPICallBack: React.FC<RouteParams> = (props) => {
  const unifiedProps = {
    LoadingComponent: () => <Spin size="large" className="custom-spinner" />,
    UnSuccessfulLoginComponent: UnSuccessfulLogin,
    SuccessfulLoginComponent: SuccessfulLoginComponent,
    apiURL: EXPRESS_OAUTH_GET_STATE_URL,
    ...props,
    // ts bug - default props not working, ts asking for default props to be repassed https://github.com/microsoft/TypeScript/issues/31247
  } as unknown as APICallbackProps<RouteParams>;
  return <ConnectedAPICallback {...unifiedProps} />;
};

export default CustomConnectedAPICallBack;