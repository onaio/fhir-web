import { isAuthenticated } from '@onaio/session-reducer';
import queryString from 'querystring';
import React from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet, PathRouteProps, Route, RouteProps, Routes, useLocation } from 'react-router-dom';
import { Store } from 'redux';

/** interface for PrivateRoute props */
interface AuthLayoutProps {
  authenticated: boolean /** is the current user authenticated */;
  disableLoginProtection: boolean /** should we disable login protection */;
  redirectPath: string /** redirect to this path is use if not authenticated */;
  routerDisabledRedirectPath: string /** redirect to this path if router is not enabled */;
  routerEnabled: boolean /** is this route enabled */;
}

/** declare default props for PrivateRoute */
const defaultPrivateRouteProps: Partial<AuthLayoutProps> = {
  authenticated: false,
  disableLoginProtection: false,
  redirectPath: '/login',
  routerDisabledRedirectPath: '/',
  routerEnabled: true
};

/** The PrivateRoute component
 * This component is a simple wrapper around Route and takes all its props in
 * addition to:
 *  1. {bool} authenticated
 *  2. {string} redirectPath
 *
 * If authenticated === true then render the component supplied
 * Otherwise redirect to the redirectPath
 */
export const AuthLayout = (props: AuthLayoutProps) => {
  const {
    authenticated,
    disableLoginProtection,
    redirectPath,
    routerEnabled,
    routerDisabledRedirectPath,
  } = props;

  console.log({ props });
  const location = useLocation();

  /** recreates the url : the path; query string if any; a hash tag if any */
  const currentPath = `${(location && location.pathname) || ''}${(location && location.search) ||
    ''}${(location && location.hash) || ''}`;
  // we can now create the full redirect path, append next searchParma
  const fullRedirectPath = `${redirectPath}?${queryString.stringify({ next: currentPath })}`;

  if (routerEnabled) {
    if (authenticated === true || disableLoginProtection === true) {
      return <Outlet />;
    } else {
      return <Navigate to={fullRedirectPath} />
    }
  }
  // If user is authenticated go to outlet else redirect to full redirect path
  return <Navigate to={routerDisabledRedirectPath} />;
};

AuthLayout.defaultProps = defaultPrivateRouteProps;
  
/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  authenticated: boolean;
}

/** map state to props */
const mapStateToProps = (
  state: Partial<Store>,
  ownProps: Partial<AuthLayoutProps>
): DispatchedStateProps => {
  const result = {
    authenticated: isAuthenticated(state)
  };
  Object.assign(result, ownProps);
  return result;
};

/** create connected component */

/** The ConnectedPrivateRoute component
 * This component is a simple wrapper around Route and takes all its props in
 * addition to:
 *  1. {bool} authenticated - this comes from the Redux store
 *  2. {string} redirectPath
 *
 * If authenticated === true then render the component supplied
 * Otherwise redirect to the redirectPath
 */
const ConnectedPrivateRoute = connect<DispatchedStateProps, null, any>(
  mapStateToProps,
  null
)(AuthLayout);

export default ConnectedPrivateRoute;
