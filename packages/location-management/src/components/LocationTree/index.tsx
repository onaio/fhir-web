import React, { ChangeEvent, useState, useEffect } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ParsedHierarchyNode } from '../../ducks/types';
import reducer, { reducerName } from '../../ducks/location-hierarchy';
import { AntTreeProps } from '../LocationUnitView';
import './tree.css';
reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: ParsedHierarchyNode[];
  OnItemClick: (item: ParsedHierarchyNode) => void;
}

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, OnItemClick } = props;

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchyNode[] = [];

  /**
   * Function to to expand tree
   *
   * @param {string} value - value to be searched and expanded
   */
  function expandTree(value: string) {
    const expandedKeys = filterData
      .map((item) =>
        value.length && item.label.toLocaleLowerCase().indexOf(value) > -1
          ? getParentKey(item.id, filterData)
          : null
      )
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys as string[]);
    setSearchValue(value);
    setAutoExpandParent(value.length > 0);
  }

  useEffect(() => {
    const tree = localStorage.getItem('tree');
    if (tree) {
      const keys = JSON.parse(tree).keys;
      const node = JSON.parse(tree).node;
      setExpandedKeys(keys);
      OnItemClick(node);
      expandTree(node.key);
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
    setExpandedKeys(allExpandedKeys);
    setAutoExpandParent(true);
  }

  /** Function to handle event when tree serach input changes value
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
          const allExpandedKeys = [...new Set([...expandedKeys, node.id])];
          localStorage.setItem('tree', JSON.stringify({ keys: allExpandedKeys, node }));
          setExpandedKeys(allExpandedKeys);
        }}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={buildTreeData(data)}
      />
    </div>
  );
};

export default Tree;
