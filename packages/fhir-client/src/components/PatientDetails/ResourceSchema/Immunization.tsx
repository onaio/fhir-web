import React from 'react';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, sorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';
import { dateToLocaleString } from '@opensrp/react-utils';

export const parseImmunization = (obj: IImmunization) => {
  return {
    status: get(obj, 'status'),
    vaccineCode: getCodeableConcepts(get(obj, 'vaccineCode')),
    statusReason: getCodeableConcepts(get(obj, 'statusReason')),
    occurrenceDateTime: get(obj, 'occurrenceDateTime'),
    reportOrigin: getCodeableConcepts(get(obj, 'reportOrigin')),
    reasonCode: getCodeableConcepts(get(obj, 'reasonCode')),
    dateRecorded: get(obj, 'recorded'),
    protocolApplied: get(obj, 'protocolApplied'),
    primarySource: get(obj, 'primarySource'),
    doseQuantity: get(obj, 'doseQuantity'),
    expirationDate: get(obj, 'expirationDate'),
    id: get(obj, 'id'),
  };
};

export const parseImmunizationList = (list: IImmunization[]) => {
  return list.map(parseImmunization);
};

const occuredDateTimeSortFn = sorterFn('occurrenceDateTime', true);

export type ImmunizationTableData = ReturnType<typeof parseImmunization>;

export const columns = (t: TFunction) => [
  {
    title: t('Vaccine Admnistered'),
    dataIndex: 'vaccineCode',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    sorter: sorterFn('status'),
  },
  {
    title: t('Administration Date'),
    dataIndex: 'occurrenceDateTime',
    sorter: occuredDateTimeSortFn,
    render: (value: string) => t('{{val, datetime}}', { val: dateToLocaleString(value, true) }),
  },
];

export const immunizationSearchParams = (patientId: string) => {
  return { patient: patientId };
};

export const immunizationSideViewData = (resource: IImmunization, t: TFunction) => {
  const { id, reasonCode, status, vaccineCode, protocolApplied, dateRecorded } =
    parseImmunization(resource);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Date recorded')]: dateToLocaleString(dateRecorded, true),
    [t('protocol applied')]: protocolApplied?.[0]?.doseNumberPositiveInt,
    [t('status')]: status,
    [t('Reason')]: <FhirCodesTooltips codings={reasonCode} />,
  };
  return {
    title: <FhirCodesTooltips codings={vaccineCode} />,
    headerLeftData,
    bodyData,
    status: {
      title: status ?? '',
      color: 'green',
    },
  };
};

/**
 * Get details displayed on immunization detailed view
 *
 * @param resource - immunization object
 * @param t - translation function
 */
export function immunizationDetailProps(resource: IImmunization, t: TFunction) {
  const {
    id,
    reasonCode,
    status,
    vaccineCode,
    protocolApplied,
    dateRecorded,
    expirationDate,
    occurrenceDateTime,
    doseQuantity,
    primarySource,
    reportOrigin,
  } = parseImmunization(resource);
  const bodyData = {
    [t('Vaccine Admnistered')]: <FhirCodesTooltips codings={vaccineCode} />,
    [t('Administration Date')]: dateToLocaleString(occurrenceDateTime, true),
    [t('Vaccine expiry date')]: dateToLocaleString(expirationDate, true),
    [t('protocol applied')]: protocolApplied?.[0]?.doseNumberPositiveInt,
    [t('Dose quantity')]: doseQuantity?.unit,
    [t('status')]: status,
    [t('Primary source')]: primarySource,
    [t('Report origin')]: <FhirCodesTooltips codings={reportOrigin} />,
    [t('Reason')]: <FhirCodesTooltips codings={reasonCode} />,
  };
  return {
    title: <FhirCodesTooltips codings={vaccineCode} />,
    headerRightData: { [t('Date created')]: dateToLocaleString(dateRecorded) },
    headerLeftData: { [t('Id')]: id },
    bodyData,
    status: {
      title: status,
      color: 'green',
    },
  };
}
