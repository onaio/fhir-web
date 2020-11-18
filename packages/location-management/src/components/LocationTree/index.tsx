import React, { ChangeEvent, useState } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ParsedHierarchySingleNode } from './utils';
import reducer, { reducerName } from '../../ducks/location-hierarchy';

reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: ParsedHierarchySingleNode[];
  OnItemClick?: (item: any, [expandedKeys, setExpandedKeys]: any) => void;
}

const defaultProps: TreeProp = {
  data: [],
};

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, OnItemClick } = props;

  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchySingleNode[] = [];

  /** Return the the parent key in a tree for the supplied key
   *
   * @param {any} key the key to find parent of
   * @param {Array<ParsedHierarchySingleNode>} tree the orignal tree
   */
  function getParentKey(key: any, tree: ParsedHierarchySingleNode[]): any {
    tree.forEach((node) => {
      if (node.children) {
        if (node.children.some((item: { key: any }) => item.key === key)) return node.key;
        else if (getParentKey(key, node.children)) return getParentKey(key, node.children);
      }
    });
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
    const expandedKeys = filterData
      .map((item) => (item.title.indexOf(value) > -1 ? getParentKey(item.key, props.data) : null))
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  }

  /** process the data before it could be displayed in tree
   *
   * @param {Array<ParsedHierarchySingleNode[]>} data the tree data to preprocess
   */
  function loop(data: ParsedHierarchySingleNode[]): any {
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

  const generateFilterData = (data: ParsedHierarchySingleNode[]) => {
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
