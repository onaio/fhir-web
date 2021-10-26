import { useEffect, useState } from 'react';
import { fhirBaseURL } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';
import { TreeNode } from '../../../ducks/locationHierarchy/types';
import {
  FHIRLocationHierarchy,
  generateFHIRLocationTree,
} from '../../../ducks/locationHierarchy/utils';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select/';
import { LabelValueType, DataNode } from 'rc-tree-select/lib/interface';
import { treeToOptions } from '../utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useQuery } from 'react-query';

/** props for service types select component */
export interface CustomTreeSelectProps extends TreeSelectProps<LabelValueType> {
  baseURL: string;
  fhirBaseURL: string;
  filterByParentId?: boolean;
  fhirRootLocationIdentifier: string;
  fullDataCallback?: (node?: TreeNode) => void;
  disabledTreeNodesCallback?: (node: TreeNode) => boolean;
}

const defaultProps = {
  fhirBaseURL: fhirBaseURL,
};

/** form field where user can select the parent location from a tree structure
 *
 * @param props - the component props
 */
const CustomTreeSelect = (props: CustomTreeSelectProps) => {
  const {
    fhirBaseURL,
    value,
    fullDataCallback,
    disabledTreeNodesCallback,
    fhirRootLocationIdentifier,
    filterByParentId,
    ...restProps
  } = props;
  const [trees, updateTrees] = useState<TreeNode[]>([]);

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

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

  const { data, isLoading } = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification('Error'),
      select: (res) =>
        res.entry.map((singleEntry) =>
          generateFHIRLocationTree((singleEntry as unknown) as FHIRLocationHierarchy)
        ),
    }
  );

  useEffect(() => {
    if (data?.length) {
      updateTrees(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectOptions = treeToOptions(data as TreeNode[], disabledTreeNodesCallback);

  const treeSelectProps: TreeSelectProps<DataNode> = {
    ...restProps,
    treeData: selectOptions,
    loading: isLoading,
    value,
  };

  return <TreeSelect {...treeSelectProps}></TreeSelect>;
};

CustomTreeSelect.defaultProps = defaultProps;

export { CustomTreeSelect };
