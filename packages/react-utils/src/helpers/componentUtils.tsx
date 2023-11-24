/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Route, RouteProps, RouteComponentProps, useLocation, Redirect } from 'react-router';
import { getAllConfigs } from '@opensrp/pkg-config';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { UnauthorizedPage } from '../components/UnauthorizedPage';
import { useTranslation } from '../mls';
import { RbacCheck } from '@opensrp/rbac';

const configs = getAllConfigs();

/** Private/Public component props */
interface ComponentProps extends Partial<RouteProps> {
  component: any;
  redirectPath: string;
  disableLoginProtection: boolean;
  path: string;
  keycloakBaseURL?: string;
  opensrpBaseURL?: string;
  fhirBaseURL?: string;
  permissions: string[];
}

/**
 * Util wrapper around ConnectedPrivateRoute to render components
 *  that use private routes/ require authentication
 *
 * @param props - Component props object
 */

export const PrivateComponent = (props: ComponentProps) => {
  //  props to pass on to Connected Private Route
  const { permissions, component: WrappedComponent, ...otherProps } = props;

  const { t } = useTranslation();

  // const RbacWrappedComponent = (props: Record<string, unknown>) => (
  //   <RbacCheck
  //     permissions={permissions}
  //     fallback={
  //       <UnauthorizedPage
  //         title={t('403')}
  //         errorMessage={t('Sorry, you are not authorized to access this page')}
  //       />
  //     }
  //   >
  //     <WrappedComponent {...props} />
  //   </RbacCheck>
  // );

  const CPRProps = {
    ...otherProps,
    permissions,
    component: WrappedComponent,
    keycloakBaseURL: configs.keycloakBaseURL,
    opensrpBaseURL: configs.opensrpBaseURL,
    fhirBaseURL: configs.fhirBaseURL,
  };

  return <ConnectedPrivateRoute {...CPRProps} />;
};

/**
 * Util wrapper around Route for rendering components
 *  that use public routes/ dont require authentication
 *
 * @param props - Component props object
 */

export const PublicComponent = ({ component: Component, ...rest }: Partial<ComponentProps>) => {
  // get current pathname - to be passed as unique key to ConnectedPrivateRoute
  const { pathname } = useLocation();
  return (
    <Route
      {...rest}
      component={(props: RouteComponentProps) => <Component {...props} key={pathname} />}
    />
  );
};

/**
 * Util function to check if user is authorized to access a particular page
 *
 * @param {string[]} roles - list of all user roles from keycloak
 * @param {string[]} activeRoles - list of roles required to access a module/page
 */
export const isAuthorized = (roles: string[], activeRoles: string[]) => {
  return activeRoles.some((r: string) => roles.includes(r));
};

/** Dry-ed out form layout configs */

/** responsive layout for the form labels and columns */
export const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 16,
    },
    lg: {
      span: 14,
    },
  },
};

export const tailLayout = {
  wrapperCol: {
    xs: { offset: 0, span: 16 },
    sm: { offset: 12, span: 24 },
    md: { offset: 8, span: 16 },
    lg: { offset: 6, span: 14 },
  },
};



/** interface for PrivateRoute props */
interface PrivateRouteProps extends RouteProps {
  authenticated: boolean /** is the current user authenticated */;
  disableLoginProtection: boolean /** should we disable login protection */;
  redirectPath: string /** redirect to this path is use if not authenticated */;
  routerDisabledRedirectPath: string /** redirect to this path if router is not enabled */;
  routerEnabled: boolean /** is this route enabled */;
  permissions: any;
}

/** declare default props for PrivateRoute */
const defaultPrivateRouteProps: Partial<PrivateRouteProps> = {
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
const PrivateRoute = (props: PrivateRouteProps) => {
  const {
    component: Component,
    authenticated,
    disableLoginProtection,
    redirectPath,
    routerEnabled,
    routerDisabledRedirectPath,
    location,
    permissions,
    ...theOtherProps
  } = props;

  /** recreates the url : the path; query string if any; a hash tag if any */
  const currentPath = `${(location && location.pathname) || ''}${(location && location.search) ||
    ''}${(location && location.hash) || ''}`;
  // we can now create the full redirect path, append next searchParma
  const fullRedirectPath = `${redirectPath}?next=${currentPath}`;

  return (
    /* tslint:disable jsx-no-lambda */
    <Route
      {...theOtherProps}
      render={routeProps => {
        if (routerEnabled) {
          return (authenticated === true || disableLoginProtection === true) && Component ? (
            <RbacCheck
              permissions={permissions}
              fallback={
                <UnauthorizedPage
                  title={('403')}
                  errorMessage={('Sorry, you are not authorized to access this page')}
                />
              }
            >
              <Component {...routeProps} {...theOtherProps} />
            </RbacCheck>
          ) : (
            <Redirect to={fullRedirectPath} />
          );
        } else {
          return <Redirect to={routerDisabledRedirectPath} />;
        }
      }}
    />
    /* tslint:enable jsx-no-lambda */
  );
};

PrivateRoute.defaultProps = defaultPrivateRouteProps;

export { PrivateRoute }; // export the un-connected component