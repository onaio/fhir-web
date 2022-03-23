import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { HealthcareService } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { HEALTH_CARE_SERVICE_ENDPOINT, healthCareServiceResourceType } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { history } from '@onaio/connected-reducer-registry';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { Organization, ORGANIZATION_ENDPOINT } from '@opensrp/fhir-team-management';
import { getConfig } from '@opensrp/pkg-config';
export interface Props {
  resourcePageSize?: number;
}

export const HealthCareAddEdit: React.FC<Props> = (props: Props) => {
  const { resourcePageSize = 20 } = props;
  const fhirParams = {
    _count: resourcePageSize,
    _getpagesoffset: 0,
  };

  const fhirBaseURL = getConfig('fhirBaseURL') ?? '';

  const healthcareServiceAPI = new FHIRServiceClass<HealthcareService>(
    fhirBaseURL,
    healthCareServiceResourceType
  );
  const organizationAPI = new FHIRServiceClass<Organization>(
    fhirBaseURL,
    healthCareServiceResourceType
  );
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const healthcares = useQuery(
    [HEALTH_CARE_SERVICE_ENDPOINT, params.id],
    async () => healthcareServiceAPI.read(`${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: HealthcareService) => res,
      enabled: params.id !== undefined,
    }
  );

  const organizations = useQuery(
    ORGANIZATION_ENDPOINT,
    async () => organizationAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
    }
  );

  useEffect(() => {
    if (params.id && healthcares.data && !initialValue) {
      setInitialValue({ comment: '', extraDetails: '', ...healthcares.data });
    }
  }, [params.id, healthcares.data, initialValue]);

  if (!organizations.data || (params.id && !initialValue)) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT : lang.CREATE} Healthcare</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name
          ? `${lang.EDIT_HEALTHCARE} | ${initialValue.name}`
          : lang.CREATE_HEALTHCARE}
      </h5>

      <div className="bg-white p-5">
        <Form
          fhirBaseURL={fhirBaseURL}
          initialValue={initialValue}
          organizations={organizations.data}
          onCancel={() => history.goBack()}
          onSuccess={() => history.goBack()}
        />
      </div>
    </section>
  );
};

export default HealthCareAddEdit;
