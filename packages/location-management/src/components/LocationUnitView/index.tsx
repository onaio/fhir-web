/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  fetchLocationUnits,
  getLocationUnitsArray,
  LocationUnit,
  locationUnitsReducer,
  locationUnitsReducerName,
} from '../../ducks/location-units';
import {
  LOCATION_HIERARCHY,
  LOCATION_UNIT_GET,
  URL_LOCATION_UNIT_ADD,
  ADD_LOCATION_UNIT,
  LOCATION_UNIT,
  LOCATION_UNIT_MANAGEMENT,
  ERROR_OCCURED,
} from '../../constants';
import Table, { TableData } from './Table';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';
import {
  generateJurisdictionTree,
  getBaseTreeNode,
  getHierarchy,
} from '../../ducks/locationHierarchy/utils';
import { Props } from '../../ducks/types';
import './LocationUnitView.css';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

/** Function to Load selected location unit for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail funtion to set detail to state
 */
export async function loadSingleLocation(
  row: TableData,
  opensrpBaseURL: string,
  setDetail: React.Dispatch<React.SetStateAction<LocationDetailData | 'loading' | null>>
) {
  setDetail('loading');
  const serve = new OpenSRPService(LOCATION_UNIT_GET, opensrpBaseURL);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return await serve
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
  const treeData = useSelector((state) => getAllHierarchiesArray(state));
  const locationUnits = useSelector((state) => getLocationUnitsArray(state));
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [currentClicked, setCurrentClicked] = useState<ParsedHierarchyNode | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    if (!locationUnits.length) {
      getBaseTreeNode(opensrpBaseURL)
        .then((response) => dispatch(fetchLocationUnits(response)))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnits.length, dispatch, opensrpBaseURL, locationUnits]);

  useEffect(() => {
    if (!treeData.length && locationUnits.length) {
      getHierarchy(locationUnits, opensrpBaseURL)
        .then((hierarchy) => {
          const allhierarchy = hierarchy.map((hier) => generateJurisdictionTree(hier).model);
          dispatch(fetchAllHierarchies(allhierarchy));
          console.log('allhierarchy:', allhierarchy);
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnits.length, treeData.length, dispatch, opensrpBaseURL, locationUnits]);

  useEffect(() => {
    if (treeData.length) {
      const data = parseTableData(currentParentChildren.length ? currentParentChildren : treeData);
      setTableData(data);
    }
  }, [treeData.length, currentParentChildren.length, treeData, currentParentChildren]);

  if (!Array.isArray(treeData) || !treeData.length || !tableData.length)
    return <Spin size={'large'} />;

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
              onViewDetails={async (row) => {
                await loadSingleLocation(row, opensrpBaseURL, setDetail);
              }}
            />
          </div>
        </Col>

        {detail ? (
          <Col className="pl-3" span={5}>
            {detail === 'loading' ? (
              <Spin size={'large'} />
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
