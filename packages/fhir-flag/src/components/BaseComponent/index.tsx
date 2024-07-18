import React from 'react';
import { useParams } from 'react-router';
import { FlagResourceType, PractitionerResourceType } from '@opensrp/fhir-helpers';
import { Col, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage, getResourcesFromBundle } from '@opensrp/react-utils';
import type { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import ProductFlag from '../ProductFlag';
import LocationFlag from '../LocationFlag';
import { useSelector } from 'react-redux';
import { getExtraData } from '@onaio/session-reducer';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { useTranslation } from '../../mls';
import { thatiMinutes } from '../../constants';

export interface CloseFlagProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const CloseFlag = (props: CloseFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;
  const { t } = useTranslation();

  const extraData = useSelector((state) => {
    return getExtraData(state);
  });
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { user_id } = extraData;

  const { id: flagId } = useParams<RouteParams>();

  const flag = useQuery(
    [FlagResourceType, flagId],
    async () =>
      new FHIRServiceClass<IFlag>(fhirBaseUrl, FlagResourceType).read(`${flagId as string}`),
    {
      enabled: !!flagId,
      staleTime: thatiMinutes,
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
      staleTime: thatiMinutes,
      select: (response) => {
        return getResourcesFromBundle<IPractitioner>(response)?.[0];
      },
    }
  );

  if (flag.isLoading || practitioner.isLoading) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }
  if (flag.error && !flag.data) {
    return <BrokenPage errorMessage={t('Error occurred while trying to fetch flag data')} />;
  }
  if (practitioner.error && !practitioner.data) {
    return (
      <BrokenPage errorMessage={t('Error occurred while trying to fetch practitioners data')} />
    );
  }

  const commonProps = {
    practitionerId: practitioner.data?.id as string,
    fhirBaseUrl: fhirBaseUrl,
    flag: flag.data as IFlag,
  };

  return (
    <Row>
      <Col span={24}>
        {flag.data?.subject?.reference?.includes('Location') ? (
          <LocationFlag {...commonProps} locationReference={flag.data.subject.reference} />
        ) : (
          <ProductFlag {...commonProps} inventoryGroupReference={flag.data?.subject.reference} />
        )}
      </Col>
    </Row>
  );
};

export default CloseFlag;
