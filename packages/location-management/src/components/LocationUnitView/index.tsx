/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import reducer, { reducerName } from '../../ducks/location-hierarchy';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import locationUnitsReducer, {
  fetchLocationUnits,
  LocationUnit,
  reducerName as locationUnitsReducerName,
} from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import {
  LOCATION_UNIT_FINDBYPROPERTIES,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_GET,
  URL_LOCATION_UNIT_ADD,
} from '../../constants';
import { API_BASE_URL } from '../../configs/env';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import { Ripple } from '@onaio/loaders';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { generateJurisdictionTree } from '../LocationTree/utils';

import { ParsedHierarchyNode, RawOpenSRPHierarchy, TreeNode } from '../../ducks/types';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

const { getFilterParams } = OpenSRPService;

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

/** Function to Load selected location unit for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} accessToken - access token
 * @param {Function} setDetail funtion to set detail to state
 */
export function loadSingleLocation(
  row: TableData,
  accessToken: string,
  setDetail: React.Dispatch<React.SetStateAction<LocationDetailData | 'loading' | null>>
): void {
  setDetail('loading');
  const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_GET);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  serve
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => {
      setDetail(res);
    })
    .catch(() => sendErrorNotification('An error occurred'));
}

/** Gets all the location unit at geographicLevel 0
 *
 * @param {string} accessToken - Access token to be used for requests
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(accessToken: string) {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_FINDBYPROPERTIES);
  return await serve
    .list({
      is_jurisdiction: true,
      return_geometry: false,
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    })
    .then((response: LocationUnit[]) => response);
}

/** Parse the hierarchy node into table data
 *
 * @param {Array<ParsedHierarchyNode>} hierarchy - hierarchy node to be parsed
 * @returns {Array<TableData>} array of table data
 */
export function parseTableData(hierarchy: ParsedHierarchyNode[]) {
  const data: TableData[] = [];

  hierarchy.forEach((location, i: number) => {
    data.push({
      id: location.id,
      key: i.toString(),
      name: location.label,
      geographicLevel: location.node.attributes.geographicLevel,
    });
  });
  return data;
}

/** Gets the hierarchy of the location units
 *
 * @param {Array<LocationUnit>} location - array of location units to get hierarchy of
 * @param {string} accessToken - Access token to be used for requests
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(location: LocationUnit[], accessToken: string) {
  const hierarchy: RawOpenSRPHierarchy[] = [];

  for await (const loc of location) {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_HIERARCHY);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}

export const LocationUnitView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const treeData = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as ParsedHierarchyNode[];
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);

  useEffect(() => {
    if (!treeData.length) {
      getBaseTreeNode(accessToken)
        .then((response) => {
          dispatch(fetchLocationUnits(response));
          getHierarchy(response, accessToken)
            .then((hierarchy) => {
              hierarchy.forEach((hier) => {
                const processed = generateJurisdictionTree(hier);
                dispatch(fetchAllHierarchies(processed.model));
              });
            })
            .catch(() => sendErrorNotification('An error occurred'));
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [treeData, accessToken, dispatch]);

  useEffect(() => {
    const data = parseTableData(currentParentChildren.length ? currentParentChildren : treeData);
    setTableData(data);
  }, [treeData, currentParentChildren]);

  if (!tableData.length || !treeData.length) return <Ripple />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data={treeData}
            OnItemClick={(node) => {
              if (node.children) {
                const children = [node, ...node.children];
                setCurrentParentChildren(children);
              }
            }}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Link to={URL_LOCATION_UNIT_ADD}>
                <Button type="primary">
                  <PlusOutlined />
                  Add location unit
                </Button>
              </Link>
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Logout</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button shape="circle" icon={<SettingOutlined />} type="text" />
              </Dropdown>
            </div>
          </div>
          <div className="bg-white p-3">
            <Table
              data={tableData}
              onViewDetails={(row) => {
                loadSingleLocation(row, accessToken, setDetail);
              }}
            />
          </div>
        </Col>

        {detail ? (
          <Col className="pl-3" span={5}>
            {detail === 'loading' ? (
              <Ripple />
            ) : (
              <LocationUnitDetail onClose={() => setDetail(null)} {...detail} />
            )}
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};

export default LocationUnitView;
