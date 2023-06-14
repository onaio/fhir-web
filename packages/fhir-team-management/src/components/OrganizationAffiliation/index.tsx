import React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@ant-design/pro-layout';
import { Row, Col, Spin } from 'antd';
import { FHIRServiceClass, BrokenPage, Resource404 } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import AffiliationTable from './Table';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { useSelector, useDispatch } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  locationHierarchyResourceType,
  convertApiResToTree,
  Tree,
  TreeNode,
  locationTreeStateDucks,
} from '@opensrp/fhir-location-management';
import { useTranslation } from '../../mls';

const { reducerName, reducer, setSelectedNode, getSelectedNode } = locationTreeStateDucks;

reducerRegistry.register(reducerName, reducer);

interface LocationUnitListProps {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
}

export const AffiliationList: React.FC<LocationUnitListProps> = (props: LocationUnitListProps) => {
  const { fhirBaseURL, fhirRootLocationIdentifier } = props;
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
  } = useQuery<IBundle | undefined, Error, TreeNode | undefined>(
    [locationHierarchyResourceType, hierarchyParams],
    async () => {
      return new FHIRServiceClass<IBundle>(fhirBaseURL, locationHierarchyResourceType).list(
        hierarchyParams
      );
    },
    {
      select: (res) => {
        return res && convertApiResToTree(res);
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
  // if a node is selected, children will be sorted, but selected nodes comes first in table
  if (selectedNode) {
    tableNodes = [selectedNode, ...sortedNodes];
  }

  const pageTitle = t('Team Assignment');
  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
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
        <Col className="bg-white p-3 border-left" span={18}>
          <div className="bg-white p-3">
            <AffiliationTable baseUrl={fhirBaseURL} locationNodes={tableNodes} />
          </div>
        </Col>
      </Row>
    </section>
  );
};
