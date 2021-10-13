/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { get } from 'lodash';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { OpenSRPService, FHIRServiceClass } from '@opensrp/react-utils';
import {
  LocationUnit,
  locationUnitsReducer,
  locationUnitsReducerName,
} from '../../ducks/location-units';
import {
  LOCATION_HIERARCHY,
  LOCATION_UNIT_FIND_BY_PROPERTIES,
  URL_LOCATION_UNIT_ADD,
} from '../../constants';
import { useQuery, useQueries, UseQueryResult } from 'react-query';
import lang from '../../lang';
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
import {
  generateFHIRLocationTree,
  generateJurisdictionTree,
  getBaseTreeNode,
} from '../../ducks/locationHierarchy/utils';
import './LocationUnitList.css';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

interface Props {
  opensrpBaseURL: string;
  fhirBaseURL: string;
  filterByParentId: boolean;
}

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
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
    });
  });
  return data;
}

export const LocationUnitList: React.FC<Props> = (props: Props) => {
  const { opensrpBaseURL, filterByParentId, fhirBaseURL } = props;
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detailId, setDetailId] = useState<string>();
  const [currentClickedNode, setCurrentClickedNode] = useState<ParsedHierarchyNode | null>(null);
  const serve = new FHIRServiceClass(fhirBaseURL, 'Location');

  const hierarchyParams = {
    identifier: 'eff94f33-c356-4634-8795-d52340706ba9',
  };

  const locationUnits = useQuery(
    LOCATION_UNIT_FIND_BY_PROPERTIES,
    () => getBaseTreeNode(opensrpBaseURL, filterByParentId),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: LocationUnit[]) => res,
    }
  );

  const fhirLocationUnits = useQuery('Locations', async () => serve.list(), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res.entry,
  });

  const fhirLocationDetail = useQuery(
    `Location/${detailId}`,
    async () => (detailId ? serve.read(detailId) : undefined),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res,
    }
  );

  const data = fhirLocationUnits.data?.map((d) => {
    return { ...d.resource, physicalType: get(d, 'resource.physicalType.coding.0.display') };
  });

  const treeDataQuery = useQueries(
    locationUnits.data
      ? locationUnits.data.map((location) => {
          return {
            queryKey: [LOCATION_HIERARCHY, location.id],
            queryFn: () => new OpenSRPService(LOCATION_HIERARCHY, opensrpBaseURL).read(location.id),
            onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
            // Todo : useQueries doesn't support select or types yet https://github.com/tannerlinsley/react-query/pull/1527
            select: (res) => {
              return generateJurisdictionTree(res as RawOpenSRPHierarchy).model;
            },
          };
        })
      : []
  ) as UseQueryResult<ParsedHierarchyNode>[];

  const treeDataQuery2 = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => generateFHIRLocationTree(res.entry as any).model,
    }
  );

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
      const data: TableData[] = parseTableData(
        titledata ? [...[titledata], ...sorteddata] : sorteddata
      );
      setTableData(data);
    }
  }, [treeDataQuery, currentClickedNode]);

  if (
    !treeDataQuery2.data ||
    !fhirLocationUnits.isFetched ||
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
          <Tree data={[treeDataQuery2.data]} OnItemClick={(node) => setCurrentClickedNode(node)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detailId ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h6 className="mt-4">{currentClickedNode ? tableData[0].name : lang.LOCATION_UNIT}</h6>
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
              data={data as any}
              onViewDetails={async (row) => {
                setDetailId(row.id);
              }}
            />
          </div>
        </Col>
        {detailId ? (
          <Col className="pl-3" span={5}>
            {fhirLocationDetail.isLoading ? (
              <Spin size={'large'} />
            ) : (
              <LocationUnitDetail
                onClose={() => setDetailId('')}
                {...(fhirLocationDetail.data as IfhirR4.ILocation)}
              />
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
