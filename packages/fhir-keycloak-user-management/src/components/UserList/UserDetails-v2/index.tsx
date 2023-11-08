import React from 'react';
import { Alert, Breadcrumb, Button, Descriptions, Divider, Popconfirm, Tabs, Tag } from 'antd';
import { Spin } from 'antd';
import { useTranslation } from '../../../mls'
import { useHistory, useParams } from 'react-router';
import { BrokenPage, FHIRServiceClass, Resource404, getResourcesFromBundle } from '@opensrp/react-utils';
import { PageHeader } from '@ant-design/pro-layout';
import { KEYCLOAK_URL_USERS, KeycloakUser, URL_USER, URL_USER_EDIT } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery, useQueryClient } from 'react-query';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { KeycloakGroupDetails } from './ViewDetailResources/GroupDetailView';
import { PractitionerDetailsView } from './ViewDetailResources/practitionerDetails';
import { CareTeamDetailsView } from './ViewDetailResources/CareTeamDetails';
import { OrganizationDetailsView } from './ViewDetailResources/OrganizationDetailsView';
import { PractitionerDetail } from './types';
import { Link } from 'react-router-dom';
import { practitionerDetailsResourceType } from '../../../constants';
import "./index.css"
import { sendErrorNotification } from '@opensrp/notifications';
import { deleteUser } from '../ListView/utils';
import { UserDeleteBtn } from '../../UserDeleteBtn';
import { KeycloakRoleDetails } from './ViewDetailResources/RoleDetailView';

// remove onclose from type and export the rest
interface UserDetailProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

const breadCrumbItems = [{
  title: "Users",
  path: URL_USER
}, {
  title: "View details",
}]



const breadCrumb = <Breadcrumb
  items={breadCrumbItems}
  itemRender={(route, _, items, __) => {
    const last = items.indexOf(route) === items.length - 1;
    return last ? <span>{route.title}</span> : <Link to={route.path ? route.path : "#"}>{route.title}</Link>;
  }}
>
  <Breadcrumb.Item>
    <Link to={URL_USER}>Users</Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>View details</Breadcrumb.Item>
</Breadcrumb>

export const UserDetails = (props: UserDetailProps) => {
  const { keycloakBaseURL: keycloakBaseUrl, fhirBaseURL: fhirBaseUrl } = props
  const params = useParams<{ id: string }>()
  const { id: resourceId } = params;
  const { t } = useTranslation();
  const history = useHistory()

  const userDeleteAfterAction = () => {
    history.push(URL_USER)
  }

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery<KeycloakUser>([KEYCLOAK_URL_USERS, resourceId], () =>
    new KeycloakService(`${KEYCLOAK_URL_USERS}`, keycloakBaseUrl).read(resourceId)
  );

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

  if (userError && !user) {
    console.log({ userError })
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
        onBack={() => history.goBack()}
        title="View details"
        breadcrumb={breadCrumb}
        subTitle={user.username}
      />
      <div className='content-body'>

        <div className='content-box' data-testid="user-profile">
          <PageHeader
            ghost={false}
            title={user.username}
            subTitle={enabled ? <Tag color="green">Enabled</Tag> : <Tag color="green">Disabled</Tag>}
            extra={[,
              <UserDeleteBtn fhirBaseUrl={fhirBaseUrl} keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} afterActions={userDeleteAfterAction}/>,
              <Button type="primary" onClick={() =>  history.push(`${URL_USER_EDIT}/${resourceId}`)} key="edit-user">
                {t('Edit')}
              </Button>,
            ]}
          >
            <Descriptions size="small" column={3}>
              {Object.entries(userDetails).map(([key, value]) => {
                return <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
              })}
            </Descriptions>
            <Divider orientation="center">
              Attributes
            </Divider>
            {attributesArray.length === 0 ? <Alert message="This user does not have any attributes" type="info" /> :
              <Descriptions size="small" column={3}>
                {attributesArray.map(([key, value]) => {
                  return <Descriptions.Item key={key} label={key}>{JSON.stringify(value)}</Descriptions.Item>
                })}
              </Descriptions>
            }
          </PageHeader>
        </div>
        <div className='details-tab'>
          <Tabs
            defaultActiveKey="1"
            size={"small"}
            items={
              [
                { label: "User groups", key: 'Groups', children: <KeycloakGroupDetails keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} /> },
                { label: "User roles", key: 'Roles', children: <KeycloakRoleDetails keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} /> },
                { label: "Practitioners", key: 'Practitioners', children: <PractitionerDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                { label: "CareTeams", key: 'CareTeams', children: <CareTeamDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                { label: "Organizations", key: 'Organizations', children: <OrganizationDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
                // { label: "Locations", key: 'Locations', children: <LocationDetailsView loading={detailsLoading} practitionerDetails={practDetailsByResName} /> },
              ]
            }
          />
        </div>
      </div>
    </div>

  );
};








// TODO - extract css to own file.- make sure to scope it to current component.
// TODO - include any other details added to practitionerDetails.