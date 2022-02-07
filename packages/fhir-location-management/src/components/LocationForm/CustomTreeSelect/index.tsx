import { sendErrorNotification } from '@opensrp/notifications';
import React, { useEffect } from 'react';
import { TreeNode } from '../../../helpers/types';
import { convertApiResToTree, serializeTree } from '../../../helpers/utils';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select/';
import { LabelValueType, DataNode } from 'rc-tree-select/lib/interface';
import { treeToOptions } from '../utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/** props for service types select component */
export interface CustomTreeSelectProps extends TreeSelectProps<LabelValueType> {
  baseUrl: string;
  fhirRootLocationIdentifier: string;
  fullDataCallback?: (node?: TreeNode) => void;
  disabledTreeNodesCallback?: (node: TreeNode) => boolean;
}

export const locationHierarchyResourceType = 'LocationHierarchy';

/** form field where user can select the parent location from a tree structure
 *
 * @param props - the component props
 */
export const CustomTreeSelect = (props: CustomTreeSelectProps) => {
  const {
    baseUrl,
    value,
    fullDataCallback,
    disabledTreeNodesCallback,
    fhirRootLocationIdentifier,
    ...restProps
  } = props;
  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

  const { data, isLoading, isFetching } = useQuery<IBundle, Error, TreeNode>(
    [locationHierarchyResourceType, hierarchyParams],
    async () => {
      return new FHIRServiceClass<IBundle>(baseUrl, locationHierarchyResourceType).list(
        hierarchyParams
      );
    },
    {
      onError: (err) => {
        sendErrorNotification(err.message);
      },
      select: (res: IBundle) => {
        return convertApiResToTree(res) as TreeNode;
      },
      refetchInterval: false,
    }
  );

  useEffect(() => {
    // if value is set, find parent node and pass it to fullDataCallback
    const node = data?.first((node) => node.model.nodeId === value);
    if (node && value) {
      fullDataCallback?.(node);
    } else if (data) {
      fullDataCallback?.(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializeTree(data), fullDataCallback, value]);

  const userDefinedRoots = data?.children ?? [];
  const selectOptions = treeToOptions(userDefinedRoots, disabledTreeNodesCallback);

  const treeSelectProps: TreeSelectProps<DataNode> = {
    ...restProps,
    treeData: selectOptions,
    loading: isLoading || isFetching,
    value,
  };

  return <TreeSelect {...treeSelectProps}></TreeSelect>;
};
