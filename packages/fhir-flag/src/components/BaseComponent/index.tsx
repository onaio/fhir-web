import React from 'react';

import { useParams } from 'react-router';
import { FlagResourceType, PractitionerResourceType } from '../../constants';
import { Col, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import type { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import ProductFlag from '../ProductFlag';
import LocationFlag from '../LocationFlag';
import { useSelector } from 'react-redux';
import { getExtraData } from '@onaio/session-reducer';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

export interface CloseFlagProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const CloseFlag = (props: CloseFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const extraData = useSelector((state) => {
    return getExtraData(state);
  });

  const { user_id } = extraData;

  const { id: flagId } = useParams<RouteParams>();

  const flag = useQuery(
    [FlagResourceType, flagId],
    async () =>
      new FHIRServiceClass<IFlag>(fhirBaseUrl, FlagResourceType).read(`${flagId as string}`),
    {
      enabled: !!flagId,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const practitioner = useQuery(
    [PractitionerResourceType, user_id],
    () =>
      new FHIRServiceClass<IBundle>(fhirBaseUrl, PractitionerResourceType).list({
        identifier: user_id,
      }),
    {
      enabled: !!user_id,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  if (flag.isLoading || flag.isFetching || practitioner.isLoading || practitioner.isFetching) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (flag.error && !flag.data) {
    return <BrokenPage errorMessage={(flag.error as Error).message} />;
  }

  return (
    <Row>
      <Col span={24}>
        {practitioner.data &&
          flag.data &&
          (flag.data?.subject?.reference?.includes('Location') ? (
            <LocationFlag
              activeFlag={flag.data}
              fhirBaseURL={fhirBaseUrl}
              locationId={flag?.data?.subject?.reference}
              practitioner={practitioner.data}
            />
          ) : (
            <ProductFlag
              activeFlag={flag.data}
              fhirBaseURL={fhirBaseUrl}
              inventoryGroupId={flag.data?.subject?.reference as any}
              practitioner={practitioner.data}
            />
          ))}
      </Col>
    </Row>
  );
};

export default CloseFlag;
