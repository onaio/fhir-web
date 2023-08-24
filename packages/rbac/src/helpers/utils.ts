import {
  AuthZResource,
  FhirResources,
  IamResources,
  Permit,
  PermitKey,
  ResourcePermitMap,
} from '../constants';
import invariant from 'invariant';

/**
 * convert to array if not array
 *
 * @param obj - value to conver to array if not array.
 */
export function makeArray<T>(obj: T | T[]): T[] {
  let asArray = obj as T[];
  if (!Array.isArray(obj)) {
    asArray = [obj];
  }
  return asArray;
}

const lowecasedAuthZResourceTags = [...IamResources, ...FhirResources].map((tag) =>
  tag.toLowerCase()
);
export const permitLiteralKeys = Object.keys(Permit).map((x) => x.toLowerCase());

/**
 * validates that a string is a valid representation of one of the recognized
 * resource permit combinations.
 *
 * @param permission - string to be validated.
 */
export function validatePermissionStr(permission: string) {
  const parts = permission.split('.');
  if (parts.length !== 2) {
    return false;
  }
  const [resource, permit] = parts;
  const resourceIsRecognized = lowecasedAuthZResourceTags.includes(resource.toLowerCase());
  const permitIsRecognized = permitLiteralKeys.includes(permit.toLowerCase());
  if (!resourceIsRecognized || !permitIsRecognized) {
    return false;
  }
  return true;
}

/**
 * creates a resourcePermit map from a human readable string
 *
 * @param permissions - string of arrays to be converted to resourcePermit
 */
export function parsePermissionStr(permissions: string[]) {
  const newMap: ResourcePermitMap = new Map();
  permissions.forEach((permission) => {
    const permissionStrIsValid = validatePermissionStr(permission);
    invariant(
      permissionStrIsValid,
      `Permission string: '${permission}' is not internally recognized as a valid permission string.`
    );
    const parts = permission.split('.');
    const [resource, permit] = parts;
    newMap.set(resource as AuthZResource, Permit[permit.toUpperCase() as PermitKey]);
  });
  return newMap;
}
