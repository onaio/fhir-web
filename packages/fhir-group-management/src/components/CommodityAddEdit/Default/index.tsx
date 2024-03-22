import React from 'react';
import { Helmet } from 'react-helmet';
import { CommodityForm } from '../../ProductForm';
import { useParams } from 'react-router';
import {
  accountabilityPeriod,
  appropriateUsage,
  availability,
  condition,
  groupResourceType,
  isAttractiveItem,
  LIST_COMMODITY_URL,
  materialNumber,
  productImage,
} from '../../../constants';
import { Spin } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  generateGroupPayload,
  getGroupFormFields,
  postPutGroup,
  updateListReferencesFactory,
  validationRulesFactory,
} from './utils';
import { useTranslation } from '../../../mls';

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
    ? t('Edit commodity | {{name}}', { name: groupQuery.data.name ?? '' })
    : t('Create commodity');

  const postSuccess = updateListReferencesFactory(fhirBaseUrl, listId);

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div className="bg-white p-5">
        <CommodityForm
          hidden={[
            materialNumber,
            isAttractiveItem,
            availability,
            condition,
            appropriateUsage,
            accountabilityPeriod,
            productImage,
          ]}
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          cancelUrl={LIST_COMMODITY_URL}
          successUrl={LIST_COMMODITY_URL}
          postSuccess={postSuccess}
          validationRulesFactory={validationRulesFactory}
          mutationEffect={async (initialValues, values) => {
            const payload = generateGroupPayload(values, initialValues);
            return postPutGroup(fhirBaseUrl, payload);
          }}
        />
      </div>
    </section>
  );
};
