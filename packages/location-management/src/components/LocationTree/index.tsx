import React, { ChangeEvent, useEffect, useState } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/types';
import reducer, {
  fetchAllHierarchies,
  getAllHierarchiesArray,
  reducerName,
} from '../../ducks/location-hierarchy';
import './tree.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocationUnits, LocationUnit } from '../../ducks/location-units';
import { sendErrorNotification } from '@opensrp/notifications';
import { generateJurisdictionTree } from './utils';
import { LOCATION_HIERARCHY, LOCATION_UNIT_FINDBYPROPERTIES } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
reducerRegistry.register(reducerName, reducer);

const { getFilterParams } = OpenSRPService;

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

interface TreeProp {
  opensrpBaseURL: string;
  accessToken: string;
  OnItemClick: (item: ParsedHierarchyNode) => void;
}

/** Gets the hierarchy of the location units
 *
 * @param {Array<LocationUnit>} location - array of location units to get hierarchy of
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(
  location: LocationUnit[],
  accessToken: string,
  opensrpBaseURL: string
) {
  const hierarchy: RawOpenSRPHierarchy[] = [];
  for await (const loc of location) {
    const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_HIERARCHY);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}

/** Gets all the location unit at geographicLevel 0
 *
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(accessToken: string, opensrpBaseURL: string) {
  const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_FINDBYPROPERTIES);
  return await serve
    .list({
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      is_jurisdiction: true,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      return_geometry: false,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    })
    .then((response: LocationUnit[]) => response);
}

const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { OnItemClick, accessToken, opensrpBaseURL } = props;

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const treeData = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as ParsedHierarchyNode[];
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const filterData: ParsedHierarchyNode[] = [];

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!treeData.length) {
      getBaseTreeNode(accessToken, opensrpBaseURL)
        .then(async (response) => {
          dispatch(fetchLocationUnits(response));
          const hierarchy = await getHierarchy(response, accessToken, opensrpBaseURL);
          hierarchy.forEach((hier) => {
            const processed = generateJurisdictionTree(hier);
            dispatch(fetchAllHierarchies(processed.model));
          });
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [accessToken, dispatch, opensrpBaseURL, treeData.length]);

  generateFilterData(treeData);

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
          setExpandedKeys(allExpandedKeys);
        }}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={buildTreeData(treeData)}
      />
    </div>
  );
};

export default Tree;
