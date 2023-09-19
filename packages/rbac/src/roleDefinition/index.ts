import { AuthZResource, BinaryNumber, ResourcePermitMap } from '../constants';
import { makeArray, parsePermissionStr } from '../helpers/utils';

// create a map lookup
// export const fhirResourceMap: Map<FhirResourceTypeKeys, string> = Object.entries(
//   HapiFhirResources
// ).reduce((acc, [key, value]) => {
//   acc.set(key, value);
//   return acc;
// }, new Map());

// export type VerbPermissionKeys = keyof typeof Permit;
// export const verbPermissionMap: Map<VerbPermissionKeys, number> = Object.entries(
//   Permit
// ).reduce((acc, [key, value]) => {
//   acc.set(key, value);
//   return acc;
// }, new Map());

export class UserRole {
  private permissions: ResourcePermitMap;

  constructor(resource: AuthZResource | AuthZResource[] = [], verb?: BinaryNumber) {
    const newMap = new Map();
    if (!verb) {
      this.permissions = newMap;
      return;
    }
    const resources = makeArray(resource);
    for (const type of resources) {
      newMap.set(type, verb);
    }
    this.permissions = newMap;
  }

  public getPermissionMap(): ResourcePermitMap {
    return this.permissions;
  }

  // public combineWith(roles: UserRole[] | UserRole): UserRole {
  //   /**
  //    * Rules:
  //    * 1: cannot add permissions
  //    */
  //   const toAddRoles = makeArray(roles);
  //   const mapForNewRole = new Map();
  //   for (const [key, value] of this.getPermissionMap().entries()) {
  //     mapForNewRole.set(key, value);
  //   }
  //   for (const role of toAddRoles) {
  //     for (const [key, value] of role.getPermissionMap().entries()) {
  //       if (mapForNewRole.has(key)) {
  //         mapForNewRole.set(key, mapForNewRole.get(key) | value);
  //       } else {
  //         mapForNewRole.set(key, value);
  //       }
  //     }
  //   }
  //   return UserRole.fromResourceMap(mapForNewRole) as UserRole;
  // }

  public hasRoles(roles: UserRole[] | UserRole): boolean {
    const toCheckRoles = makeArray(roles);

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

  // check if it has userRole includes this permission
  public hasPermissionMap(permissions: ResourcePermitMap): boolean {
    for (const [key, value] of permissions.entries()) {
      if (!this.permissions.has(key)) {
        return false;
      }

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      if ((this.permissions.get(key)! & value) === 0) {
        return false;
      }
    }
    return true;
  }

  public hasPermissions(permissions: string | string[]) {
    // parse permission string to a ResourcePermisMap
    const permAsStr = makeArray(permissions);
    const perms = parsePermissionStr(permAsStr);
    return this.hasPermissionMap(perms);
  }

  public static fromResourceMap(resourceMap: ResourcePermitMap) {
    const mapEntries = [...resourceMap.entries()];
    if (!mapEntries.length) {
      return;
    }
    const last = mapEntries.pop() as [AuthZResource, number];
    const resourceType = last[0];
    const verb = last[1];
    const newRole = new UserRole(resourceType, verb);
    for (const [resourceType, verb] of mapEntries) {
      newRole.permissions.set(resourceType, verb);
    }
    return newRole;
  }

  public static fromPermissionStrings(permissionStrings: string | string[]) {
    const permAsStr = makeArray(permissionStrings);
    const perms = parsePermissionStr(permAsStr);
    return this.fromResourceMap(perms);
  }

  public static combineRoles(roles: UserRole[]): UserRole {
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
    return UserRole.fromResourceMap(newResourceMap) as UserRole;
  }
}
