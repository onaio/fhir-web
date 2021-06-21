import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Groups, Patient } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { GROUP_GET, PATIENT_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import FHIR from 'fhirclient';
import { useQuery } from 'react-query';
import { FhirObject, FHIRResponse, ProcessFHIRObject, ProcessFHIRResponse } from '../../fhirutils';
import { loadHealthcareDetails } from '../../utils';

export interface Props {
  fhirBaseURL: string;
}

/** default component props */
export const defaultProps = {
  fhirBaseURL: '',
};

export const GroupAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIR.client(fhirBaseURL);
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Healthcares = useQuery([GROUP_GET, params.id], () => serve.request(GROUP_GET + params.id), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FhirObject<Groups>) => ProcessFHIRObject(res),
    enabled: params.id !== undefined,
  });

  const organizations = useQuery([PATIENT_GET], () => serve.request(PATIENT_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<Patient>) => ProcessFHIRResponse(res),
  });

  if (params.id && Healthcares.data && !initialValue) {
    const healthcares = Healthcares.data;
    const organizationid = healthcares.providedBy?.reference?.split('/')[1];
    setInitialValue({ ...healthcares, organizationid: organizationid ?? undefined });
  }

  console.log(organizations.data, !organizations.data);

  if (!organizations.data || (params.id && !initialValue)) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT : lang.CREATE} Team</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `${lang.EDIT_TEAM} | ${initialValue.name}` : lang.CREATE_TEAM}
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

export default GroupAddEdit;
