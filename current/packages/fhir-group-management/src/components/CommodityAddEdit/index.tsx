import React from 'react';
import { Helmet } from 'react-helmet';
import { CommodityForm } from './Form';
import { useParams } from 'react-router';
import { groupResourceType, LIST_COMMODITY_URL } from '../../constants';
import { Spin, PageHeader } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { getGroupFormFields, updateListReferencesFactory } from './utils';
import { useTranslation } from '../../mls';

export interface GroupAddEditProps {
  fhirBaseURL: string;
  listId: string;
}

export interface RouteParams {
  id?: string;
}

export const CommodityAddEdit = (props: GroupAddEditProps) => {
  const { fhirBaseURL: fhirBaseUrl, listId } = props;

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

  const postSuccess = updateListReferencesFactory(fhirBaseUrl, listId);

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <div className="bg-white p-5">
        <CommodityForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          cancelUrl={LIST_COMMODITY_URL}
          successUrl={LIST_COMMODITY_URL}
          postSuccess={postSuccess}
        />
      </div>
    </section>
  );
};
