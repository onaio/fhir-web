import { ChildNodeList, LocationHierarchyResource, ParsedHierarchyNode, TreeNode } from './types';
import { cloneDeep } from 'lodash';
import cycle from 'cycle';
import TreeModel from 'tree-model';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { locationHierarchyResourceType, locationResourceType } from '../constants';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

/**
 * Parse the raw child hierarchy node map
 *
 * @param rawNodeMap - Object of raw hierarchy nodes
 * @returns Array of Parsed hierarchy nodes
 */
const parseFhirChildren = (rawNodeMap: ChildNodeList[]) => {
  return rawNodeMap.map((child) => {
    // standardize the parsedHierarchy node structure to be similar for both
    // root node and all other descendant nodes.
    const { treeNode } = child;
    const parsedNode: ParsedHierarchyNode = {
      ...treeNode,
      children: parseFhirChildren(treeNode.children ?? []) as ParsedHierarchyNode[],
    };
    return parsedNode;
  });
};

export const parseFHIRHierarchy = (fhirTree: LocationHierarchyResource) => {
  const rawClone: LocationHierarchyResource = cloneDeep(fhirTree);

  const { listOfNodes } = rawClone.LocationHierarchyTree.locationsHierarchy;
  const rawNode = listOfNodes.treeNode[0];

  const parsedNode = {
    ...rawNode,
    children: parseFhirChildren(rawNode.children ?? []),
  };
  return parsedNode;
};

export const generateFhirLocationTree = (rootNode: LocationHierarchyResource) => {
  const tree = new TreeModel();
  const hierarchy = parseFHIRHierarchy(rootNode);
  const root = tree.parse<ParsedHierarchyNode>(hierarchy);
  return root;
};

export const convertApiResToTree = (apiRes: IBundle) => {
  const rootNode = apiRes.entry?.[0].resource as Resource as LocationHierarchyResource | undefined;
  if (!rootNode) {
    return;
  }
  return generateFhirLocationTree(rootNode);
};

/**
 * serialize tree due to circular dependencies
 *
 * @param trees - trees to be serialized
 */
export const serializeTree = (trees?: TreeNode[] | TreeNode) => {
  if (!trees) {
    return JSON.stringify(undefined);
  }
  const sanitizeTrees = Array.isArray(trees) ? trees : [trees];
  return JSON.stringify(sanitizeTrees.map((tree) => JSON.stringify(cycle.decycle(tree))));
};

/**
 * get the location hierarchy of location with given identifier
 *
 * @param baseUrl - the server base url
 * @param rootIdentifier - the location identifier
 */
export const useGetLocationHierarchy = (baseUrl: string, rootIdentifier: string) => {
  const hierarchyParams = {
    identifier: rootIdentifier,
  };
  return useQuery<IBundle, Error, TreeNode>(
    [locationHierarchyResourceType, hierarchyParams],
    async () => {
      return new FHIRServiceClass<IBundle>(baseUrl, locationHierarchyResourceType).list(
        hierarchyParams
      );
    },
    {
      select: (res: IBundle) => {
        return convertApiResToTree(res) as TreeNode;
      },
      refetchInterval: false,
    }
  );
};

/**
 * get single location
 *
 * @param baseUrl - the server base url
 * @param locId - the location identifier
 */
export const useGetLocation = (baseUrl: string, locId?: string) => {
  const serve = new FHIRServiceClass<ILocation>(baseUrl, locationResourceType);
  return useQuery([locationResourceType, locId], () => serve.read(locId as string), {
    select: (res) => res,
    enabled: !!locId,
  });
};
