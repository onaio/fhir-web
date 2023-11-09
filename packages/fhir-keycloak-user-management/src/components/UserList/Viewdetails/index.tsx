import React from 'react';
import { Alert, Breadcrumb, Button, Descriptions, Divider, Tabs, Tag } from 'antd';
import { Spin } from 'antd';
import { useTranslation } from '../../../mls';
import { useHistory, useParams } from 'react-router';
import {
  BrokenPage,
  FHIRServiceClass,
  Resource404,
  getResourcesFromBundle,
} from '@opensrp/react-utils';
import { PageHeader } from '@ant-design/pro-layout';
import {
  KEYCLOAK_URL_USERS,
  KeycloakUser,
  URL_USER,
  URL_USER_EDIT,
} from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { KeycloakGroupDetails } from './ViewDetailResources/GroupDetailView';
import { PractitionerDetailsView } from './ViewDetailResources/PractitionerDetails';
import { CareTeamDetailsView } from './ViewDetailResources/CareTeamDetails';
import { OrganizationDetailsView } from './ViewDetailResources/OrganizationDetailsView';
import { PractitionerDetail } from './types';
import { Link } from 'react-router-dom';
import { practitionerDetailsResourceType } from '../../../constants';
import './index.css';
import { UserDeleteBtn } from '../../UserDeleteBtn';
import { KeycloakRoleDetails } from './ViewDetailResources/RoleDetailView';
import { RbacCheck } from '@opensrp/rbac';

// remove onclose from type and export the rest
interface UserDetailProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

export const UserDetails = (props: UserDetailProps) => {
  const { keycloakBaseURL: keycloakBaseUrl, fhirBaseURL: fhirBaseUrl } = props;
  const params = useParams<{ id: string }>();
  const { id: resourceId } = params;
  const { t } = useTranslation();
  const history = useHistory();

  const userDeleteAfterAction = () => {
    history.push(URL_USER);
  };

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery<KeycloakUser>([KEYCLOAK_URL_USERS, resourceId], () =>
    new KeycloakService(`${KEYCLOAK_URL_USERS}`, keycloakBaseUrl).read(resourceId)
  );

  const extraQueryFilters = {
    'keycloak-uuid': resourceId,
  };

  const {
    data: practitionerDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = useQuery<IBundle, Error, PractitionerDetail>(
    [practitionerDetailsResourceType, resourceId],
    () =>
      new FHIRServiceClass<IBundle>(fhirBaseUrl, practitionerDetailsResourceType).list(
        extraQueryFilters
      ),
    {
      select: (res) => {
        // invariant : expect practitioner-details will always ever be a single record per keycloak user.
        return getResourcesFromBundle<PractitionerDetail>(res)[0];
      },
    }
  );
  const practDetailsByResName: PractitionerDetail['fhir'] = practitionerDetails?.fhir ?? {};

  if (userIsLoading) {
    return <Spin className="custom-spinner"></Spin>;
  }

  if (userError && !user) {
    return (
      <BrokenPage
        errorMessage={t('An error occurred when fetching the user details.')}
      ></BrokenPage>
    );
  }

  if (user === undefined) {
    return <Resource404 title={t('Could not find the user.')}></Resource404>;
  }

  const { id, firstName, lastName, username, email, emailVerified, enabled, attributes } = user;
  const userDetails = {
    [t('Id')]: id,
    [t('First Name')]: firstName,
    [t('Last Name')]: lastName,
    [t('Username')]: username,
    [t('Email')]: email,
    [t('Verified')]: emailVerified ? t('True') : t('False'),
  };
  const attributesArray = Object.entries(attributes ?? {});

  return (
    <div className="details-full-view">
      <PageHeader
        className="site-page-header"
        onBack={() => history.goBack()}
        title={t('View details')}
        breadcrumbRender={() => <UserProfileBreadCrumb />}
        subTitle={user.username}
      />
      <div className="content-body">
        <div className="content-box" data-testid="user-profile">
          <PageHeader
            ghost={false}
            title={user.username}
            subTitle={
              enabled ? (
                <Tag color="green">{t('Enabled')}</Tag>
              ) : (
                <Tag color="green">{t('Disabled')}</Tag>
              )
            }
            extra={[
              <RbacCheck permissions={['iam_user.delete']} key="user-delete-btn">
                <UserDeleteBtn
                  fhirBaseUrl={fhirBaseUrl}
                  keycloakBaseUrl={keycloakBaseUrl}
                  resourceId={resourceId}
                  afterActions={userDeleteAfterAction}
                />
              </RbacCheck>,
              <RbacCheck permissions={['iam_user.update']} key="edit-user">
                <Button
                  type="primary"
                  onClick={() => history.push(`${URL_USER_EDIT}/${resourceId}`)}
                >
                  {t('Edit')}
                </Button>
              </RbacCheck>,
            ]}
          >
            <Descriptions size="small" column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}>
              {Object.entries(userDetails).map(([key, value]) => {
                return (
                  <Descriptions.Item key={key} label={key}>
                    {value}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
            <Divider orientation="center">Attributes</Divider>
            {attributesArray.length === 0 ? (
              <Alert message={t('This user does not have any attributes')} type="info" />
            ) : (
              <Descriptions size="small" column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}>
                {attributesArray.map(([key, value]) => {
                  return (
                    <Descriptions.Item key={key} label={key}>
                      {JSON.stringify(value)}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            )}
          </PageHeader>
        </div>
        <RbacCheck permissions={['PractitionerDetails.read']}>
          <div className="details-tab">
            <Tabs
              defaultActiveKey="1"
              size={'small'}
              items={[
                {
                  label: t('User groups'),
                  key: 'Groups',
                  children: (
                    <KeycloakGroupDetails
                      keycloakBaseUrl={keycloakBaseUrl}
                      resourceId={resourceId}
                    />
                  ),
                },
                {
                  label: t('User roles'),
                  key: 'Roles',
                  children: (
                    <KeycloakRoleDetails
                      keycloakBaseUrl={keycloakBaseUrl}
                      resourceId={resourceId}
                    />
                  ),
                },
                {
                  label: t('Practitioners'),
                  key: 'Practitioners',
                  children: (
                    <PractitionerDetailsView
                      loading={detailsLoading}
                      practitionerDetails={practDetailsByResName}
                      error={detailsError}
                    />
                  ),
                },
                {
                  label: t('CareTeams'),
                  key: 'CareTeams',
                  children: (
                    <CareTeamDetailsView
                      loading={detailsLoading}
                      practitionerDetails={practDetailsByResName}
                      error={detailsError}
                    />
                  ),
                },
                {
                  label: t('Organizations'),
                  key: 'Organizations',
                  children: (
                    <OrganizationDetailsView
                      loading={detailsLoading}
                      practitionerDetails={practDetailsByResName}
                      error={detailsError}
                    />
                  ),
                },
              ]}
            />
          </div>
        </RbacCheck>
      </div>
    </div>
  );
};

const UserProfileBreadCrumb = () => {
  const { t } = useTranslation();
  const breadCrumbItems = [
    {
      title: t('Users'),
      path: URL_USER,
    },
    {
      title: t('View details'),
    },
  ];

  return (
    <Breadcrumb
      items={breadCrumbItems}
      // eslint-disable-next-line @typescript-eslint/naming-convention
      itemRender={(route, _, items, __) => {
        const last = items.indexOf(route) === items.length - 1;
        return last ? (
          <span>{route.title}</span>
        ) : (
          <Link to={route.path ? route.path : '#'}>{route.title}</Link>
        );
      }}
    ></Breadcrumb>
  );
};
