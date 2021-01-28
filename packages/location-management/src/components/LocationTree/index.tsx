import React, { ChangeEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { LocationTreeState } from '../../ducks/types';
import {
  getLocationTreeState,
  reducerName,
  setLocationTreeState,
  reducer,
} from '../../ducks/location-hierarchy';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { AntTreeProps } from '../LocationUnitView';
import './tree.css';
import { Dictionary } from '@onaio/utils';
reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: ParsedHierarchyNode[];
  OnItemClick: (item: ParsedHierarchyNode) => void;
}

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, OnItemClick } = props;

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchyNode[] = [];

  const locationTreeState = useSelector(
    (state) => (getLocationTreeState(state) as Dictionary) as LocationTreeState
  );

  const dispatch = useDispatch();

  /**
   * Function to to expand tree
   *
   * @param {string} value - value to be searched and expanded
   */
  function expandTree(value: string) {
    const expandedKeys = filterData
      .map((item) =>
        value.length && item.label.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1
          ? getParentKey(item.id, filterData)
          : null
      )
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys as string[]);
    setSearchValue(value);
    setAutoExpandParent(value.length > 0);
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (locationTreeState.keys) {
      const keys = locationTreeState.keys;
      const node = locationTreeState.node;
      OnItemClick(node);
      expandTree(node.key);
      setExpandedKeys(keys);
      setSelectedKey([keys[keys.length - 1]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Return the the parent key in a tree for the supplied key
   *
   * @param {string} key the key to find parent of
   * @param {Array<ParsedHierarchyNode>} tree the orignal tree
   * @returns {string} - returns parent key
   */
  function getParentKey(key: string, tree: ParsedHierarchyNode[]): string {
    let nodeKey = '';
    tree.forEach((node) => {
      if (node.children) {
        if (node.children.some((item: ParsedHierarchyNode) => item.parent === key)) {
          nodeKey = node.key;
        } else if (getParentKey(key, node.children)) return getParentKey(key, node.children);
      }
    });
    return nodeKey;
  }

  /** Function to handle event when a tree is expanded
   *
   * @param {Array<React.Key>} allExpandedKeys currently expanded keys
   */
  function onExpand(allExpandedKeys: React.Key[]) {
    if (expandedKeys.length !== 0) {
      for (let i = 0; i < expandedKeys.length; i++) {
        if (expandedKeys[i] !== allExpandedKeys[i]) {
          allExpandedKeys.length = i;
          break;
        }
      }
    }
    setExpandedKeys(allExpandedKeys);
    setAutoExpandParent(true);
  }

  /** Function to handle event when tree search input changes value
   *
   * @param {ChangeEvent<HTMLInputElement>} event the actual event
   */
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    expandTree(value);
  }

  /** process the data before it could be displayed in tree
   *
   * @param {Array<ParsedHierarchyNode[]>} data the tree data to preprocess
   * @returns {object} - returns obj with title, key and children
   */
  function buildTreeData(data: ParsedHierarchyNode[]): AntTreeProps[] {
    return data.map((item) => {
      const index = item.title.toLowerCase().indexOf(searchValue);
      const beforeStr = item.title.toLowerCase().substr(0, index);
      const afterStr = item.title.toLowerCase().substr(index + searchValue.length);
      const title = (
        <span>
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
        children: item.children ? buildTreeData(item.children) : undefined,
      } as AntTreeProps;
    });
  }

  /** Generate filter data to later used to compare and filter keys on input with ant tree node
   *
   * @param {Array<ParsedHierarchyNode[]>} data the tree data to preprocess
   */
  function generateFilterData(data: ParsedHierarchyNode[]) {
    data.forEach((node) => {
      filterData.push({ ...node, title: node.key });
      if (node.children) generateFilterData(node.children);
    });
  }

  generateFilterData(data);

  return (
    <div>
      <Input
        className="mb-3"
        placeholder="Search"
        size="large"
        prefix={<SearchOutlined />}
        onChange={onChange}
      />
      <AntTree
        onClick={(e, treenode) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const node = (treenode as any).data as ParsedHierarchyNode; // seperating all data mixed with ParsedHierarchyNode
          OnItemClick(node);
          const allExpandedKeys = [...new Set([...expandedKeys, node.key])];
          setSelectedKey([allExpandedKeys[allExpandedKeys.length - 1]]);
          dispatch(setLocationTreeState({ keys: allExpandedKeys, node }));
          const index = expandedKeys.indexOf(node.key);
          if (index > -1) {
            allExpandedKeys.splice(index, 1);
          }
          onExpand(allExpandedKeys);
        }}
        selectedKeys={selectedKey}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={buildTreeData(data)}
      />
    </div>
  );
};

export default Tree;
