import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { thatiMinutes } from '../../constants';
import { Button, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import {
  listResourceType,
  locationResourceType,
  servicePointProfileInventoryListCoding,
  groupResourceType,
} from '@opensrp/fhir-helpers';
import { putCloseFlagResources } from '../Utils/utils';
import { useTranslation } from '../../mls';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

export interface ProductFlagProps {
  fhirBaseUrl: string;
  flag: IFlag;
  practitionerId: string;
  inventoryGroupReference?: string;
}

export const ProductFlag = (props: ProductFlagProps) => {
  const { fhirBaseUrl, inventoryGroupReference, flag, practitionerId } = props;
  const { t } = useTranslation();

  const inventoryGroup = useQuery(
    [groupResourceType, inventoryGroupReference],
    () => new FHIRServiceClass<IGroup>(fhirBaseUrl, '').read(inventoryGroupReference as string),
    {
      enabled: !!inventoryGroupReference,
      staleTime: thatiMinutes, // 30 minutes
    }
  );

  const product = useQuery(
    [groupResourceType, inventoryGroup.data?.member?.[0]?.entity?.reference],
    () =>
      new FHIRServiceClass<IGroup>(fhirBaseUrl, '').read(
        inventoryGroup.data?.member?.[0]?.entity?.reference as string
      ),
    {
      enabled: !!inventoryGroup.data?.member?.[0]?.entity?.reference,
      staleTime: thatiMinutes, // 30 minutes
    }
  );

  const list = useQuery(
    [listResourceType, inventoryGroupReference],
    () =>
      new FHIRServiceClass<IBundle>(fhirBaseUrl, listResourceType).list({
        item: inventoryGroupReference?.split('/')[1],
        code: `${servicePointProfileInventoryListCoding.system}|${servicePointProfileInventoryListCoding.code}`,
      }),
    {
      enabled: !!inventoryGroupReference?.split('/')[1],
      staleTime: thatiMinutes, // 30 minutes
    }
  );

  const location = useQuery(
    [locationResourceType, (list.data?.entry?.[0].resource as IList)?.subject?.reference],
    async () =>
      new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(
        `${(list.data?.entry?.[0].resource as IList)?.subject?.reference as string}`
      ),
    {
      enabled: !!(list.data?.entry?.[0].resource as IList)?.subject?.reference,
      staleTime: thatiMinutes, // 30 minutes
    }
  );

  if (
    inventoryGroup.isLoading ||
    inventoryGroup.isFetching ||
    product.isLoading ||
    product.isFetching ||
    list.isLoading ||
    list.isFetching ||
    location.isLoading ||
    location.isFetching
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (inventoryGroup.error && !inventoryGroup.data) {
    return <BrokenPage errorMessage={(inventoryGroup.error as Error).message} />;
  }

  const initialValues = {
    productName: product.data?.name,
    locationName: location.data?.name,
    listSubject: (list.data?.entry?.[0].resource as IList)?.subject?.reference,
    status: flag?.status,
    practitionerId,
  };

  return product.data?.name && location.data?.name ? (
    <CloseFlagForm
      fhirBaseUrl={fhirBaseUrl}
      initialValues={initialValues}
      flag={flag}
      mutationEffect={async (initialValues, values, activeFlag): Promise<unknown> => {
        return putCloseFlagResources(initialValues, values, activeFlag, fhirBaseUrl);
      }}
    />
  ) : (
    <BrokenPage
      title={t('Invalid Flag')}
      errorMessage={t(
        'Missing  location field. This information is required to close the flag form.'
      )}
      extraLinks={
        (
          <>
            <Button
              type="primary"
              onClick={() => {
                window.close();
              }}
            >
              {t('Close App')}
            </Button>
          </>
        ) as React.ReactNode
      }
    />
  );
};

export default ProductFlag;
