import React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@opensrp/react-utils';
import { Row, Col, Spin } from 'antd';
import { BrokenPage, Resource404 } from '@opensrp/react-utils';
import AffiliationTable from './Table';
import { useSelector, useDispatch } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  Tree,
  TreeNode,
  locationTreeStateDucks,
  useGetLocationHierarchy,
} from '@opensrp/fhir-location-management';
import { useTranslation } from '../../mls';
import { RbacCheck } from '@opensrp/rbac';

const { reducerName, reducer, setSelectedNode, getSelectedNode } = locationTreeStateDucks;

reducerRegistry.register(reducerName, reducer);

interface LocationUnitListProps {
  fhirBaseURL: string;
  fhirRootLocationId: string;
}

export const AffiliationList: React.FC<LocationUnitListProps> = (props: LocationUnitListProps) => {
  const { fhirBaseURL, fhirRootLocationId } = props;
  const selectedNode = useSelector((state) => getSelectedNode(state));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get the root locations. the root node is the opensrp root location, its immediate children
  // are the user-defined root locations.
  const {
    data: treeData,
    isLoading: treeIsLoading,
    error: treeError,
  } = useGetLocationHierarchy(fhirBaseURL, fhirRootLocationId);

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
      <PageHeader title={pageTitle} />
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
            <RbacCheck permissions={['OrganizationAffiliation.read']}>
              <AffiliationTable baseUrl={fhirBaseURL} locationNodes={tableNodes} />
            </RbacCheck>
          </div>
        </Col>
      </Row>
    </section>
  );
};
