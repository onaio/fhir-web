import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import * as keycloakAdapter from '../adapters/keycloakAdapter';
import { Role, sanitizeToArray } from '../utils/roleDefinition';
import { getConfig, KeycloakStrategies } from '@opensrp/pkg-config';

export interface RbacProps {
  requiredroles: Role[];
  children: ReactNode | JSX.Element;
  fallback?: ReactNode | JSX.Element; // TODO - whats the difference.
}

const iamStrategiesLookup: Record<KeycloakStrategies, any> = {
  keycloak: keycloakAdapter,
};

/**
 * HOC that checks if user has required roles to see the nested component tree.
 *
 * @param props - component props
 */
export function RbacCheck(props: RbacProps) {
  const { requiredroles, children, fallback } = props;
  const iamStrategy = getConfig('rbacStrategy') ?? 'keycloak';
  const strategy = iamStrategiesLookup[iamStrategy];
  const userRole = useSelector((state) => strategy.getUserRole(state));

  const requiredRolesArr = sanitizeToArray(requiredroles);

  // might actually need the adapter knowledge to understand how to translate string roles - for the poc
  // constraining the requiredRoles to be of type of Role only.
  if (userRole.hasRoles(requiredRolesArr)) {
    return children;
  } else {
    //   if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    //     console.warn("")
    // } else {
    //     // production code
    // }
    return fallback;
  }
}
