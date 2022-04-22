import React from 'react';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { get } from 'lodash';
import { intlFormatDateStrings } from '@opensrp/react-utils';
import {
  dateStringSorterFn,
  FhirCodesTooltips,
  getCodeableConcepts,
  rawStringSorterFn,
} from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseImmunization = (obj: IImmunization) => {
  return {
    status: get(obj, 'status'),
    vaccineCode: get(obj, 'vaccineCode'),
    occurenceDateTime: get(obj, 'occurenceDateTime'),
    reasonCode: getCodeableConcepts(get(obj, 'reasonCode')),
    id: get(obj, 'id'),
  };
};

export type ImmunizationTableData = ReturnType<typeof parseImmunization>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: rawStringSorterFn,
  },
  {
    title: 'Administration Date',
    dataIndex: 'occurenceDateTime',
    sorter: dateStringSorterFn,
    render: (value: string) => intlFormatDateStrings(value),
  },
  {
    title: 'Vaccine Admnistered',
    dataIndex: 'vaccineCode',
  },
  {
    title: 'Reason',
    dataIndex: 'reasonCode',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
];
