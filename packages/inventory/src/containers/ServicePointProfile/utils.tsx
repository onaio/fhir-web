import { LocationUnit, TreeNode } from '@opensrp-web/location-management';
import { Geometry } from 'geojson';

/** geographic location interface */
export interface GeographicLocationInterface {
  geographicLevel?: number;
  label?: string;
}

/**
 * function to get the parent path of a location
 *
 * @param loc - the location whose path we want
 * @param trees - the tree nodes containing the hierarchy
 */
export const getNodePath = (
  loc: LocationUnit,
  trees: TreeNode[] = []
): GeographicLocationInterface[] => {
  const { parentId } = loc.properties;
  // find tree with node that has the given id
  let nodeOfInterest: TreeNode | undefined;
  trees.forEach((tree) => {
    nodeOfInterest = tree.first((node) => node.model.id === parentId);
  });
  if (!nodeOfInterest) {
    return [];
  }
  // get path
  const path = nodeOfInterest.getPath().map((node) => {
    return { geographicLevel: node.model.node.attributes.geographicLevel, label: node.model.label };
  });
  return path;
};

/**
 * validate coordinates, returns coordinates
 *
 * @param geoJson - the geojson object
 */
export const getCords = (geoJson?: Partial<Geometry>) => {
  if (
    geoJson?.type === 'Point' &&
    Array.isArray(geoJson.coordinates) &&
    geoJson.coordinates.length === 2
  ) {
    return {
      lat: geoJson.coordinates[1],
      lng: geoJson.coordinates[0],
    };
  } else {
    return {};
  }
};
