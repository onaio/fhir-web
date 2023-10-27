import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Descriptions, Divider, Row, Table, Tabs, Tag } from 'antd';
import { Tree, generateFhirLocationTree } from '@opensrp/fhir-location-management';
import { Organization } from '@opensrp/team-management';
import { Spin } from 'antd';
import { useTranslation } from '../../../mls'
import { useParams } from 'react-router';
import { BrokenPage, FHIRServiceClass, Resource404, TableLayout, getResourcesFromBundle, parseFhirHumanName, useSimpleTabularView, useTabularViewWithLocalSearch } from '@opensrp/react-utils';
import { PageHeader } from '@ant-design/pro-layout';
import { KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS, KeycloakUser, URL_USER, UserGroupDucks } from '@opensrp/user-management';
import { KeycloakAPIService, KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import { groupResourceType, keycloakRoleMappingsEndpoint, practitionerResourceType } from '../../../constants';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Link } from 'react-router-dom';
import { StringLocale } from 'yup';


/** New details view. ->
 * 
 * Page Leader section
 *  - breadcrumbs
 * user details show that as a description list. has attributes.
 */



const useGetKeycloakUser = (userId: string) => {
  // Get keycloakUser should contain details. roles. groups. attributes.
}

const useGetKeycloakUserGroups = (userId: string) => {
  // fetch groups assigned to user.
}

const useGetKeycloakUserRoles = (userId: string) => {
  // roles assigned to user by clients.
}

interface KeycloakGroupDetailsProp {
  keycloakBaseUrl: string;
  resourceId: string;
}

const KeycloakGroupDetails = (props: KeycloakGroupDetailsProp) => {
  const { t } = useTranslation();
  const { keycloakBaseUrl, resourceId } = props;

  // TODO - useSimpleTabular view but for keycloak requests.
  const { data, error, isLoading } = useQuery([], () => new KeycloakService(
    `${KEYCLOAK_URL_USERS}/${resourceId}${KEYCLOAK_URL_USER_GROUPS}`,
    keycloakBaseUrl
  ).list())

  if (error && !data) {
    return <BrokenPage errorMessage={"Unable to fetch the keycloak groups that the user is assigned to"} />;
  }

  // name, path, leave action.
  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },
    {
      title: t('Path'),
      dataIndex: 'path' as const,
    },
    {
      title: t(''),
      dataIndex: 'id' as const,
      render: (id: string) => <Button disabled type='link'>{"Leave"}</Button>,
    },
  ];

  const tableProps = {
    datasource: data,
    columns,
    loading: isLoading,
    // pagination: true,
  };

  return <TableLayout {...tableProps} />
}

interface RoleMapping {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}
interface ClientRoleMapping {
  id: string;
  client: string;
  mappings: RoleMapping[]
}
interface KeycloakUserRoleMappings {
  realMappings?: RoleMapping[];
  clientMappings?: Record<string, ClientRoleMapping>
}
const KeycloakRoleDetails = (props: KeycloakGroupDetailsProp) => {
  const { t } = useTranslation();
  const { keycloakBaseUrl, resourceId } = props;

  // TODO - useSimpleTabular view but for keycloak requests.
  const { data, error, isLoading } = useQuery([], () => new KeycloakService(
    `${KEYCLOAK_URL_USERS}/${resourceId}/${keycloakRoleMappingsEndpoint}`,
    keycloakBaseUrl
  ).list())

  if (error && !data) {
    return <BrokenPage errorMessage={"Unable to fetch Roles assigned to the user"} />;
  }

  // name, path, leave action.
  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },
    {
      title: t('Path'),
      dataIndex: 'path' as const,
    },
    {
      title: t(''),
      dataIndex: 'id' as const,
      render: (id: string) => <Button disabled type='link'>{"Leave"}</Button>,
    },
  ];

  const tableProps = {
    datasource: data,
    columns,
    loading: isLoading,
    // pagination: true,
  };

  return <TableLayout {...tableProps} />
}

