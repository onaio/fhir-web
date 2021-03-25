/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { getExtraData, isAuthenticated } from '@onaio/session-reducer';
import { getAllConfigs } from '@opensrp/pkg-config';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { UnauthorizedPage } from '../components/UnauthorizedPage';
import lang from '../lang';

const configs = getAllConfigs();

/** Private/Public component props */
interface ComponentProps extends Partial<RouteProps> {
  component: any;
  redirectPath: string;
  disableLoginProtection: boolean;
  path: string;
  activeRoles?: string[];
  keycloakBaseURL?: string;
  opensrpBaseURL?: string;
}

/** Util wrapper around ConnectedPrivateRoute to render components
 *  that use private routes/ require authentication
 *
 * @param props - Component props object
 */

export const PrivateComponent = (props: ComponentProps) => {
  //  props to pass on to Connected Private Route
  const CPRProps = {
    ...props,
    keycloakBaseURL: configs.keycloakBaseURL,
    opensrpBaseURL: configs.opensrpBaseURL,
    fhirBaseURL: configs.fhirBaseURL,
  };
  const extraData = useSelector((state) => getExtraData(state));
  const authenticated = useSelector((state) => isAuthenticated(state));
  const { roles } = extraData;
  const { activeRoles } = props;
  if (authenticated) {
    if (activeRoles && roles && isAuthorized(roles, activeRoles)) {
      return <ConnectedPrivateRoute {...CPRProps} />;
    } else {
      return <UnauthorizedPage title={lang.FORBIDDEN_PAGE_STATUS} />;
    }
  }
  return <ConnectedPrivateRoute {...CPRProps} />;
};

/** Util wrapper around Route for rendering components
 *  that use public routes/ dont require authentication
 *
 * @param props - Component props object
 */

export const PublicComponent = ({ component: Component, ...rest }: Partial<ComponentProps>) => {
  return <Route {...rest} component={(props: RouteComponentProps) => <Component {...props} />} />;
};

/** Util function to check if user is authorized to access a particular page
 *
 * @param {string[]} roles - list of all user roles from keycloak
 * @param {string[]} activeRoles - list of roles required to access a module/page
 */
export const isAuthorized = (roles: string[], activeRoles: string[]) => {
  return activeRoles.some((r: string) => roles.includes(r));
};
