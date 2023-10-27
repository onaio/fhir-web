import {
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USER_GROUPS,
  UserGroupDucks,
  getUserTypeCode,
  getUserType,
  FormFields,
  PRACTITIONER_USER_TYPE_CODE,
  SUPERVISOR_USER_TYPE_CODE,
} from '@opensrp/user-management';
import { Col, Button, Space, Alert, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
  loadAllResources,
  renderObjectAsKeyvalue,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  careTeamResourceType,
  groupResourceType,
  practitionerResourceType,
  practitionerRoleResourceType,
} from '../../../constants';
import { getPractitionerRole } from '../../CreateEditUser';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import React from 'react';
import { useTranslation } from '@opensrp/i18n';
import { get } from 'lodash';

/** typings for the view details component */
export interface ViewDetailsProps {
  resourceId: string;
  fhirBaseUrl: string;
  keycloakBaseUrl: string;
}

export type ViewDetailsWrapperProps = Pick<ViewDetailsProps, 'fhirBaseUrl' | 'keycloakBaseUrl'> & {
  resourceId?: string;
};

/**
 * Displays resource Details
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseUrl, keycloakBaseUrl } = props;
  const { t } = useTranslation();

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery([KEYCLOAK_URL_USERS, resourceId], () =>
    new KeycloakService(`${KEYCLOAK_URL_USERS}`, keycloakBaseUrl).read(resourceId)
  );

  // read practitioner
  const { data: practitioner, isLoading: practitionerIsLoading } = useQuery(
    [practitionerResourceType, resourceId],
    () => {
      return new FHIRServiceClass<IBundle>(fhirBaseUrl, practitionerResourceType)
        .list({ identifier: resourceId })
        
    },{
      select:(res: IBundle) => getResourcesFromBundle<IPractitioner>(res)[0]
    }
  );

  // read userGroup
  const { data: userGroup, isLoading: userGroupIsLoading } = useQuery<
    UserGroupDucks.KeycloakUserGroup[]
  >([groupResourceType, resourceId], () => {
    return new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${resourceId}${KEYCLOAK_URL_USER_GROUPS}`,
      keycloakBaseUrl
    ).list();
  });

  // get care teams where this practitioner is assigned.
  const { data: careTeams, isLoading: careTeamsIsLoading } = useQuery(
    [careTeamResourceType, resourceId],
    () => {
      // invariant one user one practitioner
      const filters = {
        'participant:Practitioner': practitioner?.id,
      };
      return loadAllResources(fhirBaseUrl, careTeamResourceType, filters).then((res: IBundle) =>
        getResourcesFromBundle<ICareTeam>(res)
      );
    },
    {
      enabled: !!practitioner,
    }
  );

  // get practitioner role where this practitioner is assigned.
  const { data: practitionerRole, isLoading: practitionerRoleIsLoading } = useQuery(
    [practitionerRoleResourceType, resourceId],
    () => getPractitionerRole(fhirBaseUrl, resourceId)
  );

  if (userIsLoading) {
    return <Spin size="large" className="custom-spinner" data-testid="custom-spinner" />;
  }

  if (userError && !user) {
    return <Alert type="error" message={`${userError}`} />;
  }

  // show user, linked practitioner, and teams that the practitioner is assigned to
  const keycloakUserValues = {
    [t('Keycloak UUID')]: user.id,
    Username: user.username,
  };

  const practitionerIdentifierObj = getObjLike(
    practitioner?.identifier,
    'use',
    IdentifierUseCodes.OFFICIAL
  );

  const practitionerKeyValues = {
    [t('Practitioner ID')]: practitioner?.id,
    [t('Practitioner UUID')]: get(practitionerIdentifierObj, '0.value'),
    [t('Practitioner status')]: practitioner?.active ? t('active') : t('inactive'),
  };

  const careTeamKeyValues = {
    [t('Linked care teams')]: (
      <ul id="practitioner-care-teams">
        {(careTeams ?? []).map((careTeam) => (
          <li key={careTeam.id}>{careTeam.name}</li>
        ))}
      </ul>
    ),
  };

  const keycloakUserGroupskeyVaues = {
    [t('Keycloack User Groups')]: (
      <ul id="keycloak-user-groups">
        {(userGroup ?? []).map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    ),
  };

  const practitionerRoleKeyValues = {
    [t('User Type')]: (
      <ul id="user-type">
        {((practitionerRole ? [practitionerRole] : undefined) ?? []).map((role) => {
          // getting the user type to default to when editing a user
          // by comparing practitioner resource user type codes
          // this is probably not the best way because these codes are constants
          // but it's the best for now
          let userType: FormFields['userType'];
          const userTypeCode = getUserTypeCode(role);
          if (userTypeCode) {
            userType = getUserType(
              userTypeCode as typeof PRACTITIONER_USER_TYPE_CODE | typeof SUPERVISOR_USER_TYPE_CODE
            );
          }
          return (
            <li key={role.id} data-testid="user-type">
              {userType}
            </li>
          );
        })}
      </ul>
    ),
  };

  return (
    <Space direction="vertical">
      {renderObjectAsKeyvalue(keycloakUserValues)}

      {userGroupIsLoading ? (
        <Alert description={t('Fetching User Groups')} type="info"></Alert>
      ) : userGroup?.length ? (
        renderObjectAsKeyvalue(keycloakUserGroupskeyVaues)
      ) : (
        <Alert description={t('User is not assigned to any user groups')} type="warning"></Alert>
      )}

      {practitionerIsLoading ? (
        <Alert description={t('Fetching linked practitioner')} type="info"></Alert>
      ) : practitioner ? (
        renderObjectAsKeyvalue(practitionerKeyValues)
      ) : (
        <Alert description={t('User does not have a linked practitioner')} type="warning"></Alert>
      )}

      {practitionerRoleIsLoading ? (
        <Alert description={t('Fetching linked practitionerRole')} type="info"></Alert>
      ) : practitionerRole ? (
        renderObjectAsKeyvalue(practitionerRoleKeyValues)
      ) : (
        <Alert description={t('User has not been assigned a user type')} type="warning"></Alert>
      )}

      {careTeamsIsLoading ? (
        <Alert description={t('Fetching linked care teams')} type="info"></Alert>
      ) : careTeams && careTeams.length > 0 ? (
        renderObjectAsKeyvalue(careTeamKeyValues)
      ) : (
        <Alert
          description={t('Practitioner is not assigned to a care team')}
          type="warning"
        ></Alert>
      )}
    </Space>
  );
};

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ViewDetailsWrapper = (props: ViewDetailsWrapperProps) => {
  const { resourceId, fhirBaseUrl, keycloakBaseUrl } = props;
  const { removeParam } = useSearchParams();

  if (!resourceId) {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          data-testid="close-button"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => removeParam(viewDetailsQuery)}
        />
      </div>
      <ViewDetails
        resourceId={resourceId}
        fhirBaseUrl={fhirBaseUrl}
        keycloakBaseUrl={keycloakBaseUrl}
      />
    </Col>
  );
};
