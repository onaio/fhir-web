import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { Alert, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { locationResourceType } from '@opensrp/fhir-helpers';
import { buildInitialFormFieldValues, postCloseFlagResources } from '../Utils/utils';
import { useSelector } from 'react-redux';
import { getExtraData } from '@onaio/session-reducer';
import { PractitionerResourceType } from '../../constants';

export interface LocationFlagProps {
  fhirBaseURL: string;
  locationId: any;
  activeFlag: any;
}

export const LocationFlag = (props: LocationFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl, locationId, activeFlag } = props;

  const extraData = useSelector((state) => {
    return getExtraData(state);
  });

  const { user_id } = extraData;

  const location = useQuery(
    [locationResourceType, locationId],
    async () => new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(`${locationId as string}`),
    {
      enabled: !!locationId,
    }
  );

  const practitioner = useQuery(
    [PractitionerResourceType, user_id],
    () =>
      new FHIRServiceClass<IPractitioner>(fhirBaseUrl, PractitionerResourceType).list({
        identifier: user_id,
      }),
    {
      enabled: !!user_id,
    }
  );

  if (location.isLoading || location.isFetching) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (location.error && !location.data) {
    return <BrokenPage errorMessage={(location.error as Error).message} />;
  }

  const initialValues = buildInitialFormFieldValues(
    undefined,
    location.data?.name,
    undefined,
    practitioner.data?.id
  );

  return location.data?.name ? (
    <CloseFlagForm
      fhirBaseUrl={fhirBaseUrl}
      initialValues={initialValues}
      activeFlag={activeFlag}
      mutationEffect={async (initialValues, values, activeFlag): Promise<any> => {
        return postCloseFlagResources(initialValues, values, activeFlag, fhirBaseUrl);
      }}
    />
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
