// import React from 'react';
// import { CloseOutlined } from '@ant-design/icons';
// import { Alert, Button, Col, Descriptions, Divider, Row, Table, Tabs, Tag, Typography } from 'antd';
// import { Tree, generateFhirLocationTree } from '@opensrp/fhir-location-management';
// import { Organization } from '@opensrp/team-management';
// import { Spin } from 'antd';
// import { useTranslation } from '../../../mls'
// import { useParams } from 'react-router';
// import { BrokenPage, FHIRServiceClass, Resource404, TableLayout, getResourcesFromBundle, parseFhirHumanName, useSimpleTabularView, useTabularViewWithLocalSearch } from '@opensrp/react-utils';
// import { PageHeader } from '@ant-design/pro-layout';
// import { KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS, KeycloakUser, URL_USER, UserGroupDucks } from '@opensrp/user-management';
// import { KeycloakAPIService, KeycloakService } from '@opensrp/keycloak-service';
// import { useQuery } from 'react-query';
// import { groupResourceType, keycloakRoleMappingsEndpoint, practitionerResourceType } from '../../../constants';
// import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
// import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
// import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
// import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
// import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
// import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
// import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
// import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
// import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
// import { Link } from 'react-router-dom';
// import { PractitionerDetail } from './types';
// import { useSelector } from 'react-redux';

// export const LocationDetailsView = ({ loading, practitionerDetails }: { loading: boolean, practitionerDetails: PractitionerDetail['fhir'] }) => {
//     const { t } = useTranslation();
//     const selectedNode = useSelector((state) => getSelectedNode(state));

//     // get organization Affiliation - use it tag the codings for the organizations.
//     const hierarchies = practitionerDetails.locationHierarchyList ?? [];
//     const treeData = hierarchies.map(rawTree => generateFhirLocationTree(rawTree))
//     // const tableData = hierarchies.map(resource => {
//     //   const tree =
//     //   const {id, active, type,name } = resource
//     //   return {
//     //     id, active, type, name
//     //   }
//     // })

//     // generate table data; consider if there is a selected node, sorting the data
//   const toDispNodes =
//   (selectedNode ? (selectedNode.children as TreeNode[]) : treeData.children) ?? [];
// const sortedNodes = [...toDispNodes].sort((a, b) =>
//   a.model.node.name.localeCompare(b.model.node.name)
// );
// let tableNodes = sortedNodes;
// // if a node is selected only its children should be selected, the selected node should come first anyway.
// if (selectedNode) {
//   tableNodes = [selectedNode, ...sortedNodes];
// }
// const tableDispData = parseTableData(tableNodes);

//     // identifier, status,
//     const columns = [
//       {
//         title: t('Id'),
//         dataIndex: 'id' as const,
//       },
//       {
//         title: t('Name'),
//         dataIndex: 'name' as const,
//         render: (name: string) => <Link to="#">{name}</Link>
//       },
//       {
//         title: t('Active'),
//         dataIndex: 'active' as const,
//         render: (isActive: string) => isActive ? "Active" : "Inactive",
//       },
//       {
//         title: t('Type'),
//         dataIndex: 'type' as const,
//         render: (concepts: CodeableConcept[]) => concepts.map(concept => <FhirCodeableConcept concept={concept} />),
//       },
//     ];

//     // const tableProps = {
//     //   datasource: tableData,
//     //   columns,
//     //   loading,
//     //   // pagination: true,
//     // };

//     return <>
//       <Row>
//         <Col className="bg-white p-3" span={6}>
//           <Tree
//             data-testid="hierarchy-display"
//             data={treeData}
//             // selectedNode={selectedNode}
//             onSelect={(node) => {
//               // dispatch(setSelectedNode(node));
//             }}
//           />
//         </Col>
//         {/* <Col className="bg-white p-3 border-left" span={detailId ? 13 : 18}>
//               <div className="mb-3 d-flex justify-content-between p-3">
//                 <h6 className="mt-4">
//                   {selectedNode ? selectedNode.model.node.name : t('Location Unit')}
//                 </h6>
//                 <RbacCheck permissions={['Location.create']}>
//                   <div>
//                     <Button
//                       type="primary"
//                       onClick={() => {
//                         if (selectedNode) {
//                           const queryParams = { parentId: selectedNode.model.nodeId };
//                           const searchString = new URLSearchParams(queryParams).toString();
//                           history.push(`${URL_LOCATION_UNIT_ADD}?${searchString}`);
//                         }
//                         history.push(URL_LOCATION_UNIT_ADD);
//                       }}
//                     >
//                       <PlusOutlined />
//                       {t('Add Location Unit')}
//                     </Button>
//                   </div>
//                 </RbacCheck>
//               </div>
//               <div className="bg-white p-3">
//                 <Table
//                   data={tableDispData}
//                   onViewDetails={async (row) => {
//                     setDetailId(row.id);
//                   }}
//                 />
//               </div>
//             </Col> */}
//       </Row>
//     </>

//   }

export {};
