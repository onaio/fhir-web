import React from 'react';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { get } from 'lodash';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { getCodeableConcepts, FhirPeriod, FhirCodesTooltips } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseEncounter = (encounter: IEncounter) => {
  return {
    type: getCodeableConcepts(get(encounter, 'type')),
    reason: getCodeableConcepts(get(encounter, 'reasonCode')),
    status: get(encounter, 'status'),
    classCode: getCodeableConcepts(get(encounter, 'class')),
    period: get(encounter, 'period'),
    duration: get(encounter, 'duration'),
  };
};

export type EncounterTableData = ReturnType<typeof parseEncounter>;

export const columns = (t: TFunction) => [
  {
    title: t('Period'),
    dataIndex: 'period' as const,
    render: (value: Period) => <FhirPeriod {...value} />,
  },
  {
    title: t('Reason'),
    dataIndex: 'reason' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Status'),
    dataIndex: 'status' as const,
  },
  {
    title: t('Class'),
    dataIndex: 'classCode' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Type'),
    dataIndex: 'type' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
];
