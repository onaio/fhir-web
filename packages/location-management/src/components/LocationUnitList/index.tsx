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
import { LOCATION_UNIT_ENDPOINT, URL_LOCATION_UNIT_ADD } from '../../constants';
import lang, { Lang } from '../../lang';
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
import './LocationUnitList.css';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

interface Props {
  opensrpBaseURL: string;
}

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

/** Function to Load selected location unit for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail function to set detail to state
 * @param {Lang} langObj translation string lookup
 */
export async function loadSingleLocation(
  row: TableData,
  opensrpBaseURL: string,
  setDetail: React.Dispatch<React.SetStateAction<LocationDetailData | 'loading' | null>>,
  langObj: Lang = lang
) {
  setDetail('loading');
  const serve = new OpenSRPService(LOCATION_UNIT_ENDPOINT, opensrpBaseURL);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return await serve
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => {
      setDetail(res);
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
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

export const LocationUnitList: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const treeData = useSelector((state) => getAllHierarchiesArray(state));
  const locationUnits = useSelector((state) => getLocationUnitsArray(state));
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentClicked, setCurrentClicked] = useState<ParsedHierarchyNode | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    // clear tree data and location units if
    // user switches to location management module
    // from a module that needs only one hierarchy i.e teams assignment
    if (treeData.length && treeData.length !== locationUnits.length) {
      dispatch(fetchLocationUnits([]));
      dispatch(fetchAllHierarchies([]));
    }
  });

  useEffect(() => {
    if (!locationUnits.length) {
      getBaseTreeNode(opensrpBaseURL)
        .then((response: LocationUnit[]) => dispatch(fetchLocationUnits(response)))
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationUnits.length, treeData.length]);

  // Function used to parse data from ParsedHierarchyNode to Tree Data
  useEffect(() => {
    if (!treeData.length && locationUnits.length) {
      setLoading(true);
      getHierarchy(locationUnits, opensrpBaseURL)
        .then((hierarchy: RawOpenSRPHierarchy[]) => {
          const allhierarchy = hierarchy.map((hier) => generateJurisdictionTree(hier).model);
          dispatch(fetchAllHierarchies(allhierarchy));
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setLoading(false));
    }
    // to avoid extra rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationUnits.length, treeData.length, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (treeData.length) {
      // if have selected some in tree and that selected have some child then only show data from selected node in table
      if (currentClicked && currentClicked.children && currentClicked.children.length) {
        const cloneddata = [...currentClicked.children];
        const sorteddata = cloneddata.sort((a, b) => a.title.localeCompare(b.title));
        const data: TableData[] = parseTableData([currentClicked, ...sorteddata]);
        setTableData(data);
      } else if (!currentClicked) {
        const cloneddata = [...treeData];
        const sorteddata = cloneddata.sort((a, b) => a.title.localeCompare(b.title));
        const data: TableData[] = parseTableData(sorteddata);
        setTableData(data);
      }
    }
  }, [treeData, currentClicked]);

  if (loading) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.LOCATION_UNIT}</title>
      </Helmet>
      <h1 className="mb-3 fs-5">{lang.LOCATION_UNIT_MANAGEMENT}</h1>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentClicked(node)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h6 className="mt-4">
              {currentClicked?.children ? currentClicked.node.name : lang.LOCATION_UNIT}
            </h6>
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
                  {lang.ADD_LOCATION_UNIT}
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

export default LocationUnitList;
