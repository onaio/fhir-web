import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { HealthcareService } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { HEALTHCARES_GET } from '../../constants';
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

export const HealthCareAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIR.client(fhirBaseURL);
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Healthcares = useQuery(
    [HEALTHCARES_GET, params.id],
    () => serve.request(HEALTHCARES_GET + params.id),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: FhirObject<HealthcareService>) => ProcessFHIRObject(res),
      enabled: params.id !== undefined,
    }
  );

  if (params.id && Healthcares.data && !initialValue) {
    // loadHealthcareDetails({
    //   team: team.data,
    //   fhirBaseURL: fhirBaseURL,
    //   AllRoles: AllRoles.data,
    // }).then((team) =>
    //   setInitialValue({
    //     active: team.active,
    //     name: team.name,
    //     practitioners: team.practitioners.map((prac) => prac.id),
    //   })
    // );
  }

  if (params.id && !initialValue) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT : lang.CREATE} Team</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `${lang.EDIT_TEAM} | ${initialValue.name}` : lang.CREATE_TEAM}
      </h5>

      <div className="bg-white p-5">
        <Form fhirBaseURL={fhirBaseURL} initialValue={initialValue} id={params.id} />
      </div>
    </section>
  );
};

export default HealthCareAddEdit;
