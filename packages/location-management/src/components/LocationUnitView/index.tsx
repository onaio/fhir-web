/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
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
  API_BASE_URL,
  LOCATION_UNIT_FINDBYPROPERTIES,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_GET,
  URL_LOCATION_UNIT_ADD,
} from '../../constants';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import { Ripple } from '@onaio/loaders';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  getCurrentChildren,
  fetchAllHierarchies,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { generateJurisdictionTree } from '../LocationTree/utils';

import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/types';

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
export const loadSingleLocation = (
  row: TableData,
  accessToken: string,
  setDetail: (isLoading: string | LocationUnit) => void
): void => {
  setDetail('loading');
  const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_GET);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  serve
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => setDetail(res))
    .catch(() => sendErrorNotification('An error occurred'));
};

export const LocationUnitView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const Treedata = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );

  const currentParentChildren = (useSelector((state) =>
    getCurrentChildren(state)
  ) as unknown) as ParsedHierarchyNode[];
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);

  useEffect(() => {
    if (!Treedata.length) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_FINDBYPROPERTIES);
      serve
        .list({
          is_jurisdiction: true,
          return_geometry: false,
          properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
        })
        .then((response: LocationUnit[]) => {
          dispatch(fetchLocationUnits(response));
          const rootIds = response.map((rootLocObj) => rootLocObj.id);
          if (rootIds.length) {
            rootIds.forEach((id) => {
              const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_HIERARCHY);
              serve
                .read(id)
                .then((res: RawOpenSRPHierarchy) => {
                  const hierarchy = generateJurisdictionTree(res);
                  // if (hierarchy.model && hierarchy.model.children)
                  dispatch(fetchAllHierarchies(hierarchy.model));
                })
                .catch(() => sendErrorNotification('An error occurred'));
            });
          }
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [Treedata.length, accessToken, dispatch]);

  useEffect(() => {
    const data: TableData[] = [];
    if (currentParentChildren.length) {
      currentParentChildren.forEach((child: ParsedHierarchyNode, i: number) => {
        data.push({
          id: child.id,
          key: i.toString(),
          name: child.label,
          geographicLevel: child.node.attributes.geographicLevel,
        });
      });
    } else if (Treedata.length && !currentParentChildren.length) {
      Treedata.forEach((location: ParsedHierarchyNode, i: number) => {
        data.push({
          id: location.id,
          key: i.toString(),
          name: location.label,
          geographicLevel: location.node.attributes.geographicLevel,
        });
      });
    }
    setTableData(data);
  }, [Treedata, currentParentChildren]);

  if (!tableData.length || !Treedata.length) return <Ripple />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={Treedata} />
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
              onViewDetails={loadSingleLocation}
              accessToken={accessToken}
              setDetail={setDetail as (isLoading: string | LocationUnit) => void}
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
