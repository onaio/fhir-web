import React from 'react';
import { Col, Space, Spin, Button, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { FHIRServiceClass, SingleKeyNestedValue } from '@opensrp/react-utils';
import { organizationResourceType, ORGANIZATION_LIST_URL } from '../../../constants';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { get } from 'lodash';
import './index.css';

/**
 * parse an organization to object we can easily consume in Table layout
 *
 * @param org - the organization resource object
 */
export const parseOrganization = (org: IOrganization) => {
  return {
    id: org.id,
    status: org.active ? 'True' : 'False',
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

  const {
    data: organization,
    isLoading: orgIsLoading,
    error: orgError,
  } = useQuery([organizationResourceType, resourceId], () =>
    new FHIRServiceClass<IOrganization>(fhirBaseURL, organizationResourceType).read(
      resourceId as string
    )
  );

  if (orgIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (orgError && !organization) {
    return <Alert type="error" message={`${orgError}`} />;
  }

  const org = organization as IOrganization;
  const { name, type, alias, partOf } = parseOrganization(org);
  const keyValues = {
    Name: name,
    Alias: alias,
    Type: type,
    partOf: partOf,
  };

  return (
    <Space direction="vertical">
      {Object.entries(keyValues).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
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
