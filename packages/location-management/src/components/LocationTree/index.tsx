import React, { useState } from 'react';
import { Input, Tree as AnyTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { TreeNode } from './utils';
import reducer, { reducerName } from '../../ducks/location-hierarchy';

reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: TreeNode[];
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
  const filterData: any = [];

  function getParentKey(key: any, tree: string | any[]): any {
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

  function onExpand(expandedKeys: any) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  }

  function onChange(e: { target: { value: any } }) {
    const { value } = e.target;
    const expandedKeys = filterData
      .map((item: any) =>
        item.title.indexOf(value) > -1 ? getParentKey(item.key, props.data) : null
      )
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  }

  function loop(data: any[]): any {
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
      return { title, key: item.key };
    });
  }

  const generateFilterData = (data: string | any[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      filterData.push({ key, title: key });
      if (node.children) generateFilterData(node.children);
    }
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
      <AnyTree
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
