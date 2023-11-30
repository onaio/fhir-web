import { isAuthenticated } from '@onaio/session-reducer';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteProps, Route, Redirect, useRouteMatch, useLocation } from 'react-router';
import { getAllConfigs } from '@opensrp/pkg-config';
import { RbacCheck } from '@opensrp/rbac';
import { UnauthorizedPage } from '../UnauthorizedPage';

const configs = getAllConfigs();

export const LOGIN_REDIRECT_URL_PARAM = 'next';

/** interface for PrivateRoute props */
interface PrivateRouteProps extends RouteProps {
  disableLoginProtection: boolean /** should we disable login protection */;
  redirectPath: string /** redirect to this path is use if not authenticated */;
  permissions: string[] /** string representing permissions required to view nested view */;
}

/** declare default props for PrivateRoute */
const defaultPrivateRouteProps: Partial<PrivateRouteProps> = {
  disableLoginProtection: false,
  redirectPath: '/login',
  permissions: [],
};

/**
 * Wrapper around route that makes sure user is authenticated and has the correct permission
 *
 * @param props - component props
 */
const PrivateRoute = (props: PrivateRouteProps) => {
  const allProps = {
    ...props,
    keycloakBaseURL: configs.keycloakBaseURL,
    opensrpBaseURL: configs.opensrpBaseURL,
    fhirBaseURL: configs.fhirBaseURL,
  };
  const { component, disableLoginProtection, redirectPath, permissions, ...routeProps } = allProps;
  const Component = component as unknown as typeof React.Component;

  const match = useRouteMatch();
  const location = useLocation();
  const authenticated = useSelector((state) => isAuthenticated(state));

  const nextUrl = match.path;
  const currentSParams = new URLSearchParams(location.search);
  currentSParams.set(LOGIN_REDIRECT_URL_PARAM, nextUrl);

  const fullRedirectPath = `${redirectPath}?${currentSParams.toString()}`;
  const okToRender = authenticated === true || disableLoginProtection === true;
  if (!okToRender) {
    return <Redirect to={fullRedirectPath} />;
  }

  return (
    <Route {...routeProps}>
      {(routeProps) => (
        <RbacCheck
          permissions={permissions}
          fallback={
            <UnauthorizedPage
              title={'403'}
              errorMessage={'Sorry, you are not authorized to access this page'}
            />
          }
        >
          <Component {...routeProps} {...allProps} />
        </RbacCheck>
      )}
    </Route>
  );
};

PrivateRoute.defaultProps = defaultPrivateRouteProps;

export { PrivateRoute };
