import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import {
  locationResourceType,
} from '../../constants';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  isValidDate,
} from '@opensrp/react-utils';
import { get, reverse } from 'lodash';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { eusmServicePointCodeSystemUri, locationGeometryExtensionUri } from '@opensrp/fhir-helpers';


/** fetches the location as well as all of its parent locations.
 * 
 * @param fhirBaseUrl - fhir base url.
 * @param locationId - location of interest.
 */
export async function getLocationsAncestors(fhirBaseUrl: string, locationId: string) {
  let foundParent = false;
  const locationPath: ILocation[] = [];
  let currentLocationId = locationId;
  while (!foundParent) {
    const { parent, child } = await fetchLocAndParent(fhirBaseUrl, currentLocationId);
    if (child) {
      locationPath.push(child);
    }
    if (!parent) {
      foundParent = true;
    } else {
      locationPath.push(parent);
      const grandParentReferenceParts = (parent.partOf?.reference ?? '').split('/');
      const grandParentReference = grandParentReferenceParts[grandParentReferenceParts.length - 1];
      currentLocationId = grandParentReference;
      if (!grandParentReference) {
        foundParent = true;
      }
    }
  }
  const rootFirstLocations = reverse(locationPath);
  return rootFirstLocations;
}

/** Fetches a location and its parent at a time.
 * 
 * @param fhirBaseUrl - base url for the location.
 * @param locationId - id of the location of interest.
 */
async function fetchLocAndParent(fhirBaseUrl: string, locationId?: string) {
  const service = new FHIRServiceClass<IBundle>(fhirBaseUrl, locationResourceType);
  const response = await service
    .list({ _id: locationId, _include: 'Location:partof' })
    .then((res) => getResourcesFromBundle<ILocation>(res));
  // invariant we should only have at-most 2 locations here.
  let parentId;
  let parent: ILocation | undefined = undefined;
  let child: ILocation | undefined = undefined;
  for (const loc of response) {
    const thisLocParentId = loc.partOf?.reference;
    const thisLocId = `${locationResourceType}/${loc.id}`;
    if (parentId === undefined) {
      parentId = thisLocParentId;
    }
    if (parentId === thisLocId) {
      parent = loc;
    } else {
      child = loc;
    }
  }
  return { child, parent };
}



/** parse a location resource into an obj for easier consumption
 * @param node - the location resource
 */
export function parseLocationDetails(node: ILocation) {
  const { id, name, status, description, identifier, meta, extension, position, alias, type } =
    node;
  const updatedLastRaw = meta?.lastUpdated;

  let updatedLast = updatedLastRaw ? new Date(updatedLastRaw) : undefined;
  if (!isValidDate(updatedLast)) {
    updatedLast = undefined;
  }

  const geoJSonExtens = getObjLike(extension, 'url', locationGeometryExtensionUri)[0];
  const geoJsonExtensionData = geoJSonExtens?.valueAttachment?.data;
  let geometry;
  if (geoJsonExtensionData) {
    geometry = btoa(geoJsonExtensionData);
  }

  const servicePointTypeCodings = (type?.flatMap((concept) => concept.coding) ?? []).filter(
    (x) => x !== undefined
  ) as Coding[];
  const servicePointCode = getObjLike(servicePointTypeCodings, 'system', eusmServicePointCodeSystemUri)[0];

  return {
    identifier,
    id: id,
    name: name,
    partOf: node.partOf?.display ?? '-',
    description: description,
    status: status,
    physicalType: { code: get(node, 'physicalType.coding.0.code'), display: get(node, 'physicalType.coding.0.display') },
    lastUpdated: updatedLast?.toLocaleString(),
    geometry,
    longitude: position?.longitude,
    latitude: position?.latitude,
    version: meta?.versionId,
    alias,
    servicePointType: servicePointCode?.display,
  };
}
