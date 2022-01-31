/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  LocationUnit,
  locationUnitsReducer,
  locationUnitsReducerName,
} from '../../ducks/location-units';
import {
  LOCATION_HIERARCHY,
  LOCATION_UNIT_ENDPOINT,
  LOCATION_UNIT_FIND_BY_PROPERTIES,
  URL_LOCATION_UNIT_ADD,
} from '../../constants';
import { useQuery, useQueries, UseQueryResult } from 'react-query';
import lang, { Lang } from '../../lang';
import useDeepCompareEffect from 'use-deep-compare-effect';
import Table, { TableData } from './Table';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';
import { generateJurisdictionTree, getBaseTreeNode } from '../../ducks/locationHierarchy/utils';
import './LocationUnitList.css';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

interface Props {
  opensrpBaseURL: string;
  filterByParentId?: boolean;
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

export const LocationUnitList: React.FC<Props> = (props: Props) => {
  const { opensrpBaseURL, filterByParentId } = props;
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentClickedNode, setCurrentClickedNode] = useState<ParsedHierarchyNode | null>(null);

  const locationUnits = useQuery(
    LOCATION_UNIT_FIND_BY_PROPERTIES,
    () => getBaseTreeNode(opensrpBaseURL, filterByParentId),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: LocationUnit[]) => res,
    }
  );

  const treeDataQuery = useQueries(
    locationUnits.data
      ? locationUnits.data.map((location) => {
          return {
            queryKey: [LOCATION_HIERARCHY, location.id],
            queryFn: () => new OpenSRPService(LOCATION_HIERARCHY, opensrpBaseURL).read(location.id),
            onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
            // Todo : useQueries doesn't support select or types yet https://github.com/tannerlinsley/react-query/pull/1527
            select: (res: RawOpenSRPHierarchy) => generateJurisdictionTree(res).model,
          };
        })
      : []
  ) as UseQueryResult<ParsedHierarchyNode>[];

  const treeData = treeDataQuery
    .map((query) => query.data)
    .filter((e) => e !== undefined) as ParsedHierarchyNode[];

  useDeepCompareEffect(() => {
    if (treeData.length) {
      const titledata = currentClickedNode ?? null;
      const childrendata: ParsedHierarchyNode[] = currentClickedNode
        ? [...(currentClickedNode.children ?? [])]
        : [...treeData];

      const sorteddata = childrendata.sort((a, b) => a.title.localeCompare(b.title));
      const hierarchy: ParsedHierarchyNode[] = titledata
        ? [...[titledata], ...sorteddata]
        : sorteddata;

      const data: TableData[] = hierarchy.map((location) => {
        return {
          label: location.label,
          id: location.id,
          geographicLevel: location.node.attributes.geographicLevel,
        };
      });

      setTableData(data);
    }
  }, [treeDataQuery, currentClickedNode]);

  if (
    tableData.length === 0 ||
    treeData.length === 0 ||
    !locationUnits.data ||
    treeData.length !== locationUnits.data.length
  )
    return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.LOCATION_UNIT}</title>
      </Helmet>
      <h1 className="mb-3 fs-5">{lang.LOCATION_UNIT_MANAGEMENT}</h1>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentClickedNode(node)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h6 className="mt-4">{currentClickedNode ? tableData[0].label : lang.LOCATION_UNIT}</h6>
            <div>
              <Link
                to={(location) => {
                  let query = '?';
                  if (currentClickedNode) query += `parentId=${currentClickedNode.id}`;
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
