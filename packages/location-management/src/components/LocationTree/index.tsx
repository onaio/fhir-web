import React, { ChangeEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getLocationTreeState,
  reducerName,
  setLocationTreeState,
  reducer,
} from '../../ducks/location-hierarchy';
import { AntTreeProps } from '../LocationUnitList';
import './tree.css';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { getHierarchyNodeFromArray } from '../../ducks/locationHierarchy/utils';
import lang from '../../lang';
import { Key } from 'rc-tree/lib/interface';
reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: ParsedHierarchyNode[];
  OnItemClick: (item: ParsedHierarchyNode) => void;
}

export const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, OnItemClick } = props;
  console.log('data??', data);
  const dispatch = useDispatch();

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const filterData: ParsedHierarchyNode[] = [];
  const locationTreeState = useSelector((state) => getLocationTreeState(state));

  /**
   * Function to to expand tree
   *
   * @param {string} value - value to be searched and expanded
   */
  function expandTree(value: string) {
    const expandedKeys = filterData
      .map((item) =>
        value.length && item.label.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1
          ? getParentKey(item.id, item.parent as string, filterData)
          : null
      )
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys as string[]);
    dispatch(
      setLocationTreeState({
        keys: expandedKeys as React.Key[],
        node: locationTreeState?.node as ParsedHierarchyNode,
      })
    );
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (locationTreeState?.node) {
      const node = getHierarchyNodeFromArray(filterData, locationTreeState.node.id);
      if (node) {
        onExpand(locationTreeState.keys);
        OnItemClick(node);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Return the the parent key in a tree for the supplied key
   *
   * @param {string} key the key to find parent of
   * @param {string} parentId the id of current node
   * @param {Array<ParsedHierarchyNode>} tree the orignal tree
   * @returns {string} - returns parent key
   */
  function getParentKey(key: string, parentId: string, tree: ParsedHierarchyNode[]): string {
    let nodeKey = '';
    tree.forEach((node) => {
      if (node.children) {
        if (node.children.some((item: ParsedHierarchyNode) => item.parent === parentId)) {
          nodeKey = node.key;
        } else if (getParentKey(key, parentId, node.children))
          return getParentKey(key, parentId, node.children);
      } else {
        nodeKey = node.parent as string;
      }
    });
    return nodeKey;
  }

  /** Function to handle event when a tree is expanded
   *
   * @param allExpandedKeys currently expanded keys
   */
  function onExpand(allExpandedKeys: Key[]) {
    if (expandedKeys.length !== 0) {
      for (let i = 0; i < expandedKeys.length; i++) {
        if (expandedKeys[i] !== allExpandedKeys[i]) {
          allExpandedKeys.length = i;
          break;
        }
      }
    }
    setExpandedKeys(allExpandedKeys);
  }

  /** Function to handle event when tree search input changes value
   *
   * @param {ChangeEvent<HTMLInputElement>} event the actual event
   */
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearchValue(value);
    expandTree(value);
  }

  /** process the data before it could be displayed in tree
   *
   * @param {Array<ParsedHierarchyNode[]>} data the tree data to preprocess
   * @returns {object} - returns obj with title, key and children
   */
  const buildTreeData = React.useCallback(
    (data: ParsedHierarchyNode[]): AntTreeProps[] => {
      return data.map((item) => {
        const index = item.title.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = item.title.toLowerCase().substr(0, index);
        const afterStr = item.title.toLowerCase().substr(index + searchValue.length);
        const title = (
          <span key={item.id}>
            {searchValue.length > 0 && index > -1 ? (
              <>
                {beforeStr}
                <span className="searchValue">{searchValue}</span>
                {afterStr}
              </>
            ) : (
              item.title
            )}
          </span>
        );

        return {
          // important : we are mixing the antTreeProps with ParsedHierarchyNode
          data: item,
          key: item.key,
          title: title,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ...(item.children && { children: buildTreeData(item.children) }),
        } as AntTreeProps;
      });
    },
    [searchValue]
  );

  /** Generate filter data to later used to compare and filter keys on input with ant tree node
   *
   * @param {Array<ParsedHierarchyNode>} data the tree data to preprocess
   */
  const generateFilterData = React.useCallback(
    (data: ParsedHierarchyNode[]) => {
      data.forEach((node) => {
        filterData.push({ ...node });
        if (node.children) {
          generateFilterData(node.children);
        }
      });
    },
    [filterData]
  );

  React.useMemo(() => {
    generateFilterData(data);
  }, [data, generateFilterData]);

  if (!data.length) {
    return null;
  }

  // se we want to support a usecase where a node is selected but can be collapsed
  return (
    <div>
      <Input
        className="mb-3"
        placeholder={lang.SEARCH}
        size="large"
        prefix={<SearchOutlined />}
        onChange={onChange}
      />
      <AntTree
        onClick={(_, antTreeNode) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const node = (antTreeNode as any).data as ParsedHierarchyNode; // seperating all data mixed with ParsedHierarchyNode
          OnItemClick(node);
          const allExpandedKeys = [...new Set([...expandedKeys, node.key])];
          const index = expandedKeys.indexOf(node.key);
          if (index > -1) {
            allExpandedKeys.splice(index, 1);
          }
          dispatch(setLocationTreeState({ keys: allExpandedKeys, node }));
          onExpand(allExpandedKeys);
        }}
        selectedKeys={[locationTreeState?.keys[locationTreeState.keys.length - 1]] as React.Key[]}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={true}
        treeData={buildTreeData(data)}
      />
    </div>
  );
};

export default Tree;
