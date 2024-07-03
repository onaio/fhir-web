import React from 'react';
import { CloseFlagForm } from '../CloseFlagForm';
import { Alert, Col, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { locationResourceType } from '@opensrp/fhir-helpers';
import { buildInitialFormFieldValues, postCloseFlagResources } from '../Utils/utils';

import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';

export interface LocationFlagProps {
  fhirBaseURL: string;
  locationId: string;
  activeFlag: IFlag;
  practitioner: IBundle;
}

export const LocationFlag = (props: LocationFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl, locationId, activeFlag, practitioner } = props;

  const location = useQuery(
    [locationResourceType, locationId],
    async () => new FHIRServiceClass<ILocation>(fhirBaseUrl, '').read(`${locationId as string}`),
    {
      enabled: !!locationId,
      staleTime: 30 * 60 * 1000, // 30 minutes
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
    practitioner?.['entry']?.[0]?.resource?.id
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

export default LocationFlag;
