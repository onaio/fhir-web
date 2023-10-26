import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Divider, Table, Tabs, Tag } from 'antd';
import { Organization } from '@opensrp/team-management';
import { Spin } from 'antd';
import { useTranslation } from '../../../mls'
import { useParams } from 'react-router';
import { BrokenPage, Resource404, TableLayout, getResourcesFromBundle, parseFhirHumanName, useSimpleTabularView, useTabularViewWithLocalSearch } from '@opensrp/react-utils';
import { PageHeader } from '@ant-design/pro-layout';
import { KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS, KeycloakUser, URL_USER, UserGroupDucks } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import { groupResourceType, practitionerResourceType } from '../../../constants';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';


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


// TODO - what if we do not have a linked practitioner.
const useGetPractitioner = (userId: string) => {
  // get practitioner include practitionerRoles. Multiple practitioners having multiple practitionerRoles.
  // some practitioenerRoles are purely for assignment. Add codes where possible.
}

const useGetCareTeams = () => {
  // get careTeams that reference this practitioner
}

const useGetOrganization = () => {
  // get organizations that reference this practitioner either directly or via a careTeam
}

const useGetLocations = () => {
  // get locations where this practitioner is assigned.
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
  const { keycloakBaseURL: keycloakBaseUrl, fhirBaseURL: fhirBBaseUrl } = props
  console.log({ props })
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
                { label: "Groups", key: 'Groups', children: <Table /> },
                { label: "Roles", key: 'Roles', children: <Table /> },
                { label: "Practitioners", key: 'Practitioners', children: <PractitionerDetailsView fhirBaseUrl={fhirBBaseUrl} keycloakId={resourceId} /> },
                { label: "CareTeams", key: 'CareTeams', children: <Table /> },
                { label: "Organizations", key: 'Organizations', children: <Table /> },
                { label: "Locations", key: 'Locations', children: <Table /> },
              ]
            }
          />
        </div>
      </div>
    </div>

  );
};

// const UserDetailsTabView = ({keycloakBaseUrl, resourceId}: {keycloakBaseUrl: string, resourceId: string}) => {

//   // get groups in a searchable way
//    // read userGroup
//    const { data, isLoading, error, isFetching } = useQuery<
//    UserGroupDucks.KeycloakUserGroup[]
//  >([groupResourceType, resourceId], () => {
//    return new KeycloakService(
//      `${KEYCLOAK_URL_USERS}/${resourceId}${KEYCLOAK_URL_USER_GROUPS}`,
//      keycloakBaseUrl
//    ).list();
//  });

//  if (error && !data) {
//   return <BrokenPage errorMessage={(error as Error).message} />;
// }

// const tableData = (data?.records ?? []).map((org: IGroup, index: number) => {
//   return {
//     ...parseGroup(org),
//     key: `${index}`,
//   };
// });

// const columns = 

// const tableProps = {
//   datasource: tableData,
//   columns,
//   loading: isFetching || isLoading,
//   pagination: tablePaginationProps,
// };




// }

interface PractitionerDetail extends Resource {
  fhir: {
    careteams?: ICareTeam[];
    teams?: IOrganization[];
    locationHierarchyList: any[]; // TODO - import LocationHierarchy
    practitionerRoles: IPractitionerRole[];
    groups: IGroup[];
    practitioner: IPractitioner[]
  }
}

function groupResourcesIdDetails(details: PractitionerDetail[]){
  const groupedData = {}
  for (const detail of details){
    for(const [_, resources] of Object.entries(detail.fhir)){
      for(const resource of resources){

      }
    }
  }
}

const DetailsTabView = ({ fhirBaseUrl, keycloakId }: { fhirBaseUrl: string, keycloakId: string }) => {
  const { t } = useTranslation();

  /** Get practitioner details and group them, provision them for the tab children, they can consume whichever data they want.
  */

  const practitionerDetailsResourceType = "practitioner-details"

  const extraQueryFilters = {
    "keycloak-uuid": keycloakId,
  }

  const {
    data, isFetching, isLoading, error,

  } = useQuery<IBundle, unknown, PractitionerDetail>([practitionerDetailsResourceType, keycloakId], () => new KeycloakService(practitionerDetailsResourceType, fhirBaseUrl).list(extraQueryFilters), {
    select: (res) => {
      // invariant : expect practitioner-details will always ever be a single record per keycloak user.
      return getResourcesFromBundle<PractitionerDetail>(res)[0]
    }
  });
  const resourcesByName = data?.fhir ?? {}

  // loop through records, and for each practitioner figure their practitionerRoles.
  const tableData = processPractitionerDetails(data?.records ?? [])


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
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return <TableLayout {...tableProps} />

}


const PractitionerDetailsView = ({ fhirBaseUrl, keycloakId }: { fhirBaseUrl: string, keycloakId: string }) => {
  const { t } = useTranslation();
  /** get all practitioners linked to this user. 
   * where do practitioner role information come in. revInclude practitionerRoles.
  */

  /** get practitioners that  have the given secondary identfier, an include practitionerRoles that reference those practitioners. */
  const extraQueryFilters = {
    identifier: keycloakId,
    _revinclude: "PractitionerRole:practitioner"
  }

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<IPractitioner | IPractitionerRole>(fhirBaseUrl, practitionerResourceType, extraQueryFilters);

  // loop through records, and for each practitioner figure their practitionerRoles.
  const tableData = processPractitionerDetails(data?.records ?? [])


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
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return <TableLayout {...tableProps} />

}

function processPractitionerDetails(records: (IPractitioner | IPractitionerRole)[]) {
  const tableData: Record<string, any> = {}
  const tempPractitionerRoleCodings: Record<string, any> = {};

  for (const res of records) {
    if (res.resourceType === practitionerResourceType) {
      const typedRes = res as IPractitioner
      const resName = typedRes.name?.[0] // TODO - use get official name 
      // add to store
      tableData[`${practitionerResourceType}/${typedRes.id}`] = { name: parseFhirHumanName(resName), active: res.active, concepts: [] }
    }
    else {
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






// TODO - extract css to own file.- make sure to scope it to current component.