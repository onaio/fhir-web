import { loadHierarchy, loadJurisdictions } from '../../../helpers/dataLoaders';
import { useEffect, useState } from 'react';
import { baseURL } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';
import { TreeNode } from '../../../ducks/locationHierarchy/types';
import { LocationUnit } from '../../../ducks/location-units';
import { generateJurisdictionTree } from '../../../ducks/locationHierarchy/utils';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select/';
import { LabelValueType, DataNode } from 'rc-tree-select/lib/interface';
import { treeToOptions } from '../utils';

/** props for service types select component */
export interface CustomTreeSelectProps extends TreeSelectProps<LabelValueType> {
  baseURL: string;
  fullDataCallback?: (node?: TreeNode) => void;
  disabledTreeNodesCallback?: (node: TreeNode) => boolean;
}

const defaultProps = {
  baseURL: baseURL,
};

/** form field where user can select the parent location from a tree structure
 *
 * @param props - the component props
 */
const CustomTreeSelect = (props: CustomTreeSelectProps) => {
  const { baseURL, value, fullDataCallback, disabledTreeNodesCallback, ...restProps } = props;
  const [loadingJurisdictions, setLoadingJurisdictions] = useState(true);
  const [loadingTrees, setLoadingTrees] = useState(true);
  const [rootLocations, setRootLocations] = useState<LocationUnit[]>([]);
  const [trees, updateTrees] = useState<TreeNode[]>([]);

  useEffect(() => {
    loadJurisdictions(undefined, baseURL, undefined, undefined)
      .then((res) => {
        if (res) setRootLocations(res);
      })
      .catch((err: Error) => sendErrorNotification(err.message))
      .finally(() => setLoadingJurisdictions(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const thisTrees: TreeNode[] = [];
    if (rootLocations.length > 0) {
      const promises = rootLocations
        .map((location) => location.id.toString())
        .map((rootId) =>
          loadHierarchy(rootId, undefined, baseURL, undefined).then((res) => {
            if (res) {
              const tree = generateJurisdictionTree(res);
              thisTrees.push(tree);
            }
          })
        );
      Promise.all(promises)
        .then(() => {
          updateTrees(thisTrees);
        })
        .catch((err: Error) => sendErrorNotification(err.message))
        .finally(() => setLoadingTrees(false));
    } else {
      setLoadingTrees(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  useEffect(() => {
    // if value is set, find parent node and pass it to fullDataCallback
    let node: TreeNode | undefined;
    for (const tree of trees) {
      node = tree.first((node) => node.model.id === value);
      if (node) {
        break;
      }
    }
    fullDataCallback?.(node);
  }, [fullDataCallback, trees, value]);

  const selectOptions = treeToOptions(trees, disabledTreeNodesCallback);

  const treeSelectProps: TreeSelectProps<DataNode> = {
    ...restProps,
    treeData: selectOptions,
    loading: loadingJurisdictions || loadingTrees,
    value,
  };

  return <TreeSelect {...treeSelectProps}></TreeSelect>;
};

CustomTreeSelect.defaultProps = defaultProps;

export { CustomTreeSelect };
