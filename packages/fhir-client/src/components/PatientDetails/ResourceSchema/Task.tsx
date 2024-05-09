import React from 'react';
import { get } from 'lodash';
import { FhirPeriod, sorterFn } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';

export const parseTask = (obj: ITask) => {
  return {
    status: get(obj, 'status'),
    description: get(obj, 'description'),
    executionPeriod: get(obj, 'executionPeriod'),
    id: get(obj, 'id'),
  };
};

export const parseTaskList = (list: ITask[]) => {
  return list.map(parseTask);
};

export type TaskTableData = ReturnType<typeof parseTask>;

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    sorter: sorterFn('status'),
  },
  {
    title: t('Period'),
    dataIndex: 'executionPeriod' as const,
    render: (value: Period) => <FhirPeriod {...value} />,
  },
  {
    title: t('Description'),
    dataIndex: 'description',
  },
];

export const taskSearchParams = (patientId: string) => {
  return { patient: patientId };
};
