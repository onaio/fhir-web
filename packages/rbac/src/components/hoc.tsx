import { createContext, ReactNode, useContext } from 'react';
import { useSelector } from 'react-redux';
import * as keycloakAdapter from '../adapters/keycloakAdapter';
import { getConfig, KeycloakStrategies } from '@opensrp/pkg-config';
import { getExtraData } from '@onaio/session-reducer';
import React from 'react';
import { UserRole } from '../roleDefinition';
import { RbacAdapter } from '../helpers/types';

export interface RbacProps {
  permissions: string[];
  matchStrategy?: 'exact' | 'any' | 'none';
  children?: JSX.Element | null;
  fallback?: JSX.Element; // TODO - whats the difference.
}

const iamStrategiesLookup: Record<KeycloakStrategies, RbacAdapter> = {
  keycloak: keycloakAdapter.adapter,
};

/**
 * HOC that checks if user has required roles to see the nested component tree.
 *
 * @param props - component props
 */
export function RbacCheck(props: RbacProps) {
  const { permissions, children, fallback } = props;
  const userRole = useUserRole();

  // might actually need the adapter knowledge to understand how to translate string roles - for the poc
  // constraining the requiredRoles to be of type of Role only.
  if (userRole.hasPermissions(permissions)) {
    if (children) {
      return children;
    }
  }
  //   if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //     console.warn("")
  // } else {
  //     // production code
  // }
  return fallback ?? null;
}

const defaultUserRole = new UserRole();
export const RoleContext = createContext<UserRole>(defaultUserRole);

export interface RbacProviderProps {
  children: ReactNode;
}
/**
 * Provides the userRole context to tree.
 *
 * @param props - props
 */
export function RbacProvider(props: RbacProviderProps) {
  const { children } = props;
  const userRole = useStoreUserRole();
  return <RoleContext.Provider value={userRole}>{children}</RoleContext.Provider>;
}

/**
 *
 */
export function useStoreUserRole() {
  // gest session information from the session-reducer;
  // - depends on session-reducer.
  // - peer on redux
  // create context with role object.
  const extraData = useSelector((state) => getExtraData(state));
  // const authenticated = useSelector((state) => isAuthenticated(state));
  const { roles } = extraData;

  // if not authenticated then jump to no permission fallback. - or we can just concern ourselves
  // with roles only.

  const iamStrategy = getConfig('rbacStrategy') ?? 'keycloak';
  const strategy = iamStrategiesLookup[iamStrategy];
  // TODO - why does this return undefined sometimes
  const userRole = (strategy(roles) as UserRole | undefined) ?? defaultUserRole;
  return userRole;
}

/**
 *
 */
export function useUserRole() {
  const userRole = useContext(RoleContext);
  return userRole;
}