// - if user record not found then show 404 under page details.
// - if practitioner not found, load, keycloak related data and show that. disable 

// remove onclose from type and export the rest
interface UserDetailProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

const routes = [{
  path: "admin/users",
  breadcrumbName: 'Users',
},
{
  path: "id",
  breadcrumbName: 'View details',
},
]

export const UserDetails = (props: UserDetailProps) => {
  const { keycloakBaseURL: keycloakBaseUrl, fhirBaseURL: fhirBaseUrl } = props
  const params = useParams<{ id: string }>()
  const { id: resourceId } = params;
  const { t } = useTranslation();

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery<KeycloakUser>([KEYCLOAK_URL_USERS, resourceId], () =>
    new KeycloakService(`${KEYCLOAK_URL_USERS}`, keycloakBaseUrl).read(resourceId)
  );

  const practitionerDetailsResourceType = "practitioner-details"

  const extraQueryFilters = {
    "keycloak-uuid": resourceId,
  }

  const {
    data: practitionerDetails, isLoading: detailsLoading, error: detailsError,

  } = useQuery<IBundle, unknown, PractitionerDetail>([practitionerDetailsResourceType, resourceId], () => new FHIRServiceClass<IBundle>(fhirBaseUrl, practitionerDetailsResourceType).list(extraQueryFilters), {
    select: (res) => {
      // invariant : expect practitioner-details will always ever be a single record per keycloak user.
      return getResourcesFromBundle<PractitionerDetail>(res)[0]
    }
  });
  const practDetailsByResName: PractitionerDetail['fhir'] = practitionerDetails?.fhir ?? {}

  if (userIsLoading) {
    return <Spin className='custom-spinner'></Spin>
  }

  // TODO - how to provide this data.
  if (userError && !user) {
    return <BrokenPage errorMessage='An error occurred when fetching the user details'></BrokenPage>
  }

  if (user === undefined) {
    return <Resource404 title='User was not found'></Resource404>
  }

  const { id, firstName, lastName, username, email, emailVerified, enabled, attributes } = user
  const userDetails = {
    ID: id,
    'First Name': firstName,
    'Last Name': lastName,
    'Username': username,
    "Email": email,
    "Verified": emailVerified ? "True" : "False",
  }
  const attributesArray = Object.entries(attributes ?? {});

  return (
    <div className="details-full-view">
      <PageHeader
        className="site-page-header"
        onBack={() => history.back()}
        title="View details"
        breadcrumb={{ routes }}
        subTitle={user.username}
        style={{ padding: "24px", background: "white" }}
      />
      <div style={{
        margin: "24px",
        display: "flex",
        gap: '16px',
        flexDirection: "column",
      }}>

        <div style={{
          backgroundColor: "#fff"
        }}>
          <PageHeader
            ghost={false}
            title={user.username}
            subTitle={enabled ? <Tag color="green">Enabled</Tag> : <Tag color="green">Disabled</Tag>}
            extra={[,
              <Button key="edit" danger type="text" disabled>
                Delete
              </Button>,
              <Button key="edit" type="primary" disabled>
                Edit
              </Button>,
            ]}
          >
            <Descriptions size="small" column={3}>
              {Object.entries(userDetails).map(([key, value]) => {
                return <Descriptions.Item label={key}>{value}</Descriptions.Item>
              })}
            </Descriptions>
            <Divider orientation="center">
              Attributes
            </Divider>
            {attributesArray.length === 0 ? <Alert message="This user does not have any attributes" type="info" /> :

              <Descriptions size="small" column={3}>
                {attributesArray.map(([key, value]) => {
                  return <Descriptions.Item label={key}>{JSON.stringify(value)}</Descriptions.Item>
                })}
              </Descriptions>
            }
          </PageHeader>
        </div>
        <div style={{
          backgroundColor: "#fff",
          padding: '16px',
        }}>
          <Tabs
            defaultActiveKey="1"
            size={"middle"}
            items={
              [
                { label: "Groups", key: 'Groups', children: <KeycloakGroupDetails keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} /> },
                { label: "Roles", key: 'Roles', children: <Table /> },
                { label: "Practitioners", key: 'Practitioners', children: <PractitionerDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                { label: "CareTeams", key: 'CareTeams', children: <CareTeamDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                { label: "Organizations", key: 'Organizations', children: <OrganizationDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                { label: "Locations", key: 'Locations', children: <LocationDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
              ]
            }
          />
        </div>
      </div>
    </div>

  );
};

interface PractitionerDetail extends Resource {
  fhir: {
    careteams?: ICareTeam[];
    teams?: IOrganization[];
    locationHierarchyList?: any[]; // TODO - import LocationHierarchy
    practitionerRoles?: IPractitionerRole[];
    groups?: IGroup[];
    practitioner?: IPractitioner[]
  }
}


const PractitionerDetailsView = ({ loading, practitionerDetails }: { loading: boolean, practitionerDetails: PractitionerDetail['fhir'] }) => {
  const { t } = useTranslation();


  const practitioners = practitionerDetails.practitioner ?? [];
  const practitionerRoles = practitionerDetails.practitionerRoles ?? [];
  const tableData = processPractitionerDetails(practitioners, practitionerRoles)


  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
    },
    {
      title: t('Active'),
      dataIndex: 'active',
      render: (value: boolean) => (value === true ? 'Active' : 'Inactive'),
    },
    {
      title: t('Coding'),
      dataIndex: 'concepts',
      render: (concepts: CodeableConcept[]) => concepts.map(concept => <FhirCodeableConcept concept={concept} />),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading,
    // pagination: true,
  };

  return <TableLayout {...tableProps} />

}


const CareTeamDetailsView = ({ loading, practitionerDetails }: { loading: boolean, practitionerDetails: PractitionerDetail['fhir'] }) => {
  const { t } = useTranslation();


  const careTeams = practitionerDetails.careteams ?? [];
  const tableData = careTeams.map(resource => {
    const { id, status, name, } = resource
    return {
      id, status, name
    }
  })


  // identifier, status, 
  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      render: (name: string) => <Link to="#">{name}</Link>
    },
    {
      title: t('status'),
      dataIndex: 'status' as const,
      render: (code: Coding) => <FhirCoding coding={code} />,
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading,
    // pagination: true,
  };

  return <TableLayout {...tableProps} />

}


const OrganizationDetailsView = ({ loading, practitionerDetails }: { loading: boolean, practitionerDetails: PractitionerDetail['fhir'] }) => {
  const { t } = useTranslation();


  // get organization Affiliation - use it tag the codings for the organizations.
  const organizations = practitionerDetails.teams ?? [];
  const tableData = organizations.map(resource => {
    const { id, active, type, name } = resource
    return {
      id, active, type: type ?? [], name
    }
  })


  // identifier, status, 
  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      render: (name: string) => <Link to="#">{name}</Link>
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      render: (isActive: string) => isActive ? "Active" : "Inactive",
    },
    {
      title: t('Type'),
      dataIndex: 'type' as const,
      render: (concepts: CodeableConcept[]) => concepts.map(concept => <FhirCodeableConcept concept={concept} />),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading,
    // pagination: true,
  };

  return <TableLayout {...tableProps} />

}


