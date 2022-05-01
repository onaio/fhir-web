import { ConnectedAPICallback, RouteParams, APICallbackProps } from '@onaio/gatekeeper';
import { getUser, User } from '@onaio/session-reducer';
import { trimStart } from 'lodash';
import querystring from 'querystring';
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { EXPRESS_OAUTH_GET_STATE_URL } from '../../../configs/env';
import { URL_EXPRESS_LOGIN, URL_HOME, URL_LOGOUT } from '../../../constants';
import { store } from '@opensrp/store';
import { Spin } from 'antd';
import { sendSuccessNotification } from '@opensrp/notifications';
import { useTranslation } from '../../../mls';
import { TFunction } from 'i18next';
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
export const nextIsValid = (props: RouteComponentProps): boolean => {
  let response = true;
  const indirectionURLs = [URL_LOGOUT];
  /** we should probably sieve some routes from being passed on.
   * For instance we don't need to redirect to logout since we are already in
   * the Unsuccessful Login component, meaning we are already logged out.
   */
  const stringifiedUrls = indirectionURLs.map((url) => querystring.stringify({ next: url }));
  for (const url of stringifiedUrls) {
    if (props.location.search.includes(url)) {
      response = false;
      break;
    }
  }
  return response;
};

export const BaseSuccessfulLoginComponent: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  let pathToRedirectTo = URL_HOME;
  const { t } = useTranslation();

  if (nextIsValid(props)) {
    const searchString = trimStart(props.location.search, '?');
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
  return <Redirect to={pathToRedirectTo} />;
};

export const SuccessfulLoginComponent = withRouter(BaseSuccessfulLoginComponent);

const BaseUnsuccessfulLogin: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  let redirectTo = `${URL_EXPRESS_LOGIN}${props.location.search}`;
  if (!nextIsValid(props)) {
    redirectTo = URL_EXPRESS_LOGIN;
  }

  window.location.href = redirectTo;
  return <></>;
};

export const UnSuccessfulLogin = withRouter(BaseUnsuccessfulLogin);

const CustomConnectedAPICallBack: React.FC<RouteComponentProps<RouteParams>> = (props) => {
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
