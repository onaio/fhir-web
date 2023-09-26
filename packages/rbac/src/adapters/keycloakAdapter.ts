import { AuthZResource, FhirResource, FhirResources, Permit } from '../constants';
import { RbacAdapter } from '../helpers/types';
import { UserRole } from '../roleDefinition';

const fhirVerbToPermitLookup: Record<string, Permit> = {
  GET: Permit.READ,
  POST: Permit.CREATE,
  PUT: Permit.UPDATE,
  DELETE: Permit.DELETE,
  MANAGE: Permit.MANAGE,
};

const getFhirResourceString = (rawResourceString: string): FhirResource | undefined => {
  const matchedResource = FhirResources.filter(
    (resource) => resource.toUpperCase() === rawResourceString.toUpperCase()
  );
  return matchedResource[0];
};

export const parseFHirRoles = (role: string) => {
  //https://github.com/opensrp/fhircore/discussions/1603
  const separator = '_';
  const roleParts = role.split(separator);
  // should have at-least 2 parts
  if (roleParts.length < 2) {
    return;
  }
  // first part is the verb
  const [verb, ...rest] = roleParts;
  const rawResource = rest.join(separator);
  const resource = getFhirResourceString(rawResource);
  const permit = fhirVerbToPermitLookup[verb.toUpperCase()];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (resource && permit) {
    return new UserRole(resource as AuthZResource, permit);
  }
};

const keycloakRoleMappings: Record<string, UserRole> = {
  'realm-admin': new UserRole(['iam_group', 'iam_role', 'iam_user'], Permit.MANAGE),
  'view-users': new UserRole(['iam_user'], Permit.READ),
  'manage-users': new UserRole(['iam_group', 'iam_role', 'iam_user'], Permit.MANAGE),
  'query-groups': new UserRole(['iam_group'], Permit.READ),
  'query-users': new UserRole(['iam_user'], Permit.READ),
};

export const parseKeycloakRoles = (stringRole: string) => {
  const lookedURole = keycloakRoleMappings[stringRole] as UserRole | undefined;
  return lookedURole;
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
  /**
    parse each role, figure out which resource and verb permission it maps to and add that to the permission object
   */

  let allRoleStrings = roles.realmAccess ?? [];
  const invalidRoleStrings: string[] = [];
  Object.values(roles.clientRoles ?? {}).forEach((roleArray) => {
    allRoleStrings = [...allRoleStrings, ...roleArray];
  });

  const allRoles: UserRole[] = [];
  allRoleStrings.forEach((role) => {
    // check if we can first get a hit from keycloak default roles.
    let asRole = parseKeycloakRoles(role);
    if (asRole === undefined) {
      asRole = parseFHirRoles(role);
    }
    if (asRole) {
      allRoles.push(asRole);
    } else {
      invalidRoleStrings.push(role);
    }
  });

  if (invalidRoleStrings.length > 0) {
    /* eslint-disable no-console */
    console.warn(`Could not understand the following roles: ${invalidRoleStrings.join(', ')}`);
  }

  return UserRole.combineRoles(allRoles);
};
