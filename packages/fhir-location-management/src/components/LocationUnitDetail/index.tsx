import { Button, Alert, Spin, Col } from 'antd';
import React, { MouseEventHandler } from 'react';
import { get } from 'lodash';
import { CloseOutlined } from '@ant-design/icons';
import {
  FHIRServiceClass,
  getObjLike,
  IdentifierUseCodes,
  SingleKeyNestedValue,
} from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { locationResourceType } from '../../constants';
import { useTranslation } from '../../mls';

export interface LUDProps {
  onClose: MouseEventHandler<HTMLElement>;
  fhirBaseUrl: string;
  detailId: string;
}

export const LocationUnitDetail: React.FC<LUDProps> = (props: LUDProps) => {
  const { onClose, fhirBaseUrl, detailId } = props;
  const { t } = useTranslation();

  // fetch location details for the the selected location
  const serve = new FHIRServiceClass<ILocation>(fhirBaseUrl, locationResourceType);
  const { data, isLoading, error } = useQuery(
    [locationResourceType, detailId],
    async () => serve.read(detailId as string),
    {
      select: (res) => res,
      enabled: !!detailId,
    }
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner flex-grow-1" />;
  }

  if (error && !data) {
    return <Alert data-testid="error-alert" message={`${error}`} type="error" />;
  }

  if (!data) {
    return (
      <Alert data-testid="info-alert" message={t('Location resource not found')} type="info" />
    );
  }

  const { name, status, description, id, identifier: identifierArr } = data;
  const identifier = getObjLike(identifierArr, 'use', IdentifierUseCodes.OFFICIAL);
  const detailsMap = {
    [t('Location id')]: id,
    [t('identifier')]: get(identifier, '0.value'),
    [t('Name')]: name,
    [t('alias')]: get(data, 'alias.0'),
    [t('Status')]: status,
    [t('Physical type')]: get(data, 'physicalType.coding.0.display'),
    [t('Description')]: description,
  };

  return (
    <Col className="pl-3" span={5}>
      <div className="p-4 bg-white" data-testid="view-details">
        <Button
          shape="circle"
          onClick={onClose}
          className="float-right"
          type="text"
          icon={<CloseOutlined />}
        />

        {Object.entries(detailsMap).map(([key, value]) => {
          const singleMapValue = { [key]: value };
          return (
            <div data-testid="single-key-value" key={key} className="pb-3">
              <SingleKeyNestedValue {...singleMapValue} />
            </div>
          );
        })}
      </div>
    </Col>
  );
};
