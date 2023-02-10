import React from 'react';
import { IMedicationRequest } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedicationRequest';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, sorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';

export const parseMedicationRequest = (obj: IMedicationRequest) => {
  return {
    authoredOn: get(obj, 'authoredOn'),
    id: get(obj, 'id'),
    reasonCodes: getCodeableConcepts(get(obj, 'reasonCode')),
  };
};

export type MeidationRequestTableData = ReturnType<typeof parseMedicationRequest>;

const authoredSorterFn = sorterFn('authoredOn', true);

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Details'),
    dataIndex: 'reasonCodes',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Authored on'),
    dataIndex: 'authoredOn',
    sorter: authoredSorterFn,
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
  },
];
