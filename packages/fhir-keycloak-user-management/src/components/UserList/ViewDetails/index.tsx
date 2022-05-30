import { KEYCLOAK_URL_USERS, URL_USER } from '@opensrp/user-management';
import { Col, Button, Space, Alert, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import {
  FHIRServiceClass,
  getResourcesFromBundle,
  loadAllResources,
  SingleKeyNestedValue,
} from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { KeycloakService } from '@opensrp/keycloak-service';
import { careTeamResourceType, practitionerResourceType } from '../../../constants';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import React from 'react';
import { useTranslation } from '@opensrp/i18n';

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
        .then((res: IBundle) => getResourcesFromBundle<IPractitioner>(res)[0]);
    }
  );

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

  if (userIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (userError && !user) {
    return <Alert type="error" message={`${userError}`} />;
  }

  // show user, linked practitioner, and teams that the practitioner is assigned to
  const keycloakUserValues = {
    Username: user.name,
    UUID: user.id,
  };

  const practitionerKeyValues = {
    [t('Practitioner Id')]: practitioner?.id,
    [t('Practitioner status')]: practitioner?.active ? t('active') : t('inactive'),
  };

  const careTeamKeyValues = {
    'Linked care teams': (
      <ul id="practitioner-care-teams">
        {(careTeams ?? []).map((careTeam) => (
          <li key={careTeam.id}>{careTeam.id}</li>
        ))}
      </ul>
    ),
  };

  return (
    <Space direction="vertical">
      {renderObjectAsKeyvalue(keycloakUserValues)}
      {practitionerIsLoading ? (
        <Alert description={t('Fetching linked practitioner')} type="info"></Alert>
      ) : practitioner ? (
        renderObjectAsKeyvalue(practitionerKeyValues)
      ) : (
        <Alert description={t('User does not have a linked practitioner')} type="warning"></Alert>
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
  const history = useHistory();

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
          onClick={() => history.push(URL_USER)}
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

/**
 * Dryed out util for displaying keyValue ui for an obj
 *
 * @param obj - obj with info to be displayed
 */
const renderObjectAsKeyvalue = (obj: Record<string, unknown>) => {
  return (
    <>
      {Object.entries(obj).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
    </>
  );
};
