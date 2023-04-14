import { FhirResourceType, VerbPermission } from '../constants';

export type BinaryNumber = number;

export type FhirResourceTypeKeys = keyof typeof FhirResourceType;
export const fhirResourceTypeMap: Map<FhirResourceTypeKeys, string> = Object.entries(
  FhirResourceType
).reduce((acc, [key, value]) => {
  acc.set(key, value);
  return acc;
}, new Map());

// TODO - these should not be here. - maybe in the respective adapter module.
export enum IAMResourceType {
  USER = 'user',
  ROLE = 'role',
  GROUP = 'group',
}

export type ResourceType = FhirResourceType | IAMResourceType;

export type VerbPermissionKeys = keyof typeof VerbPermission;
export const verbPermissionMap: Map<VerbPermissionKeys, number> = Object.entries(
  VerbPermission
).reduce((acc, [key, value]) => {
  acc.set(key, value);
  return acc;
}, new Map());

export type ResourceMap = Map<ResourceType, number>;

/**
 * convert to array if not array
 *
 * @param anything - value to conver to array if not array.
 */
export function sanitizeToArray<T>(anything: T | T[]): T[] {
  let asArray = anything as T[];
  if (!Array.isArray(anything)) {
    asArray = [anything];
  }
  return asArray;
}

export class Role {
  private permissions: ResourceMap;

  constructor(resourceType: ResourceType | ResourceType[], verb: BinaryNumber) {
    const resources = sanitizeToArray(resourceType);
    const newMap = new Map();
    for (const type of resources) {
      newMap.set(type, verb);
    }
    this.permissions = newMap;
  }

  public addRole(roles: Role[] | Role): Role {
    /**
     * Rules:
     * 1: cannot add permissions
     */
    const toAddRoles = sanitizeToArray(roles);
    const mapForNewRole = new Map();
    for (const [key, value] of this.getPermissionMap().entries()) {
      mapForNewRole.set(key, value);
    }
    for (const role of toAddRoles) {
      for (const [key, value] of role.getPermissionMap().entries()) {
        if (mapForNewRole.has(key)) {
          mapForNewRole.set(key, mapForNewRole.get(key) | value);
        } else {
          mapForNewRole.set(key, value);
        }
      }
    }
    return Role.fromResourceMap(mapForNewRole) as Role;
  }

  public hasRoles(roles: Role[] | Role): boolean {
    const toCheckRoles = sanitizeToArray(roles);

    for (const role of toCheckRoles) {
      for (const [key, value] of role.permissions.entries()) {
        if (!this.permissions.has(key)) {
          return false;
        }

        if (this.permissions.get(key) && value === 0) {
          return false;
        }
      }
    }
    return true;
  }

  public static fromResourceMap(resourceMap: ResourceMap) {
    const mapEntries = [...resourceMap.entries()];
    if (!mapEntries.length) {
      return;
    }
    const last = mapEntries.pop() as [ResourceType, number];
    const resourceType = last[0];
    const verb = last[1];
    const newRole = new Role(resourceType, verb);
    for (const [resourceType, verb] of mapEntries) {
      newRole.permissions.set(resourceType, verb);
    }
    return newRole;
  }

  public getPermissionMap(): ResourceMap {
    return this.permissions;
  }

  public static combineRoles(roles: Role[]): Role {
    /** create a resourceMap from this and then use it to create the role */
    const newResourceMap = new Map();
    for (const role of roles) {
      for (const [key, value] of role.getPermissionMap().entries()) {
        if (newResourceMap.has(key)) {
          newResourceMap.set(key, newResourceMap.get(key) | value);
        } else {
          newResourceMap.set(key, value);
        }
      }
    }
    return Role.fromResourceMap(newResourceMap) as Role;
  }
}

/** Next step write an adapter that translates keycloak roles to this structure. */
