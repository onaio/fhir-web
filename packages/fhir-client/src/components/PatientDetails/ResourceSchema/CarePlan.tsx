import React from 'react';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import { get } from 'lodash';
import {
  FhirCodesTooltips,
  FhirPeriod,
  getCodeableConcepts,
  rawStringSorterFn,
} from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';

export const parseCareplan = (obj: ICarePlan) => {
  return {
    title: get(obj, 'title'),
    period: get(obj, 'period'),
    categories: getCodeableConcepts(get(obj, 'category')),
    status: get(obj, 'status'),
    id: get(obj, 'id'),
  };
};

export type CarePlanTableData = ReturnType<typeof parseCareplan>;

export const columns = [
  {
    title: 'Title',
    dataIndex: 'title' as const,
    sorter: rawStringSorterFn,
  },
  {
    title: 'Category',
    dataIndex: 'categories' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Period',
    dataIndex: 'period' as const,
    render: (value: Period) => <FhirPeriod {...value} />,
  },
  {
    title: 'Status',
    dataIndex: 'status' as const,
  },
];
