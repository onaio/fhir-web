import { createContext, ReactNode, useContext } from 'react';
import { useSelector } from 'react-redux';
import * as keycloakAdapter from '../adapters/keycloakAdapter';
import { getConfig, KeycloakStrategies } from '@opensrp/pkg-config';
import { getExtraData } from '@onaio/session-reducer';
import React from 'react';
import { UserRole } from '../roleDefinition';
import { MatchStrategy, RbacAdapter } from '../helpers/types';

export interface RbacProps {
  permissions: string[];
  matchStrategy?: MatchStrategy;
  children?: JSX.Element | null;
  fallback?: JSX.Element;
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
  const { permissions, children, fallback, matchStrategy } = props;
  const userRole = useUserRole();

  if (userRole.hasPermissions(permissions, matchStrategy)) {
    if (children) {
      return children;
    }
  }

  // TODO - how can we quickly communicate (in dev mode) that there are permission
  // restrictions in force.

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
  const extraData = useSelector((state) => getExtraData(state));
  const { roles } = extraData;

  const iamStrategy = getConfig('rbacStrategy') ?? 'keycloak';
  const strategy = iamStrategiesLookup[iamStrategy];
  const userRole = (strategy(roles) as UserRole | undefined) ?? defaultUserRole;
  return userRole;
}

/**
 * Get userRole from RoleContext
 */
export function useUserRole() {
  const userRole = useContext(RoleContext);
  return userRole;
}
