import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { CommonHierarchyNode } from './types';

/**
 * Convert a hierarchy from flat to nested representation.
 *
 * @param {array} locations The array with the hierachy flat representation.
 */
export function nestLocations(locations: ILocation[]) {
  let roots, id, parentId, pendingChildOf;

  roots = [];
  const temp: Record<string, CommonHierarchyNode> = {};
  pendingChildOf = {};

  for (let i = 0, len = locations.length; i < len; i++) {
    const rawLocation = locations[i];
    console.log({ rawLocation, locations });
    const location = {
      nodeId: rawLocation.id as string,
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

function initPush(arrayName: any, obj: any, toPush: any) {
  if (obj[arrayName] === undefined) {
    obj[arrayName] = [];
  }
  obj[arrayName].push(toPush);
}

function multiInitPush(arrayName: any, obj: any, toPushArray: any) {
  var len;
  len = toPushArray.length;
  if (obj[arrayName] === undefined) {
    obj[arrayName] = [];
  }
  while (len-- > 0) {
    obj[arrayName].push(toPushArray.shift());
  }
}

/**
 * Gets id of parent location from a location resource.
 * @param obj
 * @returns
 */
const getParentResourceId = (obj: ILocation) => {
  const reference = obj?.partOf?.reference;
  if (reference == undefined) {
    return undefined;
  }
  const parts = reference.split('/');
  if (parts.length < 2) {
    return undefined;
  }
  return parts[parts.length - 1];
};
