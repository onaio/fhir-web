import React from 'react';
import { get } from 'lodash';
import { FhirCodesTooltips, FhirPeriod, getCodeableConcepts } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Dictionary } from '@onaio/utils';

export const parseTask = (obj: ITask) => {
  return {
    status: get(obj, 'status'),
    description: get(obj, 'description'),
    executionPeriod: get(obj, 'executionPeriod'),
    authoredOn: get(obj, 'authoredOn'),
    intent: get(obj, 'intent'),
    code: get(obj, 'code'),
    codeableCode: getCodeableConcepts(get(obj, 'code')),
    basedOn: get(obj, 'basedOn'),
    priority: get(obj, 'priority'),
    id: get(obj, 'id'),
  };
};

export const parseTaskList = (list: ITask[]) => {
  return list.map(parseTask);
};

export type TaskTableData = ReturnType<typeof parseTask>;

export const columns = (t: TFunction) => [
  {
    title: t('Task'),
    dataIndex: 'codeableCode' as const,
    render: (value: Coding[], tableData: Dictionary) => {
      if (value.length > 0) {
        return <FhirCodesTooltips codings={value} />;
      }
      return tableData.code?.text;
    },
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

export const taskSideViewData = (resoure: ITask, t: TFunction) => {
  const { id, status, intent, executionPeriod, priority, code, codeableCode } = parseTask(resoure);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Period')]: <FhirPeriod {...executionPeriod} />,
    [t('Priority')]: priority,
    [t('Status')]: status,
    [t('Intent')]: intent,
  };
  let title: string | JSX.Element | undefined = code?.text;
  if (codeableCode.length > 0) {
    title = <FhirCodesTooltips codings={codeableCode} />;
  }
  return {
    title,
    headerLeftData,
    bodyData,
    status: {
      title: status ?? '',
      color: 'green',
    },
  };
};
