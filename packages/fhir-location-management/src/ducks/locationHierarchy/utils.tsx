import { ParsedFHIRHierarchyNode, ParsedHierarchyNode, TreeNode } from './types';
import { cloneDeep } from 'lodash';
import cycle from 'cycle';
import TreeModel from 'tree-model';
import { Dictionary } from '@onaio/utils';
export interface FHIRLocationHierarchy {
  fullUrl: string;
  resource: {
    LocationHierarchyTree: {
      locationsHierarchy: {
        listOfNodes: {
          treeNodeId: string;
          treeNode: Dictionary;
        };
      };
    };
  };
}

/** Parse the raw child hierarchy node map
 *
 * @param {ParsedFHIRHierarchyNode[]} rawNodeMap - Object of raw hierarchy nodes
 * @param {string} parent - node parent id
 * @returns {Array<ParsedHierarchyNode>} Array of Parsed hierarchy nodes
 */
const parseFHIRChildren = (rawNodeMap: ParsedFHIRHierarchyNode[], parent: string) => {
  return rawNodeMap.map((child) => {
    const childId = child.childId.split('/')[1];
    const parsedNode: ParsedFHIRHierarchyNode = {
      ...child,
      title: child?.treeNode?.label || child.label,
      key: `${childId}-${parent}`,
      id: childId,
      children: child?.treeNode?.children ? parseFHIRChildren(child.treeNode.children, parent) : [],
    };
    return parsedNode;
  });
};

export const parseFHIRHierarchy = (fhirTree: FHIRLocationHierarchy) => {
  const rawClone: FHIRLocationHierarchy = cloneDeep(fhirTree);

  // // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const { locationsHierarchy } = rawClone.resource.LocationHierarchyTree;
  const { listOfNodes } = locationsHierarchy;
  // // !IMPORTANT ASSUMPTION : locationsTreeClone has a single object under map, i.e there is only one root jurisdiction
  const rawNode = listOfNodes.treeNode[0];

  const nodeId = rawNode.nodeId.split('/')[1];
  const parsedNode = {
    ...rawNode,
    title: rawNode.label,
    key: nodeId,
    id: nodeId,
    children: rawNode.children ? parseFHIRChildren(rawNode.children, nodeId) : [],
  };
  return parsedNode;
};

export const generateFHIRLocationTree = (apiRes: FHIRLocationHierarchy) => {
  const tree = new TreeModel();
  const hierarchy = parseFHIRHierarchy(apiRes);
  const root = tree.parse<ParsedFHIRHierarchyNode>(hierarchy);
  return root;
};

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
  hierarchy: ParsedFHIRHierarchyNode,
  id: string
): ParsedFHIRHierarchyNode | undefined {
  // convert the ParsedHierarchyNode object into tree
  const tree = new TreeModel().parse(hierarchy);
  // variable to store either we found node in the tree or not
  let result: ParsedFHIRHierarchyNode | undefined = undefined;

  // walk through each of tree nodes and look for specific tree id
  tree.walk((node) => {
    if ((node.model as ParsedFHIRHierarchyNode).id === id) {
      result = node.model as ParsedFHIRHierarchyNode;
      return false; // return false to stop the loop of tree walk
    } else return true; // return true to keep searching
  });

  // return the result that either the node id exsity in this tree or not
  return result;
}

/**
 * Find the specifc Hierarchy node inside HierarchyTree Array
 *
 * @param {Array<ParsedFHIRHierarchyNode>} hierarchy Array of HeirarchyTree to search in
 * @param {string} id Id of the node to search for
 * @returns {ParsedFHIRHierarchyNode | undefined} returns the Node if found else undefined
 */
export function getHierarchyNodeFromArray(
  hierarchy: ParsedFHIRHierarchyNode[],
  id: string
): ParsedFHIRHierarchyNode | undefined {
  // variable to store the result of previous ParsedHierarchyNode from array
  const result = hierarchy.flatMap((tree) => {
    const found = getHierarchyNode(tree, id);
    if (found) return found;
    // if found stops the execution of loop
    else return undefined;
  });

  return result.find((e) => e !== undefined);
}
