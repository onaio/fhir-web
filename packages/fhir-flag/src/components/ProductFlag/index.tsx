import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { GroupResourceType, ListResourceType } from '../../constants';
import { Alert, Col, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import type { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  locationResourceType,
  servicePointProfileInventoryListCoding,
} from '@opensrp/fhir-helpers';
import { buildInitialFormFieldValues, postCloseFlagResources } from '../Utils/utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

export interface ProductFlagProps {
  fhirBaseURL: string;
  inventoryGroupId: string;
  activeFlag: any;
  practitioner: IBundle;
}

export const ProductFlag = (props: ProductFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl, inventoryGroupId, activeFlag, practitioner } = props;

  // const { t } = useTranslation();
  // const configuredPractAssignmentStrategy = getConfig('practToOrgAssignmentStrategy');

  const inventoryGroup = useQuery(
    [GroupResourceType, inventoryGroupId],
    () => new FHIRServiceClass<IGroup>(fhirBaseUrl, '').read(inventoryGroupId as string),
    {
      enabled: !!inventoryGroupId,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const product = useQuery(
    [GroupResourceType, inventoryGroup.data?.member?.[0]?.entity?.reference],
    () =>
      new FHIRServiceClass<IGroup>(fhirBaseUrl, '').read(
        inventoryGroup.data?.member?.[0]?.entity?.reference as string
      ),
    {
      enabled: !!inventoryGroup.data?.member?.[0]?.entity?.reference,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const list = useQuery(
    [ListResourceType, inventoryGroupId],
    () =>
      new FHIRServiceClass<any>(fhirBaseUrl, ListResourceType).list({
        item: inventoryGroupId?.split('/')[1],
        code: `${servicePointProfileInventoryListCoding.system}|${servicePointProfileInventoryListCoding.code}`,
      }),
    {
      enabled: !!inventoryGroupId?.split('/')[1],
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const location = useQuery(
    [locationResourceType, list.data?.entry?.[0]?.resource?.subject?.reference],
    async () =>
      new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(
        `${list.data?.entry?.[0]?.resource?.subject?.reference as string}`
      ),
    {
      enabled: !!list.data?.entry?.[0]?.resource?.subject?.reference,
      staleTime: 30 * 60 * 1000, // 30 minutes
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

  const initialValues = buildInitialFormFieldValues(
    product.data?.name,
    location.data?.name,
    list.data?.entry?.[0]?.resource?.subject?.reference,
    practitioner?.['entry']?.[0]?.resource?.id
  );

  return product.data?.name && location.data?.name ? (
    <CloseFlagForm
      fhirBaseUrl={fhirBaseUrl}
      initialValues={initialValues}
      activeFlag={activeFlag}
      mutationEffect={async (initialValues, values, activeFlag): Promise<any> => {
        return postCloseFlagResources(initialValues, values, activeFlag, fhirBaseUrl);
      }}
    />
  ) : (
    <Row className="user-group">
      <Col className="bg-white p-3" span={24}>
        <Alert
          message="Invalid Flag"
          description={
            'Missing product or location items. This information is required to close the flag form.'
          }
          type="error"
        />
      </Col>
    </Row>
  );
};

export default ProductFlag;
