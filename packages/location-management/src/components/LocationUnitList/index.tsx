/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@opensrp/react-utils';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link, useHistory } from 'react-router-dom';
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
import { useTranslation } from '../../mls';
import Table, { TableData } from './Table';
import Tree from '../LocationTree';
import { sendErrorNotification } from '@opensrp/notifications';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { TreeNode, RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';
import { generateJurisdictionTree, getBaseTreeNode } from '../../ducks/locationHierarchy/utils';
import './LocationUnitList.css';
import type { TFunction } from '@opensrp/i18n';

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

/**
 * Function to Load selected location unit for details
 *
 * @param row data selected from the table
 * @param opensrpBaseURL - base url
 * @param setDetail function to set detail to state
 * @param t translation string lookup
 */
export async function loadSingleLocation(
  row: TableData,
  opensrpBaseURL: string,
  setDetail: React.Dispatch<React.SetStateAction<LocationDetailData | 'loading' | null>>,
  t: TFunction
) {
  setDetail('loading');
  const serve = new OpenSRPService(LOCATION_UNIT_ENDPOINT, opensrpBaseURL);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return await serve
    .read(row.id, { is_jurisdiction: true })
    .then((res: LocationUnit) => {
      setDetail(res);
    })
    .catch(() => sendErrorNotification(t('An error occurred')));
}

export const LocationUnitList: React.FC<Props> = (props: Props) => {
  const { opensrpBaseURL, filterByParentId } = props;
  const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentClickedNode, setCurrentClickedNode] = useState<TreeNode>();
  const { t } = useTranslation();
  const history = useHistory();

  const locationUnits = useQuery(
    LOCATION_UNIT_FIND_BY_PROPERTIES,
    () => getBaseTreeNode(opensrpBaseURL, filterByParentId),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res: LocationUnit[]) => res,
    }
  );

  const handleAddLocation = () => {
    let query = '?';
    if (currentClickedNode) query += `parentId=${currentClickedNode.id}`;
    history.push({
      pathname: URL_LOCATION_UNIT_ADD,
      search: query
    })
  }

  const treeDataQuery = useQueries(
    (locationUnits.data ?? []).map((location) => {
      return {
        queryKey: [LOCATION_HIERARCHY, location.id],
        queryFn: () => new OpenSRPService(LOCATION_HIERARCHY, opensrpBaseURL).read(location.id),
        onError: () => sendErrorNotification(t('An error occurred')),
        select: (res: RawOpenSRPHierarchy) => generateJurisdictionTree(res),
      };
    })
  ) as UseQueryResult<TreeNode | undefined>[];

  const treeData = treeDataQuery
    .map((query) => query.data)
    .filter((e) => e !== undefined) as TreeNode[];

  // generate table data; consider if there is a selected node, sorting the data
  const toDispNodes =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (currentClickedNode ? (currentClickedNode.children as TreeNode[]) : treeData) ?? [];
  const sortedNodes = [...toDispNodes].sort((a, b) => {
    return a.model.node.name.localeCompare(b.model.node.name);
  });
  let tableNodes = sortedNodes;
  // if a node is selected only its children should be selected, the selected node should come first anyway.
  if (currentClickedNode) {
    tableNodes = [currentClickedNode, ...sortedNodes];
  }

  const tableData: TableData[] = tableNodes.map((locationNode) => {
    const location = locationNode.model;
    return {
      label: location.label,
      id: location.id,
      geographicLevel: location.node.attributes.geographicLevel,
    };
  });

  // show loader only if all hierarchy queries are loading
  if (
    locationUnits.isLoading ||
    (treeDataQuery.length > 0 && treeDataQuery.every((query) => query.isLoading))
  ) {
    return <Spin size="large" className="custom-spinner" />;
  }

  return (
    <section className="content-section">
      <Helmet>
        <title>{t('Location Unit')}</title>
      </Helmet>
      <PageHeader title={t('Location Unit Management')} />
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data={treeData}
            selectedNode={currentClickedNode}
            onSelect={(node: TreeNode | undefined) => setCurrentClickedNode(node)}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h6 className="mt-4">{currentClickedNode ? tableData[0].label : t('Location Unit')}</h6>
            <div>
              <Button type="primary" onClick={handleAddLocation}>
                <PlusOutlined />
                {t('Add Location Unit')}
              </Button>
            </div>
          </div>
          <div className="bg-white p-3">
            <Table
              data={tableData}
              onViewDetails={async (row) => {
                await loadSingleLocation(row, opensrpBaseURL, setDetail, t);
              }}
            />
          </div>
        </Col>

        {detail ? (
          <Col className="pl-3" span={5}>
            {detail === 'loading' ? (
              <Spin size="large" />
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
