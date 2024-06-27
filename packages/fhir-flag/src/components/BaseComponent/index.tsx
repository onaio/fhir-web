import React from 'react';

import { useParams } from 'react-router';
import { FlagResourceType } from '../../constants';
import { Col, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import type { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import ProductFlag from '../ProductFlag';
import LocationFlag from '../LocationFlag';

export interface CloseFlagProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const CloseFlag = (props: CloseFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: flagId } = useParams<RouteParams>();

  const flag = useQuery(
    [FlagResourceType, flagId],
    async () =>
      new FHIRServiceClass<IFlag>(fhirBaseUrl, FlagResourceType).read(`${flagId as string}`),
    {
      enabled: !!flagId,
    }
  );

  if (flag.isLoading || flag.isFetching) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (flag.error && !flag.data) {
    return <BrokenPage errorMessage={(flag.error as Error).message} />;
  }

  const headerProps = {
    pageHeaderProps: {
      title: 'Close Flags',
      onBack: undefined,
    },
  };

  return (
    <Row>
      <Col span={24}>
        {flag.data?.subject?.reference?.includes('Location') ? (
          <LocationFlag fhirBaseURL={fhirBaseUrl} locationId={flag?.data?.subject?.reference} />
        ) : (
          <ProductFlag
            fhirBaseURL={fhirBaseUrl}
            inventoryGroupId={flag.data?.subject?.reference as any}
          />
        )}
      </Col>
    </Row>
  );
};

export default CloseFlag;
