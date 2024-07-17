import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { locationResourceType } from '@opensrp/fhir-helpers';
import { putCloseFlagResources } from '../Utils/utils';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';

export interface LocationFlagProps {
  fhirBaseUrl: string;
  locationReference: string;
  flag: IFlag;
  practitionerId: string;
}

export const LocationFlag = (props: LocationFlagProps) => {
  const { fhirBaseUrl, locationReference, flag, practitionerId } = props;

  const thatiMinutes = 30 * 60 * 1000;
  const {
    data: location,
    isLoading,
    error,
  } = useQuery(
    [locationResourceType, locationReference],
    async () =>
      new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(`${locationReference as string}`),
    {
      enabled: !!locationReference,
      staleTime: thatiMinutes,
    }
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (error && !location) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const initialValues = {
    locationName: location?.name ?? location?.id,
    practitionerId,
    status: flag.status,
  };
  return (
    <CloseFlagForm
      initialValues={initialValues}
      flag={flag}
      mutationEffect={async (initialValues, values, activeFlag): Promise<unknown> => {
        return putCloseFlagResources(initialValues, values, activeFlag, fhirBaseUrl);
      }}
    />
  );
};

export default LocationFlag;
