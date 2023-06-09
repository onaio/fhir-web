import React from 'react';
import { Helmet } from 'react-helmet';
import { HealthCareForm } from './Form';
import { useParams } from 'react-router';
import { healthCareServiceResourceType, LIST_HEALTHCARE_URL } from '../../constants';
import { organizationResourceType } from '@opensrp/fhir-team-management';
import { sendErrorNotification } from '@opensrp/notifications';
import { PageHeader } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import {
  FHIRServiceClass,
  BrokenPage,
  getResourcesFromBundle,
  loadAllResources,
} from '@opensrp/react-utils';
import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';
import { getHealthCareFormFields } from './utils';
import { useTranslation } from '../../mls';

export interface HealthCareAddEditProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const HealthCareAddEdit = (props: HealthCareAddEditProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const healthCareService = useQuery(
    [healthCareServiceResourceType, resourceId],
    async () =>
      new FHIRServiceClass<IHealthcareService>(fhirBaseUrl, healthCareServiceResourceType).read(
        resourceId as string
      ),
    {
      enabled: !!resourceId,
    }
  );

  const organizations = useQuery(
    [organizationResourceType],
    () => loadAllResources(fhirBaseUrl, organizationResourceType),
    {
      select: (res) => getResourcesFromBundle(res) as IHealthcareService[],
      onError: () => sendErrorNotification(t('Unable to fetch organizations')),
    }
  );

  if ((!healthCareService.isIdle && healthCareService.isLoading) || organizations.isLoading) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (healthCareService.error && !healthCareService.data) {
    return <BrokenPage errorMessage={(healthCareService.error as Error).message} />;
  }

  const initialValues = getHealthCareFormFields(healthCareService.data);

  const pageTitle = healthCareService.data
    ? t('Edit team | {{name}}', { name: healthCareService.data.name ?? '' })
    : t('Create team');

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <div className="bg-white p-5">
        <HealthCareForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          organizations={organizations.data ?? []}
          cancelUrl={LIST_HEALTHCARE_URL}
          successUrl={LIST_HEALTHCARE_URL}
        />
      </div>
    </section>
  );
};
