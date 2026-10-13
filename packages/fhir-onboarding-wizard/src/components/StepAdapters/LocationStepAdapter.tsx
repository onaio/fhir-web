import React from 'react';
import { Spin, Col } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
import { LocationForm } from '@opensrp/fhir-location-management';
import { useGetLocationHierarchy } from '@opensrp/fhir-location-management'; 
import { defaultValidationRulesFactory } from '@opensrp/fhir-location-management';
import type { LocationFormFields } from '@opensrp/fhir-location-management';
import type { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

interface LocationStepAdapterProps {
   onSubmit: (draft: LocationFormFields & { payload: ILocation }) => void;
  initialValues?: LocationFormFields;
  fhirBaseURL: string;
  fhirRootLocationId: string;
  fhirCustomEndpointBaseURL?: string;
}

export const LocationStepAdapter: React.FC<LocationStepAdapterProps> = (props) => {
  const { data: tree, error, isLoading } = useGetLocationHierarchy(
    props.fhirBaseURL,
    props.fhirRootLocationId,
    {},
    props.fhirCustomEndpointBaseURL
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error || !tree) {
    return <div>Unable to load the location hierarchy. :{JSON.stringify(error)}</div>;
  }

    const headerProps = {
    pageHeaderProps: {
      title: "Add Location Unit",
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Col className="bg-white p-4" span={24}>
        <LocationForm
          fhirBaseURL={props.fhirBaseURL}
          initialValues={props.initialValues ?? ({} as LocationFormFields)}
          tree={tree}
          hidden={[]}
          disabled={[]}
          onCancel={() => undefined}
          validationRulesFactory={defaultValidationRulesFactory}
          successURLGenerator={() => '#'}
          onDraftSubmit={props.onSubmit}
        />
      </Col>
    </BodyLayout>
  );
};