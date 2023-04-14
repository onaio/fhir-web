import { getExtraData } from '@onaio/session-reducer/dist/types';
import { toUpper } from 'lodash';
import { Store } from 'redux';
import { VerbPermission } from '../constants';
import {
  FhirResourceTypeKeys,
  fhirResourceTypeMap,
  Role,
  ResourceType,
  VerbPermissionKeys,
  verbPermissionMap,
  IAMResourceType,
} from '../utils/roleDefinition';

export interface RbacAdapter {
  (roles: string[]): Role;
}

export const parseFHirRoles = (role: string) => {
  const roleParts = role.split('_');
  if (roleParts.length !== 2) {
    return;
  }
  const [verb, resourceType] = roleParts.map(toUpper);
  // look up in resource Map and verb Maps
  const verbPermission = verbPermissionMap.get(verb as VerbPermissionKeys);
  const resource = fhirResourceTypeMap.get(resourceType as FhirResourceTypeKeys) as
    | ResourceType
    | undefined;
  if (resource && verbPermission) {
    return new Role(resource, verbPermission);
  }
  return;
};

const keycloakRoleMappings: Record<string, Role> = {
  'realm-admin': new Role(
    [IAMResourceType.GROUP, IAMResourceType.ROLE, IAMResourceType.USER],
    VerbPermission.MANAGE
  ),
};

export const parseKeycloakRoles = (stringRole: string) => {
  const lookedURole = keycloakRoleMappings[stringRole] as Role | undefined;
  if (lookedURole !== undefined) {
    return keycloakRoleMappings[stringRole];
  }
  const roleParts = stringRole.split('-');
  if (roleParts.length !== 2) {
    return;
  }
  const [verb, resourceType] = roleParts.map(toUpper);
  // look up in resource Map and verb Maps
  let recognizedVerb = 'READ';
  if (verb === 'manage') {
    recognizedVerb = 'MANAGE';
  }

  const verbPermission = verbPermissionMap.get(recognizedVerb as VerbPermissionKeys);
  const resource = fhirResourceTypeMap.get(resourceType as FhirResourceTypeKeys) as
    | ResourceType
    | undefined;
  if (resource && verbPermission) {
    return new Role(resource, verbPermission);
  }
};

export const keycloakAdapter: RbacAdapter = (rolesAsStrings: string[]) => {
  /** parse each role, figure out which resource and verb permission it maps to and add that to the permission object */
  // https://github.com/opensrp/fhircore/discussions/1603

  const allRoles: Role[] = [];
  rolesAsStrings.forEach((role) => {
    let asRole = parseFHirRoles(role);
    if (asRole === undefined) {
      asRole = parseKeycloakRoles(role);
    }
    if (asRole) {
      allRoles.push(asRole);
    }
  });

  return Role.combineRoles(allRoles);
};

/**
 * Next step. Update/create a way to store this such that it is accessible globally- add it to some global state.
 *
 * IDEA1:
 *  - Update sessionReducer to be able to store this Role object as well.
 *
 * IDEA2:
 *  - create a context wrapper that supplies the Role object, will be a wrapper around session reducer.
 *
 * IDEA3:
 * - Create a rbac dux module(This will be part of the adapter) - create an action that creates Role and adds it to the store.
 *  - Where/when should the action be callled.
 *  - action can be passed as a sideEffect to the gatekeeper, but its derived information.
 *
 *  - Simplest way forward is to write a selector that reads the role information and returns the Role object.
 */

/**
 * @param state - the redux state.
 */
export function getUserRole(state: Store) {
  // needs the store.
  // needs the session-reducer.
  // part of the adapter.
  const extraData = getExtraData(state);
  const roles = extraData.roles;

  return keycloakAdapter(roles);
}
