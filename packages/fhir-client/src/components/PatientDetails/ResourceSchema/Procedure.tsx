import React from 'react';
import { IProcedure } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IProcedure';
import { get } from 'lodash';
import { intlFormatDateStrings } from '@opensrp/react-utils';
import { dateStringSorterFn, FhirCodesTooltips, getCodeableConcepts } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseProcedure = (obj: IProcedure) => {
  return {
    type: getCodeableConcepts(get(obj, 'type')),
    status: get(obj, 'status'),
    performedDateTime: get(obj, 'performedDateTime'),
    procedure: getCodeableConcepts(get(obj, 'code')),
  };
};

export type ProcedureTableData = ReturnType<typeof parseProcedure>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },

  {
    title: 'Performed Date',
    dataIndex: 'date',
    sorter: dateStringSorterFn,
    render: (value: string) => intlFormatDateStrings(value),
  },
  {
    title: 'Procedure',
    dataIndex: 'procedure',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
];
