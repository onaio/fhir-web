import React from 'react';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, sorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseServiceRequest = (obj: IPractitioner) => {
  return {
    authoredOn: get(obj, 'authoredOn'),
    id: get(obj, 'id'),
    category: getCodeableConcepts(get(obj, 'category')),
  };
};

export type ParseServiceRequest = ReturnType<typeof parseServiceRequest>;

const authoredSorterFn = sorterFn('authoredOn', true);

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id' as const,
  },
  {
    title: 'Date authored',
    dataIndex: 'authoredOn' as const,
    sorter: authoredSorterFn,
  },
  {
    title: 'Category',
    dataIndex: 'category' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
];