const LocationDetailsView = ({ loading, practitionerDetails }: { loading: boolean, practitionerDetails: PractitionerDetail['fhir'] }) => {
  const { t } = useTranslation();


  // get organization Affiliation - use it tag the codings for the organizations.
  const hierarchies = practitionerDetails.locationHierarchyList ?? [];
  const treeData = hierarchies.map(rawTree => generateFhirLocationTree(rawTree))
  // const tableData = hierarchies.map(resource => {
  //   const tree =
  //   const {id, active, type,name } = resource
  //   return {
  //     id, active, type, name
  //   }
  // })


  // identifier, status, 
  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      render: (name: string) => <Link to="#">{name}</Link>
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      render: (isActive: string) => isActive ? "Active" : "Inactive",
    },
    {
      title: t('Type'),
      dataIndex: 'type' as const,
      render: (concepts: CodeableConcept[]) => concepts.map(concept => <FhirCodeableConcept concept={concept} />),
    },
  ];

  // const tableProps = {
  //   datasource: tableData,
  //   columns,
  //   loading,
  //   // pagination: true,
  // };

  return <>
    <Row>
      <Col className="bg-white p-3" span={6}>
        <Tree
          data-testid="hierarchy-display"
          data={treeData}
          // selectedNode={selectedNode}
          onSelect={(node) => {
            // dispatch(setSelectedNode(node));
          }}
        />
      </Col>
      {/* <Col className="bg-white p-3 border-left" span={detailId ? 13 : 18}>
            <div className="mb-3 d-flex justify-content-between p-3">
              <h6 className="mt-4">
                {selectedNode ? selectedNode.model.node.name : t('Location Unit')}
              </h6>
              <RbacCheck permissions={['Location.create']}>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (selectedNode) {
                        const queryParams = { parentId: selectedNode.model.nodeId };
                        const searchString = new URLSearchParams(queryParams).toString();
                        history.push(`${URL_LOCATION_UNIT_ADD}?${searchString}`);
                      }
                      history.push(URL_LOCATION_UNIT_ADD);
                    }}
                  >
                    <PlusOutlined />
                    {t('Add Location Unit')}
                  </Button>
                </div>
              </RbacCheck>
            </div>
            <div className="bg-white p-3">
              <Table
                data={tableDispData}
                onViewDetails={async (row) => {
                  setDetailId(row.id);
                }}
              />
            </div>
          </Col> */}
    </Row>
  </>

}



