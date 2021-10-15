/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { get } from 'lodash';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { locationUnitsReducer, locationUnitsReducerName } from '../../ducks/location-units';
import { URL_LOCATION_UNIT_ADD } from '../../constants';
import { useQuery } from 'react-query';
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
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { FHIRTreeNode, generateFHIRLocationTree } from '../../ducks/locationHierarchy/utils';
import './LocationUnitList.css';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

interface Props {
  opensrpBaseURL: string;
  fhirBaseURL: string;
  filterByParentId: boolean;
  fhirRootLocationIdentifier: string;
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
export function parseTableData(hierarchy: FHIRTreeNode[]) {
  const data: TableData[] = [];
  hierarchy.forEach((location, i: number) => {
    data.push({
      id: location.id,
      key: i.toString(),
      name: location.label || location.title,
      partOf: location.treeNode?.node?.partOf?.display ?? '-',
      description: location.node?.description || location.treeNode?.node.description,
      status: location.node?.status || location.treeNode?.node.status,
      physicalType:
        get(location.node, 'physicalType.coding.0.display') ||
        get(location.treeNode?.node, 'physicalType.coding.0.display'),
    });
  });
  return data;
}

export const LocationUnitList: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL, fhirRootLocationIdentifier } = props;
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [detailId, setDetailId] = useState<string>();
  const [currentClickedNode, setCurrentClickedNode] = useState<FHIRTreeNode | null>(null);
  const serve = new FHIRServiceClass(fhirBaseURL, 'Location');

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

  const fhirLocationDetail = useQuery(
    `Location/${detailId}`,
    async () => (detailId ? serve.read(detailId) : undefined),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res,
    }
  );

  const treeDataQuery = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) =>
        res.entry.map((singleEntry) => generateFHIRLocationTree(singleEntry as any).model),
      refetchOnWindowFocus: false,
    }
  );

  useDeepCompareEffect(() => {
    if (treeDataQuery.isFetched) {
      const titledata = currentClickedNode ?? null;
      const childrendata: FHIRTreeNode[] = currentClickedNode
        ? [...(currentClickedNode.children ?? [])]
        : [...(treeDataQuery.data as any)];
      const sorteddata = childrendata.sort((a, b) => a.title.localeCompare(b.title));
      const data: TableData[] = parseTableData(
        titledata ? [...[titledata], ...sorteddata] : sorteddata
      );
      setTableData(data);
    }
  }, [treeDataQuery, currentClickedNode]);

  if (!treeDataQuery.data || !tableData.length || treeDataQuery.isFetching)
    return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.LOCATION_UNIT}</title>
      </Helmet>
      <h1 className="mb-3 fs-5">{lang.LOCATION_UNIT_MANAGEMENT}</h1>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data={treeDataQuery.data}
            OnItemClick={(node) => setCurrentClickedNode(node as any)}
          />
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
              data={tableData}
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
