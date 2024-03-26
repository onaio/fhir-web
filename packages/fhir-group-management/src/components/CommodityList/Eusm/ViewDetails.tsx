import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Spin, Alert, Space, Skeleton } from 'antd';
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
    identifier,
  } = parseEusmCommodity(group, binaryQuery.data);

  const keyValues = {
    [t('Product Id')]: id,
    [t('Material Number')]: identifier,
    [t('Name')]: name,
    [t('Active')]: active ? t('Active') : t('Disabled'),
    [t('Attractive item')]: attractive ? t('Yes') : t('No'),
    [t('Is it there')]: availability,
    [t('Is it in good condition')]: condition,
    [t('Is it being used appropriately')]: appropriateUsage,
    [t('Accountability period (in months)')]: accountabilityPeriod,
  };

  return (
    <Space direction="vertical">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '16px',
          paddingTop: '16px',
        }}
      >
        {photoDataUrl ? (
          <img
            style={{
              maxHeight: '192px',
              width: 'auto',
            }}
            data-testid="e-img"
            src={photoDataUrl}
            alt="product"
          />
        ) : (
          <FallbackImage active={binaryQuery.isLoading} />
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

const FallbackImage = ({ active }: { active: boolean }) => {
  return (
    <Skeleton.Image
      className="fallback-img"
      style={{
        height: '192px',
        width: '192px',
      }}
      active={active}
    />
  );
};

/**
 * parse a Group to object we can easily consume in Table layout
 *
 * @param obj - the organization resource object
 * @param binary - image binary
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
