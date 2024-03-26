import React, { useMemo } from 'react';
import { useTranslation } from '../../mls';
import { Helmet } from 'react-helmet';
import { BrokenPage, FHIRServiceClass, PageHeader } from '@opensrp/react-utils';
import { AddLocationInventoryForm } from './form';
import { useParams } from 'react-router';
import { groupResourceType, locationResourceType } from '../../constants';
import { useQuery } from 'react-query';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { getInventoryInitialValues } from './utils';
import { GroupFormFields } from './types';
import { Spin } from 'antd';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

interface AddLocationInventoryProps {
  fhirBaseURL: string;
  listId?: string;
  commodityListId?: string;
}

export interface RouteParams {
  servicePointId: string;
  inventoryId?: string;
}

/**
 * component to add location inventory
 *
 * @param  props - AddLocationInventoryProps component props
 * @returns returns form to add location inventories
 */
export const AddLocationInventory = (props: AddLocationInventoryProps) => {
  const { fhirBaseURL, listId, commodityListId } = props;
  const { t } = useTranslation();
  const { inventoryId, servicePointId } = useParams<RouteParams>();
  const pageTitle = inventoryId ? t('Edit locations Inventory') : t('Add locations Inventory');

  const inventoryResource = useQuery(
    [fhirBaseURL, inventoryId],
    async () =>
      await new FHIRServiceClass<IGroup>(fhirBaseURL, groupResourceType).read(
        inventoryId as string
      ),
    {
      enabled: !!inventoryId,
    }
  );

  const servicePoint = useQuery(
    [fhirBaseURL, servicePointId],
    async () =>
      await new FHIRServiceClass<ILocation>(fhirBaseURL, locationResourceType).read(
        servicePointId as string
      )
  );

  const error = inventoryResource.error || servicePoint.error;
  const isLoading = inventoryResource.isLoading || servicePoint.isLoading;

  const initialValues = useMemo(
    () => (inventoryResource.data ? getInventoryInitialValues(inventoryResource.data) : {}),
    [inventoryResource.data]
  );

  if (
    (inventoryResource.error && !inventoryResource.data) ||
    (servicePoint.error && !servicePoint.data)
  ) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const formProps = {
    fhirBaseURL,
    listResourceId: listId as string,
    inventoryId,
    initialValues: initialValues as GroupFormFields,
    inventoryResourceObj: inventoryResource.data,
    servicePointObj: servicePoint.data as ILocation,
    commodityListId,
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
