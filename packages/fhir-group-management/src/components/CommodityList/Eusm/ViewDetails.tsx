import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Spin, Alert, Space, Image } from 'antd';
import { Group } from '../../../types';
import {
  getObjLike,
  IdentifierUseCodes,
  SingleKeyNestedValue,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import { get } from 'lodash';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../../mls';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import {
  accountabilityCharacteristicCoding,
  appropriateUsageCharacteristicCoding,
  attractiveCharacteristicCoding,
  availabilityCharacteristicCoding,
  conditionCharacteristicCoding,
  getCharacteristicWithCoding,
  useGetGroupAndBinary,
} from '../../../helpers/utils';
import { IBinary } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBinary';

/** typings for the view details component */
export interface EusmViewDetailsProps {
  resourceId: string;
  fhirBaseURL: string;
}

export type ViewDetailsWrapperProps = Pick<EusmViewDetailsProps, 'fhirBaseURL'> & {
  resourceId?: string;
};

/**
 * Displays Organization Details
 *
 * @param props - detail view component props
 */
export const EusmViewDetails = (props: EusmViewDetailsProps) => {
  const { resourceId, fhirBaseURL } = props;
  const { t } = useTranslation();

  const {
    groupQuery: { data, isLoading, error },
    binaryQuery,
  } = useGetGroupAndBinary(fhirBaseURL, resourceId);

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <Alert type="error" message={`${error}`} />;
  }

  const group = data as Group;
  const {
    accountabilityPeriod,
    appropriateUsage,
    condition,
    availability,
    attractive,
    photoDataUrl,
    name,
    active,
    id,
  } = parseEusmCommodity(group, binaryQuery.data);

  const keyValues = {
    [t('Product Id')]: id,
    [t('Name')]: name,
    [t('Active')]: active ? t('Active') : t('Disabled'),
    [t('Attractive item')]: attractive,
    [t('Is it there')]: availability,
    [t('Is it in good condition')]: condition,
    [t('Is it being used appropriately')]: appropriateUsage,
    [t('accountability period(in months)')]: accountabilityPeriod,
  };

  return (
    <Space direction="vertical">
      <div>
        {photoDataUrl ? (
          <Image data-testid="product-img" src={photoDataUrl} alt="product photo" />
        ) : (
          fallbackImage
        )}
      </div>
      {Object.entries(keyValues).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
    </Space>
  );
};

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ViewDetailsWrapper = (props: ViewDetailsWrapperProps) => {
  const { resourceId, fhirBaseURL } = props;
  const { removeParam } = useSearchParams();

  if (!resourceId) {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          data-testid="close-button"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => removeParam(viewDetailsQuery)}
        />
      </div>
      <EusmViewDetails resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
    </Col>
  );
};

const fallbackImage = (
  <Image
    data-testid="fallback-img"
    width={200}
    height={200}
    src="error"
    fallback="data:image/png;base64,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"
  />
);

/**
 * parse a Group to object we can easily consume in Table layout
 *
 * @param obj - the organization resource object
 * @param binary
 */
export const parseEusmCommodity = (obj: IGroup, binary?: IBinary) => {
  const { name, active, id, type, identifier: rawIdentifier } = obj;
  const identifierObj = getObjLike(
    rawIdentifier,
    'use',
    IdentifierUseCodes.OFFICIAL
  ) as Identifier[];
  const identifier = get(identifierObj, '0.value');
  const characteristic = obj.characteristic ?? [];
  const accountabilityPeriod = getCharacteristicWithCoding(
    characteristic,
    accountabilityCharacteristicCoding
  )?.valueQuantity?.value;
  const appropriateUsage = getCharacteristicWithCoding(
    characteristic,
    appropriateUsageCharacteristicCoding
  )?.valueCodeableConcept?.text;
  const condition = getCharacteristicWithCoding(characteristic, conditionCharacteristicCoding)
    ?.valueCodeableConcept?.text;
  const availability = getCharacteristicWithCoding(characteristic, availabilityCharacteristicCoding)
    ?.valueCodeableConcept?.text;
  const attractive = getCharacteristicWithCoding(
    characteristic,
    attractiveCharacteristicCoding
  )?.valueBoolean;
  
  const photoDataUrl = binary ? `data:${binary.contentType};base64,${binary.data}` : undefined;

  return {
    accountabilityPeriod,
    appropriateUsage,
    condition,
    availability,
    attractive,
    photoDataUrl,
    name,
    active,
    id,
    identifier,
    lastUpdated: get(obj, 'meta.lastUpdated'),
    type,
    obj,
  };
};
