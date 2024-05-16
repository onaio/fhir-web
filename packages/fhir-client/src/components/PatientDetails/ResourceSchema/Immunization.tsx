import React from 'react';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, sorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';

export const parseImmunization = (obj: IImmunization) => {
  return {
    status: get(obj, 'status'),
    vaccineCode: getCodeableConcepts(get(obj, 'vaccineCode')),
    occurrenceDateTime: get(obj, 'occurrenceDateTime'),
    reasonCode: getCodeableConcepts(get(obj, 'reasonCode')),
    dateRecorded: get(obj, 'recorded'),
    protocolApplied: get(obj, 'protocolApplied'),
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
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
  },
];

export const immunizationSearchParams = (patientId: string) => {
  return { patient: patientId };
};

export const immunizationSideViewData = (resoure: IImmunization, t: TFunction) => {
  const { id, reasonCode, status, vaccineCode, protocolApplied, dateRecorded } =
    parseImmunization(resoure);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Date recorded')]: dateRecorded,
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
