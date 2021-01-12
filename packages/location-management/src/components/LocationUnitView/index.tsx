import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider, Spin } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import locationUnitsReducer, {
  LocationUnit,
  reducerName as locationUnitsReducerName,
} from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import {
  LOCATION_UNIT_GET,
  URL_LOCATION_UNIT_ADD,
  ADD_LOCATION_UNIT,
  LOCATION_UNIT,
  LOCATION_UNIT_MANAGEMENT,
  LOGOUT,
} from '../../constants';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';

import { ParsedHierarchyNode } from '../../ducks/types';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export interface Props {
  opensrpBaseURL: string;
}

/** Function to Load selected location unit for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} accessToken - access token
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail funtion to set detail to state
 */
export function loadSingleLocation(
  row: TableData,
  accessToken: string,
  opensrpBaseURL: string,
  setDetail: React.Dispatch<React.SetStateAction<LocationDetailData | 'loading' | null>>
): void {
  setDetail('loading');
  const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_GET);
  serve
    // eslint-disable-next-line @typescript-eslint/camelcase
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => setDetail(res))
    .catch(() => sendErrorNotification('An error occurred'));
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

export const LocationUnitView: React.FC<Props> = (props: Props) => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);

  const treeData = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as ParsedHierarchyNode[];
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    const data = parseTableData(currentParentChildren.length ? currentParentChildren : treeData);
    setTableData(data);
  }, [treeData, currentParentChildren]);

  return (
    <section className="layout-content">
      <Helmet>
        <title>{LOCATION_UNIT}</title>
      </Helmet>
      {(!tableData.length || !treeData.length) && (
        // This condition will become false one the tree data is loaded from the tree component
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        <Spin size={'large'} />
      )}
      <h5 className="mb-3">{LOCATION_UNIT_MANAGEMENT}</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            opensrpBaseURL={opensrpBaseURL}
            accessToken={accessToken}
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
                  {ADD_LOCATION_UNIT}
                </Button>
              </Link>
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">{LOGOUT}</Menu.Item>
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
                loadSingleLocation(row, accessToken, opensrpBaseURL, setDetail);
              }}
            />
          </div>
        </Col>

        {detail ? (
          <Col className="pl-3" span={5}>
            {detail === 'loading' ? (
              <Spin
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                size={'large'}
              />
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
