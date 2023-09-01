import { AuthZResource, Permit, PermitKey } from '../constants';
import { RbacAdapter } from '../helpers/types';
import { UserRole } from '../roleDefinition';

export const parseFHirRoles = (role: string) => {
  const roleParts = role.split('_');
  if (roleParts.length !== 2) {
    return;
  }
  const [verb, resource] = roleParts;
  // look up in resource Map and verb Maps
  const verbPermission = Permit[verb.toUpperCase() as PermitKey];
  return new UserRole(resource as AuthZResource, verbPermission);
};

const keycloakRoleMappings: Record<string, UserRole> = {
  'realm-admin': new UserRole(['iam_group', 'iam_role', 'iam_user'], Permit.MANAGE),
  'view-users': new UserRole(['iam_user'], Permit.READ),
};

export const parseKeycloakRoles = (stringRole: string) => {
  const lookedURole = keycloakRoleMappings[stringRole] as UserRole | undefined;
  if (lookedURole !== undefined) {
    return keycloakRoleMappings[stringRole];
  }
  const roleParts = stringRole.split('-');
  if (roleParts.length !== 2) {
    return;
  }
  // TODO - a better scheme of converting keycloak permissions to
  // our internal representation
  const [verb, resourceType] = roleParts;
  // look up in resource Map and verb Maps
  let recognizedVerb = 'READ';
  if (verb === 'manage') {
    recognizedVerb = 'MANAGE';
  }

  const verbPermission = Permit[recognizedVerb.toUpperCase() as PermitKey];
  return new UserRole(resourceType as AuthZResource, verbPermission);
};

export interface KeycloakRoleData {
  realmAccess?: string[];
  clientRoles?: Record<string, string[]>;
}

const defaultRoleData = {
  realmAccess: [],
  clientRoles: {},
};

export const adapter: RbacAdapter = (roles: KeycloakRoleData = defaultRoleData) => {
  /** parse each role, figure out which resource and verb permission it maps to and add that to the permission object */
  // https://github.com/opensrp/fhircore/discussions/1603
  let allRoleStrings = roles.realmAccess ?? [];
  Object.values(roles.clientRoles ?? {}).forEach((roleArray) => {
    allRoleStrings = [...allRoleStrings, ...roleArray];
  });
  console.log({ allRoleStrings });
  const allRoles: UserRole[] = [];
  allRoleStrings.forEach((role) => {
    let asRole = parseFHirRoles(role);
    if (asRole === undefined) {
      asRole = parseKeycloakRoles(role);
    }
    if (asRole) {
      allRoles.push(asRole);
    }
  });

  return UserRole.combineRoles(allRoles);
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

// /**
//  * @param state - the redux state.
//  */
// export function getUserRole(state: Store) {
//   // needs the store.
//   // needs the session-reducer.
//   // part of the adapter.
//   const extraData = getExtraData(state);
//   const roles = extraData.roles;

//   return keycloakAdapter(roles);
// }
