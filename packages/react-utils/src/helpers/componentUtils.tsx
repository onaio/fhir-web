/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Route, RouteProps, RouteComponentProps, useLocation } from 'react-router';
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
  const { permissions, ...otherProps } = props;
  const CPRProps = {
    ...otherProps,
    keycloakBaseURL: configs.keycloakBaseURL,
    opensrpBaseURL: configs.opensrpBaseURL,
    fhirBaseURL: configs.fhirBaseURL,
  };
  const { t } = useTranslation();

  return (
    <RbacCheck
      permissions={permissions}
      fallback={
        <UnauthorizedPage
          title={t('403')}
          errorMessage={t('Sorry, you are not authorized to access this page')}
        />
      }
    >
      <ConnectedPrivateRoute {...CPRProps} />
    </RbacCheck>
  );
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
