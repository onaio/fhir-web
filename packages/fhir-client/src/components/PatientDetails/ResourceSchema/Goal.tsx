import React from 'react';
import { IGoal } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGoal';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseGoal = (obj: IGoal) => {
  return {
    category: getCodeableConcepts(get(obj, 'category')),
    status: get(obj, 'lifeCycleStatus'),
    id: get(obj, 'id'),
    description: get(obj, 'description'),
    priority: get(obj, 'priority'),
    achievementStatus: get(obj, 'achievementStatus'),
  };
};

export type GoalTableData = ReturnType<typeof parseGoal>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Achievement status',
    dataIndex: 'achievementStatus',
  },
  { title: 'Priority', dataIndex: 'priority' },
];
