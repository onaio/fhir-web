import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Spin, Alert, Space } from 'antd';
import { get } from 'lodash';
import { useQuery } from 'react-query';
import { healthCareServiceResourceType } from '../../constants';
import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';
import {
  FHIRServiceClass,
  SingleKeyNestedValue,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import { useTranslation } from '../../mls';

export const parseHealthCare = (obj: IHealthcareService) => {
  const { comment, meta, name, active, id, providedBy } = obj;

  return {
    id,
    name,
    comment,
    active,
    providedBy,
    lastUpdated: get(meta, 'lastUpdated'),
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
 * Displays Health Care Details
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseURL } = props;
  const { t } = useTranslation();

  const {
    data: organization,
    isLoading: orgIsLoading,
    error: orgError,
  } = useQuery([healthCareServiceResourceType, resourceId], () =>
    new FHIRServiceClass<IHealthcareService>(fhirBaseURL, healthCareServiceResourceType).read(
      resourceId as string
    )
  );

  if (orgIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (orgError && !organization) {
    return <Alert type="error" message={`${orgError}`} />;
  }

  const org = organization as IHealthcareService;
  const { id, name, comment, active, providedBy, lastUpdated } = parseHealthCare(org);
  const keyValues = {
    [t('Id')]: id,
    [t('Name')]: name,
    [t('Status')]: active ? t('Active') : t('Inactive'),
    [t('Last Updated')]: t('{{val, datetime}}', { val: new Date(lastUpdated ?? '') }),
    [t('Provided By')]: get(providedBy, 'reference.display'),
    [t('Comment')]: comment,
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
      <ViewDetails resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
    </Col>
  );
};
