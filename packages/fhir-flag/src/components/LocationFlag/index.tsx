import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { Alert, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { locationResourceType } from '@opensrp/fhir-helpers';
import { buildInitialFormFieldValues } from '../Utils/utils';

export interface LocationFlagProps {
  fhirBaseURL: string;
  locationId: any;
}

export const LocationFlag = (props: LocationFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl, locationId } = props;

  const location = useQuery(
    [locationResourceType, locationId],
    async () => new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(`${locationId as string}`),
    {
      enabled: !!locationId,
    }
  );

  if (location.isLoading || location.isFetching) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (location.error && !location.data) {
    return <BrokenPage errorMessage={(location.error as Error).message} />;
  }

  const initialValues = buildInitialFormFieldValues(undefined, location.data?.name);

  return location.data?.name ? (
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

export default LocationFlag;
