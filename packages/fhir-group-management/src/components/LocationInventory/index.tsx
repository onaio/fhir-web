import React, { useMemo } from 'react';
import { useTranslation } from '../../mls';
import { Helmet } from 'react-helmet';
import { BrokenPage, FHIRServiceClass, PageHeader } from '@opensrp/react-utils';
import { AddLocationInventoryForm } from './form';
import { useParams } from 'react-router';
import { groupResourceType } from '../../constants';
import { useQuery } from 'react-query';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { getInventoryInitialValues } from './utils';
import { GroupFormFields } from './types';
import { Spin } from 'antd';

interface AddLocationInventoryProps {
  fhirBaseURL: string;
  listId?: string;
}

export interface RouteParams {
  id?: string;
}

/**
 * component to add location inventory
 *
 * @param  props - AddLocationInventoryProps component props
 * @returns returns form to add location inventories
 */
export const AddLocationInventory = (props: AddLocationInventoryProps) => {
  const { fhirBaseURL, listId } = props;
  const { t } = useTranslation();
  const { id: locationResourceId } = useParams<RouteParams>();
  const pageTitle = locationResourceId
    ? t('Edit locations Inventory')
    : t('Add locations Inventory');

  const { data, error, isLoading } = useQuery(
    [fhirBaseURL, locationResourceId],
    async () =>
      await new FHIRServiceClass<IGroup>(fhirBaseURL, groupResourceType).read(
        locationResourceId as string
      ),
    {
      enabled: !!locationResourceId,
    }
  );
  const initialValues = useMemo(() => (data ? getInventoryInitialValues(data) : {}), [data]);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const formProps = {
    fhirBaseURL,
    listResourceId: listId as string,
    locationResourceId,
    initialValues: initialValues as GroupFormFields,
    listResourceObj: data,
  };

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div className="bg-white p-5">
        {isLoading ? (
          <Spin size="large" className="custom-spinner"></Spin>
        ) : (
          <AddLocationInventoryForm {...formProps} />
        )}
      </div>
    </section>
  );
};
