import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ParsedHierarchySingleNode } from '../LocationTree/utils';

interface TreeProp {
  data: ParsedHierarchySingleNode[];
}

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchySingleNode[] = [];

  /** function to get the parent key of the supplied key from tree
   *
   * @param key
   * @param tree
   */
  function getParentKey(key: any, tree: ParsedHierarchySingleNode[]): any {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];

      if (node.children) {
        if (node.children.some((item: { key: any }) => item.key === key)) parentKey = node.key;
        else if (getParentKey(key, node.children)) parentKey = getParentKey(key, node.children);
      }
    }

    return parentKey;
  }

  /** Function to handle event when a tree is expanded
   *
   * @param expandedKeys
   */
  function onExpand(expandedKeys: any) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  }

  /** Function to handle event when tree serach input changes value
   *
   * @param event
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
   * @param data
   */
  function loop(data: any[]): any {
    return data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = (
        <span>
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
      return { title, key: item.key };
    });
  }

  const generateFilterData = (data: ParsedHierarchySingleNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      filterData.push({ ...node, title: key });
      if (node.children) generateFilterData(node.children);
    }
  };

  generateFilterData(props.data);

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
        treeData={loop(props.data)}
      />
    </div>
  );
};

export default Tree;