function processPractitionerDetails(practitioners: IPractitioner[], practitionerRoles: IPractitionerRole[]) {
  const tableData: Record<string, any> = {}
  const tempPractitionerRoleCodings: Record<string, any> = {};

  for (const res of practitioners) {
    const typedRes = res
    const resName = typedRes.name?.[0] // TODO - use get official name 
    // add to store
    tableData[`${practitionerResourceType}/${typedRes.id}`] = { name: parseFhirHumanName(resName), active: res.active, concepts: [] }
  }

  for (const res of practitionerRoles) {
    // practitionerRole resource
    const typedRes = res as IPractitionerRole
    const practitionerId = typedRes.practitioner?.reference as string

    // extract the coding
    const concepts = (typedRes.code ?? [])

    // have we encountered a corresponding practitioner for this role
    if (tableData[practitionerId] === undefined) {
      tableData[practitionerId].codings.push(concepts)
    }
    else if (tempPractitionerRoleCodings[practitionerId] === undefined) {
      tempPractitionerRoleCodings[practitionerId] = []
    } else {
      tempPractitionerRoleCodings[practitionerId].push(concepts)
    }
  }

  for (const [key, value] of Object.entries(tempPractitionerRoleCodings)) {
    // invariant: we should have encountered all possible practitioners whole practitioner Roles records are in tempPractitionerRoleCodings
    tableData[key].coding = [...tableData[key].concepts, ...value]
  }
  return Object.values(tableData)
}


// Create a fhir sdk components package for this
export const FhirCodeableConcept = ({ concept }: { concept: CodeableConcept }) => {
  // single concept can have text representation, 
  // Each concept can have several codings, each coding with its own display.
  return <span>codeableConcept</span>

}


export const FhirCoding = ({ coding }: { coding: Coding }) => {
  return <span>Coding</span>
}





// TODO - extract css to own file.- make sure to scope it to current component.
// TODO - include any other details added to practitionerDetails.