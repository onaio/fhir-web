import React from 'react';
import { Tabs } from 'antd';
import { Spin } from 'antd';
import { useTranslation } from '../../../mls';
import { useHistory, useParams } from 'react-router';
import {
  BodyLayout,
  BrokenPage,
  FHIRServiceClass,
  Resource404,
  ResourceDetails,
  RichPageHeaderProps,
  getResourcesFromBundle,
  isValidDate,
} from '@opensrp/react-utils';
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
import { practitionerDetailsResourceType } from '../../../constants';
import './index.css';
import { UserDeleteBtn } from '../../UserDeleteBtn';
import { KeycloakRoleDetails } from './ViewDetailResources/RoleDetailView';
import { RbacCheck, useUserRole } from '@opensrp/rbac';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { PractitionerDetail } from './types';

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
  const userRole = useUserRole();

  const hasPractitionerRead = userRole.hasPermissions(['PractitionerDetail.read']);
  const hasGroupRead = userRole.hasPermissions(['iam_group.read']);
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

  const {
    id,
    firstName,
    lastName,
    username,
    email,
    emailVerified,
    enabled,
    attributes,
    createdTimestamp,
  } = user;
  const fhirCoreAppId = attributes?.fhir_core_app_id;
  const breadCrumbProps = {
    items: [
      {
        title: t('Users'),
        path: URL_USER,
      },
      {
        title: t('View details'),
      },
    ],
  };
  const pageTitle = t(`View details | {{userName}}`, { userName: user.username });
  const pageHeaderProps = {
    title: pageTitle,
  };
  const richPageHeaderProps: RichPageHeaderProps = {
    pageHeaderProps,
    breadCrumbProps,
  };

  let dateCreated = createdTimestamp ? new Date(createdTimestamp) : undefined;
  if (!isValidDate(dateCreated)) {
    dateCreated = undefined;
  }
  const otherDetailsMap = {
    [t('First Name')]: firstName,
    [t('Last Name')]: lastName,
    [t('Username')]: username,
    [t('Email')]: email,
    ...(attributes?.nationalId ? { [t('National ID')]: attributes.nationalId } : {}),
    ...(attributes?.phoneNumber ? { [t('Phone Number')]: attributes.phoneNumber } : {}),
    [t('FHIR Core App Id')]: fhirCoreAppId,
  };
  const dateCreatedKeyPairing = {
    [t('Date Created')]: dateCreated?.toLocaleString(),
  };
  const headerLeftData = {
    ID: id,
    [t('Verified')]: emailVerified ? t('True') : t('False'),
  };

  return (
    <BodyLayout headerProps={richPageHeaderProps}>
      <Helmet>
        <title>{pageTitle} </title>
      </Helmet>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '16px',
          gap: '14px',
          background: '#FFF',
          borderRadius: '12px',
        }}
      >
        <ResourceDetails
          column={2}
          title={user.username}
          headerLeftData={headerLeftData}
          headerRightData={dateCreatedKeyPairing}
          status={{
            title: enabled ? t('Enabled') : t('Disabled'),
            color: enabled ? 'green' : 'red',
          }}
          headerActions={
            <>
              <RbacCheck
                permissions={['iam_user.delete', 'Practitioner.delete']}
                key="user-delete-btn"
              >
                <UserDeleteBtn
                  fhirBaseUrl={fhirBaseUrl}
                  keycloakBaseUrl={keycloakBaseUrl}
                  resourceId={resourceId}
                  afterActions={userDeleteAfterAction}
                />
              </RbacCheck>
              <RbacCheck permissions={['iam_user.update', 'Practitioner.update']} key="edit-user">
                <Link to={`${URL_USER_EDIT}/${resourceId}`}>{t('Edit')}</Link>
              </RbacCheck>
            </>
          }
          bodyData={otherDetailsMap}
        />
        <div className="details-tab">
          <Tabs
            defaultActiveKey="1"
            size={'small'}
            items={[
              {
                label: t('User groups'),
                key: 'Groups',
                children: (
                  <KeycloakGroupDetails keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} />
                ),
                disabled: !hasGroupRead,
              },
              {
                label: t('User roles'),
                key: 'Roles',
                children: (
                  <KeycloakRoleDetails keycloakBaseUrl={keycloakBaseUrl} resourceId={resourceId} />
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
                disabled: !hasPractitionerRead,
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
                disabled: !hasPractitionerRead,
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
                disabled: !hasPractitionerRead,
              },
            ]}
          />
        </div>
      </div>
    </BodyLayout>
  );
};
