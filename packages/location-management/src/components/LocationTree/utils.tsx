import {
  ParsedHierarchyNode,
  RawHierarchyNode,
  RawHierarchyNodeMap,
  RawOpenSRPHierarchy,
  TreeNode,
} from '../../ducks/types';
import { cloneDeep } from 'lodash';
import TreeModel from 'tree-model';
import { OpenSRPService } from '@opensrp/server-service';
import { LocationUnit } from '../../ducks/location-units';
import { LOCATION_HIERARCHY, LOCATION_UNIT_FINDBYPROPERTIES } from '../../constants';

const { getFilterParams } = OpenSRPService;

/** Parse the raw child hierarchy node map
 *
 * @param {RawHierarchyNodeMap} rawNodeMap - Object of raw hierarchy nodes
 * @returns {Array<ParsedHierarchyNode>} Array of Parsed hierarchy nodes
 */
const parseChildren = (rawNodeMap: RawHierarchyNodeMap) => {
  const rawHierarchyNode: RawHierarchyNode[] = Object.entries(rawNodeMap).map(
    ([_key, value]) => value
  );
  return rawHierarchyNode.map((child) => {
    const parsedNode: ParsedHierarchyNode = {
      ...child,
      title: child.label,
      key: child.label,
      children: child.children ? parseChildren(child.children) : undefined,
    };
    return parsedNode;
  });
};

/** parses the raw opensrp hierarchy to a hierarchy that we can quickly build
 * our tree model from.
 *
 * @param {RawOpenSRPHierarchy} raw - the response we get from opensrp
 * @returns {ParsedHierarchyNode} - returns Parent node with its children
 */
const parseHierarchy = (raw: RawOpenSRPHierarchy) => {
  // clone the locationTree, we are going to be mutating a copy
  const rawClone: RawOpenSRPHierarchy = cloneDeep(raw);

  // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const { map } = rawClone.locationsHierarchy;
  // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const rawNode: RawHierarchyNode = Object.entries(map).map(([_key, value]) => value)[0];
  const parsedNode: ParsedHierarchyNode = {
    ...rawNode,
    title: rawNode.label,
    key: rawNode.label,
    children: rawNode.children ? parseChildren(rawNode.children) : undefined,
  };

  return parsedNode;
};

/** takes the raw opensrp hierarchy response and creates a tree model structure
 *
 * @param {RawOpenSRPHierarchy} apiResponse - the response we get from opensrp
 * @returns {TreeNode} - returns root node
 */
export const generateJurisdictionTree = (apiResponse: RawOpenSRPHierarchy): TreeNode => {
  const tree = new TreeModel();
  const hierarchy = parseHierarchy(apiResponse);
  const root = tree.parse<ParsedHierarchyNode>(hierarchy);
  return root;
};

/** Gets all the location unit at geographicLevel 0
 *
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(accessToken: string, opensrpBaseURL: string) {
  const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_FINDBYPROPERTIES);
  return await serve
    .list({
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      return_geometry: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    })
    .then((response: LocationUnit[]) => response);
}

/** Gets the hierarchy of the location units
 *
 * @param {Array<LocationUnit>} location - array of location units to get hierarchy of
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(
  location: LocationUnit[],
  accessToken: string,
  opensrpBaseURL: string
) {
  const hierarchy: RawOpenSRPHierarchy[] = [];
  for await (const loc of location) {
    const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_HIERARCHY);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}
