/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import {
  locationUnitsReducer,
  locationUnitsReducerName,
  fetchLocationUnits,
  LocationUnit,
} from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import {
  LOCATION_UNIT_GET,
  URL_LOCATION_UNIT_ADD,
  ADD_LOCATION_UNIT,
  LOCATION_UNIT,
  LOCATION_UNIT_MANAGEMENT,
  ERROR_OCCURED,
} from '../../constants';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  hierarchyReducer,
  getTreesByIds,
  fetchTree,
  hierarchyReducerName,
} from '../../ducks/locationHierarchy';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';
import { loadHierarchy, loadJurisdictions } from 'location-management/src/helpers/dataLoaders';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
const hierarchySelector = getTreesByIds();

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  serve
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => {
      setDetail(res);
    })
    .catch(() => sendErrorNotification(ERROR_OCCURED));
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
  const treeFilters = {};
  const hierarchies = useSelector((state) => hierarchySelector(state, treeFilters));
  const treeData = hierarchies.map((tree) => tree.model);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [currentClicked, setCurrentClicked] = useState<ParsedHierarchyNode | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    const treesDispatcher = (res: RawOpenSRPHierarchy) => dispatch(fetchTree(res));
    loadJurisdictions(undefined, undefined, undefined, opensrpBaseURL)
      .then((response) => {
        if (response) {
          dispatch(fetchLocationUnits(response));
          const promises = response
            .map((location) => location.id.toString())
            .map((locationId) =>
              loadHierarchy(locationId, treesDispatcher, undefined, opensrpBaseURL)
            );
          Promise.all(promises).catch((error) => {
            throw error;
          });
        }
      })
      .catch(() => sendErrorNotification('An error occurred'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, accessToken, opensrpBaseURL]);

  useEffect(() => {
    const data = parseTableData(currentParentChildren.length ? currentParentChildren : treeData);
    setTableData(data);
  }, [treeData, currentParentChildren]);

  // TODO - preferably show a message that indicates there was no data to display
  if (!tableData.length || !treeData.length)
    return (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
        size={'large'}
      />
    );

  return (
    <section className="layout-content">
      <Helmet>
        <title>{LOCATION_UNIT}</title>
      </Helmet>
      <h5 className="mb-3">{LOCATION_UNIT_MANAGEMENT}</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data={treeData}
            OnItemClick={(node) => {
              setCurrentClicked(node);
              if (node.children) {
                const children = [node, ...node.children];
                setCurrentParentChildren(children);
              }
            }}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h5 className="mt-4">
              {currentParentChildren.length ? tableData[0].name : 'Locations Unit'}
            </h5>
            <div>
              <Link
                to={(location) => {
                  let query = '?';
                  if (currentClicked) query += `parentId=${currentClicked.id}`;
                  return { ...location, pathname: URL_LOCATION_UNIT_ADD, search: query };
                }}
              >
                <Button type="primary">
                  <PlusOutlined />
                  {ADD_LOCATION_UNIT}
                </Button>
              </Link>
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
