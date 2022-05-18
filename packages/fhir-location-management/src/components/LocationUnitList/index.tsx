import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { get } from 'lodash';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LocationUnitDetail } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { FHIRServiceClass, BrokenPage, Resource404 } from '@opensrp/react-utils';
import { locationHierarchyResourceType, URL_LOCATION_UNIT_ADD } from '../../constants';
import { useQuery } from 'react-query';
import Table, { TableData } from './Table';
import Tree from '../LocationTree';
import { convertApiResToTree } from '../../helpers/utils';
import './LocationUnitList.css';
import { TreeNode } from '../../helpers/types';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { useSelector, useDispatch } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducerName,
  reducer,
  setSelectedNode,
  getSelectedNode,
} from '../../ducks/location-tree-state';
import { useTranslation } from '../../mls';

reducerRegistry.register(reducerName, reducer);

interface LocationUnitListProps {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
}

export interface AntTreeData {
  data: TreeNode;
  title: JSX.Element;
  key: string;
  children: AntTreeData[];
}

/**
 * Parse the hierarchy node into table data
 *
 * @param  hierarchy - hierarchy node to be parsed
 * @returns array of table data
 */
export function parseTableData(hierarchy: TreeNode[]) {
  const data: TableData[] = [];
  hierarchy.forEach((location) => {
    const { model } = location;
    data.push({
      id: model.node.id,
      key: model.nodeId,
      name: model.node.name,
      partOf: model.node.partOf?.display ?? '-',
      description: model.node?.description,
      status: model.node?.status,
      physicalType: get(model.node, 'physicalType.coding.0.display'),
    });
  });
  return data;
}

export const LocationUnitList: React.FC<LocationUnitListProps> = (props: LocationUnitListProps) => {
  const { fhirBaseURL, fhirRootLocationIdentifier } = props;
  const [detailId, setDetailId] = useState<string>();
  const selectedNode = useSelector((state) => getSelectedNode(state));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

  // get the root locations. the root node is the opensrp root location, its immediate children
  // are the user-defined root locations.
  const {
    data: treeData,
    isLoading: treeIsLoading,
    error: treeError,
  } = useQuery<IBundle, Error, TreeNode | undefined>(
    [locationHierarchyResourceType, hierarchyParams],
    async () => {
      return new FHIRServiceClass<IBundle>(fhirBaseURL, locationHierarchyResourceType).list(
        hierarchyParams
      );
    },
    {
      select: (res) => {
        return convertApiResToTree(res);
      },
    }
  );

  if (treeIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (treeError && !treeData) {
    return <BrokenPage errorMessage={`${treeError.message}`} />;
  }

  if (!treeData) {
    return <Resource404 />;
  }

  // generate table data; consider if there is a selected node, sorting the data
  const toDispNodes =
    (selectedNode ? (selectedNode.children as TreeNode[]) : treeData.children) ?? [];
  const sortedNodes = [...toDispNodes].sort((a, b) =>
    a.model.node.name.localeCompare(b.model.node.name)
  );
  let tableNodes = sortedNodes;
  // if a node is selected only its children should be selected, the selected node should come first anyway.
  if (selectedNode) {
    tableNodes = [selectedNode, ...sortedNodes];
  }
  const tableDispData = parseTableData(tableNodes);

  return (
    <section className="layout-content">
      <Helmet>
        <title>{t('Location Unit')}</title>
      </Helmet>
      <h1 className="mb-3 fs-5">{t('Location Unit Management')}</h1>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data-testid="hierarchy-display"
            data={treeData.children}
            selectedNode={selectedNode}
            onSelect={(node) => {
              dispatch(setSelectedNode(node));
            }}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={detailId ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h6 className="mt-4">
              {selectedNode ? selectedNode.model.node.name : t('Location Unit')}
            </h6>
            <div>
              <Link
                to={() => {
                  if (selectedNode) {
                    const queryParams = { parentId: selectedNode.model.nodeId };
                    const searchString = new URLSearchParams(queryParams).toString();
                    return `${URL_LOCATION_UNIT_ADD}?${searchString}`;
                  }
                  return URL_LOCATION_UNIT_ADD;
                }}
              >
                <Button type="primary">
                  <PlusOutlined />
                  {t('Add Location Unit')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3">
            <Table
              data={tableDispData}
              onViewDetails={async (row) => {
                setDetailId(row.id);
              }}
            />
          </div>
        </Col>
        {detailId ? (
          <LocationUnitDetail
            fhirBaseUrl={fhirBaseURL}
            onClose={() => setDetailId('')}
            detailId={detailId}
          />
        ) : null}
      </Row>
    </section>
  );
};
