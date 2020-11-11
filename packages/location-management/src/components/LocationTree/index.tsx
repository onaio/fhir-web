import React, { useState } from 'react';
import { Input, Tree as AnyTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { generateJurisdictionTree, RawOpenSRPHierarchy, TreeNode } from './utils';
import reducer, {
  fetchAllHierarchies,
  fetchCurrentChildren,
  getAllHierarchiesArray,
  reducerName,
} from '../../ducks/location-hierarchy';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../../constants';

reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  data: TreeData[];
  rootIds: string[];
}

export interface TreeData {
  title: string;
  key: string;
  children?: TreeData[];
}

const defaultProps: TreeProp = {
  data: [],
  rootIds: [],
};

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const data = useSelector((state) => (getAllHierarchiesArray(state) as unknown) as TreeNode[]);
  const dispatch = useDispatch();

  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: any = [];

  React.useEffect(() => {
    if (props.rootIds.length && isLoading && !data.length) {
      props.rootIds.forEach((id: string) => {
        const serve = new OpenSRPService(accessToken, API_BASE_URL, '/location/hierarchy');
        serve
          .read(id)
          .then((res: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(res);
            if (hierarchy.model && hierarchy.model.children)
              dispatch(fetchAllHierarchies(hierarchy.model));
          })
          .catch((e) => console.log(e));
      });
      setIsLoading(false);
    }
  }, [props.rootIds]);

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
        <span
          onClick={() => {
            if (item.children) {
              // build out parent row info from here
              const children = [item, ...item.children];
              dispatch(fetchCurrentChildren(children));
              const allExpandedKeys = [...new Set([...expandedKeys, item.title])];
              setExpandedKeys(allExpandedKeys);
            }
          }}
        >
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
