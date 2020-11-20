import React, { ChangeEvent, useState } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ParsedHierarchyNode } from './utils';
import reducer, { reducerName } from '../../ducks/location-hierarchy';

reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: ParsedHierarchyNode[];
  OnItemClick?: (
    item: ParsedHierarchyNode,
    [expandedKeys, setExpandedKeys]: [any, Function]
  ) => void;
}

const defaultProps: TreeProp = {
  data: [],
};

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, OnItemClick } = props;

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchyNode[] = [];

  /** Return the the parent key in a tree for the supplied key
   *
   * @param {string} key the key to find parent of
   * @param {Array<ParsedHierarchyNode>} tree the orignal tree
   * @returns {string} - returns parent key
   */
  function getParentKey(key: string, tree: ParsedHierarchyNode[]): string {
    tree.forEach((node) => {
      if (node.children) {
        if (node.children.some((item: { key: string }) => item.key === key)) return node.key;
        else if (getParentKey(key, node.children)) return getParentKey(key, node.children);
      }
    });
    return '';
  }

  /** Function to handle event when a tree is expanded
   *
   * @param {Array<React.Key>} expandedKeys currently expanded keys
   */
  function onExpand(expandedKeys: React.Key[]) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  }

  /** Function to handle event when tree serach input changes value
   *
   * @param {ChangeEvent<HTMLInputElement>} event the actual event
   */
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    const expandedKey = filterData
      .map((item) => (item.title.indexOf(value) > -1 ? getParentKey(item.key, props.data) : null))
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys as string[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  }

  /** process the data before it could be displayed in tree
   *
   * @param {Array<ParsedHierarchyNode[]>} data the tree data to preprocess
   * @returns {object} - returns obj with title, key and children
   */
  function loop(data: ParsedHierarchyNode[]): any {
    return data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = (
        <span onClick={() => OnItemClick && OnItemClick(item, [expandedKeys, setExpandedKeys])}>
          {index > -1 ? (
            <>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </>
          ) : (
            item.title
          )}
        </span>
      );
      if (item.children) return { title, key: item.key, children: loop(item.children) };
      else return { title, key: item.key };
    });
  }

  const generateFilterData = (data: ParsedHierarchyNode[]) => {
    data.forEach((node) => {
      filterData.push({ ...node, title: node.key });
      if (node.children) generateFilterData(node.children);
    });
  };

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
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(data)}
      />
    </div>
  );
};

Tree.defaultProps = defaultProps;

export default Tree;
