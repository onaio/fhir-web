import React from 'react';
import { Col, Space, Spin, Button, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
  parseFhirHumanName,
  renderObjectAsKeyvalue,
} from '@opensrp/react-utils';
import {
  organizationResourceType,
  ORGANIZATION_LIST_URL,
  practitionerResourceType,
  practitionerRoleResourceType,
} from '../../../constants';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { get } from 'lodash';
import './index.css';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { useTranslation } from '../../../mls';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/**
 * parse an organization to object we can easily consume in Table layout
 *
 * @param org - the organization resource object
 */
export const parseOrganization = (org: IOrganization) => {
  const identifierObj = getObjLike(
    org.identifier,
    'use',
    IdentifierUseCodes.OFFICIAL
  ) as Identifier[];
  const identifier = get(identifierObj, '0.value');
  return {
    id: org.id,
    identifier,
    active: org.active,
    name: org.name,
    type: get(org, 'type.0.coding.0.display'),
    alias: org.alias,
    partOf: get(org, 'partOf.display'),
  };
};

/** typings for the view details component */
export interface ViewDetailsProps {
  resourceId: string;
  fhirBaseURL: string;
}

export type ViewDetailsWrapperProps = Pick<ViewDetailsProps, 'fhirBaseURL'> & {
  resourceId?: string;
};

/**
 * Displays Organization Details
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseURL } = props;

  const { t } = useTranslation();

  // fetch organization resource
  const {
    data: organization,
    isLoading: orgIsLoading,
    error: orgError,
  } = useQuery([organizationResourceType, resourceId], () =>
    new FHIRServiceClass<IOrganization>(fhirBaseURL, organizationResourceType).read(
      resourceId as string
    )
  );

  // fetch practitioners assigned to this organization
  const { data: assignedPractitioners, isLoading: assignedPractitionersLoading } = useQuery(
    [practitionerRoleResourceType, resourceId],
    () =>
      new FHIRServiceClass<IBundle>(fhirBaseURL, practitionerRoleResourceType)
        .list({
          _include: 'PractitionerRole:practitioner',
          organization: resourceId,
        })
        .then(
          (bundle) =>
            getResourcesFromBundle<IPractitionerRole | IPractitioner>(bundle).filter(
              (resource) => resource.resourceType === practitionerResourceType
            ) as IPractitioner[]
        )
  );

  if (orgIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (orgError && !organization) {
    return <Alert type="error" message={`${orgError}`} />;
  }

  const org = organization as IOrganization;
  const { active, id, identifier } = parseOrganization(org);

  const practitionerKeyValues = {
    [t('Team practitioners')]: (
      <ul id="practitioner-teams">
        {(assignedPractitioners ?? []).map((practitioner) => {
          const officialNames = getObjLike(practitioner.name, 'use', IdentifierUseCodes.OFFICIAL);
          const firstOficialName = officialNames[0];
          return <li key={practitioner.id}>{parseFhirHumanName(firstOficialName)}</li>;
        })}
      </ul>
    ),
  };
  const organizationKeyValues = {
    [t('Team id')]: id,
    [t('Team identifier')]: identifier,
    [t('Team status')]: active ? t('Active') : t('Disabled'),
  };

  return (
    <Space direction="vertical">
      {renderObjectAsKeyvalue(organizationKeyValues)}
      {assignedPractitionersLoading ? (
        <Alert description={t('Fetching assigned practitioners')} type="info"></Alert>
      ) : assignedPractitioners?.length ? (
        renderObjectAsKeyvalue(practitionerKeyValues)
      ) : (
        <Alert
          description={t('Organiation does not have any assigned practitioners')}
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
  const { resourceId, fhirBaseURL } = props;
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
          onClick={() => history.push(ORGANIZATION_LIST_URL)}
        />
      </div>
      <ViewDetails resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
    </Col>
  );
};
