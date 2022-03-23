import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Groups } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { GROUP_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import FHIR from 'fhirclient';
import { useQuery } from 'react-query';

export interface Props {
  fhirBaseURL: string;
}

export const GroupAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIR.client(fhirBaseURL);
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const group = useQuery([GROUP_GET, params.id], () => serve.request(GROUP_GET + params.id), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: Groups) => res,
    enabled: params.id !== undefined,
  });

  if (params.id && group.data && !initialValue) {
    const { data } = group;
    setInitialValue({ ...data });
  }

  if (params.id && !initialValue) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT_GROUP : lang.CREATE_GROUP}</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `${lang.EDIT_GROUP} | ${initialValue.name}` : lang.CREATE_GROUP}
      </h5>

      <div className="bg-white p-5">
        <Form fhirBaseURL={fhirBaseURL} initialValue={initialValue} />
      </div>
    </section>
  );
};

export default GroupAddEdit;
