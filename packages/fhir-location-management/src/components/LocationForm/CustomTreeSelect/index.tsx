import React, { useEffect } from 'react';
import { TreeNode } from '../../../helpers/types';
import { serializeTree } from '../../../helpers/utils';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select/';
import { LabelValueType, DataNode } from 'rc-tree-select/lib/interface';
import { treeToOptions } from '../utils';

/** props for service types select component */
export interface CustomTreeSelectProps extends TreeSelectProps<LabelValueType> {
  tree: TreeNode;
  fullDataCallback?: (node: TreeNode) => void;
  disabledTreeNodesCallback?: (node: TreeNode) => boolean;
}

/**
 * form field where user can select the parent location from a tree structure
 *
 * @param props - the component props
 */
export const CustomTreeSelect = (props: CustomTreeSelectProps) => {
  const { value, fullDataCallback, disabledTreeNodesCallback, tree, ...restProps } = props;

  useEffect(() => {
    // if value is set, find parent node and pass it to fullDataCallback
    const node = tree.first((node) => node.model.nodeId === value);
    if (node) {
      fullDataCallback?.(node);
    } else {
      fullDataCallback?.(tree);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializeTree(tree), fullDataCallback, value]);

  const userDefinedRoots = tree.children ?? [];
  const selectOptions = treeToOptions(userDefinedRoots, disabledTreeNodesCallback);

  const treeSelectProps: TreeSelectProps<DataNode> = {
    ...restProps,
    treeData: selectOptions,
    value,
  };

  return <TreeSelect {...treeSelectProps}></TreeSelect>;
};
