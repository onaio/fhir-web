import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { HealthcareService, Organization } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { HEALTHCARES_GET, ORGANIZATION_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import FHIR from 'fhirclient';
import { useQuery } from 'react-query';
import { FhirObject, FHIRResponse, ProcessFHIRObject, ProcessFHIRResponse } from '../../fhirutils';

export interface Props {
  fhirBaseURL: string;
}

/** default component props */
export const defaultProps = {
  fhirBaseURL: '',
};

export const HealthCareAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIR.client(fhirBaseURL);
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Healthcares = useQuery(
    [HEALTHCARES_GET, params.id],
    () => serve.request(`${HEALTHCARES_GET}${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: FhirObject<HealthcareService>) => ProcessFHIRObject(res),
      enabled: params.id !== undefined,
    }
  );

  const organizations = useQuery([ORGANIZATION_GET], () => serve.request(ORGANIZATION_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<Organization>) => ProcessFHIRResponse(res),
  });

  if (params.id && Healthcares.data && !initialValue) {
    const healthcares = Healthcares.data;
    const organizationid = healthcares.providedBy?.reference?.split('/')[1];
    setInitialValue({ ...healthcares, organizationid: organizationid ?? undefined });
  }

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
          organizations={organizations.data}
          initialValue={initialValue}
          id={params.id}
        />
      </div>
    </section>
  );
};

export default HealthCareAddEdit;
