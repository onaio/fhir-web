import React from 'react';
import { Helmet } from 'react-helmet';
import { CommodityForm } from '../../ProductForm';
import { useParams } from 'react-router';
import { LIST_COMMODITY_URL, unitOfMeasure } from '../../../constants';
import { Spin } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { BrokenPage } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  EusmGroupFormFields,
  generateGroupPayload,
  getGroupFormFields,
  postPutBinary,
  postPutGroup,
  updateListReferencesFactory,
  validationRulesFactory,
} from './utils';
import { useTranslation } from '../../../mls';
import { useGetGroupAndBinary } from '../../../helpers/utils';
import { IBinary } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBinary';

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

  const { groupQuery, binaryQuery } = useGetGroupAndBinary(fhirBaseUrl, resourceId);

  // TODO - Had to include binaryQuery loading status since the antd form upload widget
  // does not update when we pass new set of initial values to commodityForm.
  if (
    (!groupQuery.isIdle && groupQuery.isLoading) ||
    (!binaryQuery.isIdle && binaryQuery.isLoading)
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (groupQuery.error && !groupQuery.data) {
    return <BrokenPage errorMessage={(groupQuery.error as Error).message} />;
  }
  const initialValues = getGroupFormFields(groupQuery.data, binaryQuery.data);

  const pageTitle = groupQuery.data
    ? t('Edit commodity | {{name}}', { name: groupQuery.data.name ?? '' })
    : t('Create commodity');

  const postSuccess = updateListReferencesFactory(fhirBaseUrl, listId, binaryQuery.data);

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div className="bg-white p-5">
        <CommodityForm<
          { group: IGroup; binary?: IBinary; binaryChanged: boolean },
          EusmGroupFormFields
        >
          hidden={[unitOfMeasure]}
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          cancelUrl={LIST_COMMODITY_URL}
          successUrl={LIST_COMMODITY_URL}
          postSuccess={postSuccess}
          validationRulesFactory={validationRulesFactory}
          mutationEffect={async (initialValues, values) => {
            const { group, binary, binaryChanged } = await generateGroupPayload(
              values,
              initialValues
            );

            let binaryResponse;
            if (binary) {
              binaryResponse = await postPutBinary(fhirBaseUrl, binary);
            }
            const groupResponse = await postPutGroup(fhirBaseUrl, group);
            return { group: groupResponse, binary: binaryResponse, binaryChanged };
          }}
        />
      </div>
    </section>
  );
};
