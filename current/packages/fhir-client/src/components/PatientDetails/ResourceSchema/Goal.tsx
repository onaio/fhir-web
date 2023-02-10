import React from 'react';
import { IGoal } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGoal';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';

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

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Category'),
    dataIndex: 'category',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Description'),
    dataIndex: 'description',
  },
  {
    title: t('Status'),
    dataIndex: 'status',
  },
  {
    title: t('Achievement status'),
    dataIndex: 'achievementStatus',
  },
  { title: t('Priority'), dataIndex: 'priority' },
];
