import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { FlagResourceType, GroupResourceType, ListResourceType } from '../../constants';
import { Alert, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import type { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  locationResourceType,
  servicePointProfileInventoryListCoding,
} from '@opensrp/fhir-helpers';
import { buildInitialFormFieldValues } from '../Utils/utils';

export interface ProductFlagProps {
  fhirBaseURL: string;
  inventoryGroupId: string;
}

export const ProductFlag = (props: ProductFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl, inventoryGroupId } = props;

  // const { t } = useTranslation();
  // const configuredPractAssignmentStrategy = getConfig('practToOrgAssignmentStrategy');

  const inventoryGroup = useQuery(
    [GroupResourceType, inventoryGroupId],
    () =>
      new FHIRServiceClass<IGroup>(fhirBaseUrl, GroupResourceType).read(
        inventoryGroupId?.split('/')[1] as string
      ),
    { enabled: !!inventoryGroupId?.split('/')[1] }
  );

  const product = useQuery(
    [GroupResourceType, inventoryGroup.data?.member?.[0]?.entity?.reference?.split('/')[1]],
    () =>
      new FHIRServiceClass<IGroup>(fhirBaseUrl, GroupResourceType).read(
        inventoryGroup.data?.member?.[0]?.entity?.reference?.split('/')[1] as string
      ),
    { enabled: !!inventoryGroup.data?.member?.[0]?.entity?.reference?.split('/')[1] }
  );

  const list = useQuery(
    [ListResourceType, inventoryGroupId],
    () =>
      new FHIRServiceClass<IList>(fhirBaseUrl, ListResourceType).list({
        item: inventoryGroupId?.split('/')[1],
        code: `${servicePointProfileInventoryListCoding.system}|${servicePointProfileInventoryListCoding.code}`,
      }),
    { enabled: !!inventoryGroupId?.split('/')[1] }
  );

  const location = useQuery(
    [locationResourceType, list.data?.subject],
    async () =>
      new FHIRServiceClass<ILocation>(fhirBaseUrl, FlagResourceType).read(
        `${list.data?.subject as string}`
      ),
    {
      enabled: !!list.data?.subject,
    }
  );

  if (
    inventoryGroup.isLoading ||
    inventoryGroup.isFetching ||
    product.isLoading ||
    product.isFetching ||
    list.isLoading ||
    list.isFetching
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (inventoryGroup.error && !inventoryGroup.data) {
    return <BrokenPage errorMessage={(inventoryGroup.error as Error).message} />;
  }

  const initialValues = buildInitialFormFieldValues(product.data?.name, location.data?.name);

  return product.data?.name && location.data?.name ? (
    <CloseFlagForm fhirBaseUrl={fhirBaseUrl} initialValues={initialValues} />
  ) : (
    <Alert
      message="Invalid Flag"
      description={
        'Missing product or location items. This information is required to close the flag form.'
      }
      type="error"
    />
  );
};

export default ProductFlag;
