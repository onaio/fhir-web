import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { CommonHierarchyNode } from './types';

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/**
 * Convert a hierarchy from flat to nested representation.
 *
 * @param {Array} locations The array with the hierachy flat representation.
 */
export function nestLocations(locations: ILocation[]) {
  let id, parentId;

  const roots = [];
  const temp: Record<string, CommonHierarchyNode> = {};
  const pendingChildOf: Record<string, CommonHierarchyNode[]> = {};

  for (let i = 0, len = locations.length; i < len; i++) {
    const rawLocation = locations[i];
    const location = {
      nodeId: `${rawLocation.resourceType}/${rawLocation.id}`,
      label: rawLocation.name ?? '',
      node: rawLocation,
    };
    id = rawLocation.id as string;
    parentId = getParentResourceId(rawLocation);
    temp[id] = location;
    if (parentId === undefined || parentId === null) {
      // Current object has no parent, so it's a root element.
      roots.push(location);
    } else {
      if (temp[parentId] !== undefined) {
        // Parent is already in temp, adding the current object to its children array.
        initPush('children', temp[parentId], location);
      } else {
        // Parent for this object is not yet in temp, adding it to pendingChildOf.
        initPush(parentId, pendingChildOf, location);
      }
    }
    if (pendingChildOf[id] !== undefined) {
      // Current object has children pending for it. Adding these to the object.
      multiInitPush('children', location, pendingChildOf[id]);
    }
  }
  return roots;
}

const initPush = (arrayName: string, obj: unknown, toPush: unknown) => {
  const typedObj = obj as Record<string, unknown[]>;
  if (typedObj[arrayName] === undefined) {
    typedObj[arrayName] = [];
  }
  typedObj[arrayName].push(toPush);
};

const multiInitPush = (arrayName: string, obj: unknown, toPushArray: unknown[]) => {
  let len;
  len = toPushArray.length;
  const typedObj = obj as Record<string, unknown[]>;
  if (typedObj[arrayName] === undefined) {
    typedObj[arrayName] = [];
  }
  while (len-- > 0) {
    typedObj[arrayName].push(toPushArray.shift());
  }
};

/**
 * Gets id of parent location from a location resource.
 *
 * @param obj - location object to get parent id from
 * @returns - parent id or undefined
 */
const getParentResourceId = (obj: ILocation) => {
  const reference = obj.partOf?.reference;
  if (reference === undefined) {
    return undefined;
  }
  const parts = reference.split('/');
  if (parts.length < 2) {
    return undefined;
  }
  return parts[parts.length - 1];
};
