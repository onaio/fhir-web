import {
  ParsedHierarchyNode,
  RawHierarchyNode,
  RawHierarchyNodeMap,
  RawOpenSRPHierarchy,
  TreeNode,
} from './types';
import { cloneDeep } from 'lodash';
import cycle from 'cycle';
import { quickSort } from '../../utils';
import TreeModel from 'tree-model';
import { OpenSRPService } from '@opensrp/react-utils';
import { LocationUnit } from '../../ducks/location-units';
import { LOCATION_HIERARCHY, LOCATION_UNIT_FIND_BY_PROPERTIES } from '../../constants';

const { getFilterParams } = OpenSRPService;

/** Parse the raw child hierarchy node map
 *
 * @param {RawHierarchyNodeMap} rawNodeMap - Object of raw hierarchy nodes
 * @param {string} parent - node parent id
 * @returns {Array<ParsedHierarchyNode>} Array of Parsed hierarchy nodes
 */
const parseChildren = (rawNodeMap: RawHierarchyNodeMap, parent: string) => {
  const rawHierarchyNode: RawHierarchyNode[] = Object.entries(rawNodeMap).map(
    ([_key, value]) => value
  );
  return rawHierarchyNode.map((child) => {
    const parsedNode: ParsedHierarchyNode = {
      ...child,
      title: child.label,
      key: `${child.id}-${parent}`,
      children: child.children ? parseChildren(child.children, parent) : [],
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
    key: rawNode.id,
    children: rawNode.children ? parseChildren(rawNode.children, rawNode.id) : [],
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
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(opensrpBaseURL: string) {
  const serve = new OpenSRPService(LOCATION_UNIT_FIND_BY_PROPERTIES, opensrpBaseURL);
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
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(location: LocationUnit[], opensrpBaseURL: string) {
  const hierarchy: RawOpenSRPHierarchy[] = [];
  for (const loc of location) {
    const serve = new OpenSRPService(LOCATION_HIERARCHY, opensrpBaseURL);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}
/**
 * serialize tree due to circular dependencies
 *
 * @param trees - trees to be serialized
 */
export const serializeTree = (trees: TreeNode[]) => {
  return JSON.stringify(trees.map((tree) => JSON.stringify(cycle.decycle(tree))));
};

/**
 * Find the specifc Hierarchy node inside HierarchyTree
 *
 * @param {ParsedHierarchyNode} hierarchy HeirarchyTree to search in
 * @param {string} id Id of the node to search for
 * @returns {ParsedHierarchyNode | undefined} returns the Node if found else undefined
 */
export function getHierarchyNode(
  hierarchy: ParsedHierarchyNode,
  id: string
): ParsedHierarchyNode | undefined {
  // convert the ParsedHierarchyNode object into tree
  const tree = new TreeModel().parse(hierarchy);
  // variable to store either we found node in the tree or not
  let result: ParsedHierarchyNode | undefined = undefined;

  // walk through each of tree nodes and look for specific tree id
  tree.walk((node) => {
    if ((node.model as ParsedHierarchyNode).id === id) {
      result = node.model as ParsedHierarchyNode;
      return false; // return false to stop the loop of tree walk
    } else return true; // return true to keep searching
  });

  // return the result that either the node id exsity in this tree or not
  return result;
}

/**
 * Find the specifc Hierarchy node inside HierarchyTree Array
 *
 * @param {Array<ParsedHierarchyNode>} hierarchy Array of HeirarchyTree to search in
 * @param {string} id Id of the node to search for
 * @returns {ParsedHierarchyNode | undefined} returns the Node if found else undefined
 */
export function getHierarchyNodeFromArray(
  hierarchy: ParsedHierarchyNode[],
  id: string
): ParsedHierarchyNode | undefined {
  // variable to store the result of previous ParsedHierarchyNode from array
  const result = hierarchy.flatMap((tree) => {
    const found = getHierarchyNode(tree, id);
    if (found) return found;
    // if found stops the execution of loop
    else return undefined;
  });

  return result.find((e) => e !== undefined);
}

/**
 * Sort the Base ParsedHierarchyNode by name
 *
 * @param {Array<ParsedHierarchyNode>} hierarchy Array of ParsedHierarchyNode
 * @returns {Array<ParsedHierarchyNode>} returns Sorted ParsedHierarchyNode
 */
export function sortBaseParsedHierarchy(hierarchy: ParsedHierarchyNode[]) {
  const names = hierarchy.map((e) => e.title);
  quickSort(names);
  return names.map((title) => hierarchy.find((e) => title === e.title) as ParsedHierarchyNode);
}
