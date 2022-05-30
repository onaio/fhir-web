import React from 'react';
import { IProcedure } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IProcedure';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, sorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';

export const parseProcedure = (obj: IProcedure) => {
  return {
    type: getCodeableConcepts(get(obj, 'type')),
    status: get(obj, 'status'),
    performedDateTime: get(obj, 'performedDateTime'),
    procedure: getCodeableConcepts(get(obj, 'code')),
  };
};

export type ProcedureTableData = ReturnType<typeof parseProcedure>;

const dateSorterFn = sorterFn('date', true);

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },

  {
    title: t('Performed Date'),
    dataIndex: 'date',
    sorter: dateSorterFn,
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
  },
  {
    title: t('Procedure'),
    dataIndex: 'procedure',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Status'),
    dataIndex: 'status',
  },
];
