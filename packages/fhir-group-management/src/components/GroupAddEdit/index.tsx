import React from 'react';
import { Helmet } from 'react-helmet';
import { GroupForm } from './Form';
import { useParams } from 'react-router';
import { groupResourceType, LIST_GROUP_URL } from '../../constants';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { getGroupFormFields } from './utils';
import { useTranslation } from '../../mls';

export interface GroupAddEditProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const GroupAddEdit = (props: GroupAddEditProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const groupQuery = useQuery(
    [groupResourceType, resourceId],
    async () =>
      new FHIRServiceClass<IGroup>(fhirBaseUrl, groupResourceType).read(resourceId as string),
    {
      enabled: !!resourceId,
    }
  );

  if (!groupQuery.isIdle && groupQuery.isLoading) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (groupQuery.error && !groupQuery.data) {
    return <BrokenPage errorMessage={(groupQuery.error as Error).message} />;
  }

  const initialValues = getGroupFormFields(groupQuery.data);

  const pageTitle = groupQuery.data
    ? t('Edit Commodity | {{name}}', { name: groupQuery.data.name ?? '' })
    : t('Create Commodity');

  return (
    <section className="layout-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <h5 className="mb-3 header-title">{pageTitle}</h5>
      <div className="bg-white p-5">
        <GroupForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          cancelUrl={LIST_GROUP_URL}
          successUrl={LIST_GROUP_URL}
        />
      </div>
    </section>
  );
};
