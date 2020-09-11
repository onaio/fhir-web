import { ConnectedAPICallback, RouteParams } from '@onaio/gatekeeper';
import { getUser, User } from '@onaio/session-reducer';
import { trimStart } from 'lodash';
import querystring from 'querystring';
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { notification } from 'antd';
import { EXPRESS_OAUTH_GET_STATE_URL } from '../../../configs/env';
import { EXPRESS_LOGIN_URL, HOME_URL, LOGOUT_URL } from '../../../constants';
import store from '../../../store';
import Loading from '../Loading';
/**
 * antd notification popup
 * @param user - user details object
 */
const openNotification = (user: User) => {
  const [api] = notification.useNotification();
  const { info } = api;
  info({
    message: `Welcome Back`,
    description: `${user.username}`,
  });
};

/** checks if the value of next in searchParam is blacklisted
 * @param {RouteComponentProps} props - the props should contain the routing state.
 */
export const nextIsValid = (props: RouteComponentProps): boolean => {
  let response = true;
  const indirectionURLs = [LOGOUT_URL];
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
  let pathToRedirectTo = HOME_URL;

  if (nextIsValid(props)) {
    const searchString = trimStart(props.location.search, '?');
    const searchParams = querystring.parse(searchString);
    const nextPath = searchParams.next as string | undefined;
    if (nextPath) {
      pathToRedirectTo = nextPath;
    }
    if (nextPath === '/') {
      const user = getUser(store.getState());
      openNotification(user);
    }
  }
  return <Redirect to={pathToRedirectTo} />;
};

export const SuccessfulLoginComponent = withRouter(BaseSuccessfulLoginComponent);

const BaseUnsuccessfulLogin: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  let redirectTo = `${EXPRESS_LOGIN_URL}${props.location.search}`;
  if (!nextIsValid(props)) {
    redirectTo = EXPRESS_LOGIN_URL;
  }

  window.location.href = redirectTo;
  return <></>;
};

export const UnSuccessfulLogin = withRouter(BaseUnsuccessfulLogin);

const CustomConnectedAPICallBack: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  return (
    <ConnectedAPICallback
      LoadingComponent={Loading}
      // tslint:disable-next-line: jsx-no-lambda
      UnSuccessfulLoginComponent={UnSuccessfulLogin}
      SuccessfulLoginComponent={SuccessfulLoginComponent}
      apiURL={EXPRESS_OAUTH_GET_STATE_URL}
      {...props}
    />
  );
};

export default CustomConnectedAPICallBack;
