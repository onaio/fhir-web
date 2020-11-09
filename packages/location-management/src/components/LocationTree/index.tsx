import React, { useState } from 'react';
import { Input, Tree as AnyTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { generateJurisdictionTree, RawOpenSRPHierarchy, TreeNode } from './utils';
import reducer, {
  fetchAllHierarchies,
  fetchCurrentChildren,
  getAllHierarchiesArray,
  reducerName,
} from '../../ducks/location-hierarchy';
import { connect } from 'react-redux';
import { Store } from 'redux';

reducerRegistry.register(reducerName, reducer);

interface TreeProp {
  accessToken: string;
  data: TreeData[];
  rootIds: string[];
  serviceClass: typeof OpenSRPService;
  fetchAllRootHierarchiesCreator: typeof fetchAllHierarchies;
  fetchCurrentChildrenCreator: typeof fetchCurrentChildren;
  hierarchiesArray: TreeNode[];
}

export interface TreeData {
  title: string;
  key: string;
  children?: TreeData[];
}

const defaultProps: TreeProp = {
  accessToken: '',
  data: [],
  hierarchiesArray: [],
  rootIds: [],
  serviceClass: OpenSRPService,
  fetchAllRootHierarchiesCreator: fetchAllHierarchies,
  fetchCurrentChildrenCreator: fetchCurrentChildren,
};

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const {
    serviceClass,
    accessToken,
    rootIds,
    fetchAllRootHierarchiesCreator,
    fetchCurrentChildrenCreator,
    hierarchiesArray,
  } = props;
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [children, setChildren] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: any = [];

  React.useEffect(() => {
    if (rootIds.length && isLoading && !hierarchiesArray.length) {
      rootIds.forEach((id: string) => {
        const serve = new serviceClass(
          accessToken,
          'https://opensrp-stage.smartregister.org/opensrp/rest/',
          '/location/hierarchy'
        );
        serve
          .read(id)
          .then((res: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(res);
            if (hierarchy.model && hierarchy.model.children) {
              fetchAllRootHierarchiesCreator(hierarchy.model);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      });
      setIsLoading(false);
    }
  }, [rootIds]);

  const data = hierarchiesArray;

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
          onClick={(e) => {
            if (item.children) {
              // e.stopPropagation();
              fetchCurrentChildrenCreator(item.children, item.title);
              setExpandedKeys([...expandedKeys, item.title]);
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

  if (!data) {
    return null;
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

export { Tree };

/** Interface for connected state to props */
interface DispatchedProps {
  hierarchiesArray: any;
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const hierarchiesArray = getAllHierarchiesArray(state);
  return { hierarchiesArray };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchAllRootHierarchiesCreator: fetchAllHierarchies,
  fetchCurrentChildrenCreator: fetchCurrentChildren,
};

const ConnectedTree = connect(mapStateToProps, mapDispatchToProps)(Tree);
export default ConnectedTree;
