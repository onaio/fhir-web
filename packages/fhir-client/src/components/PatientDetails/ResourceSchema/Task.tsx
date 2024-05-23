import React from 'react';
import { get } from 'lodash';
import { FhirCodesTooltips, FhirPeriod, getCodeableConcepts } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Dictionary } from '@onaio/utils';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { dateToLocaleString } from '@opensrp/react-utils';

export const parseTask = (obj: ITask) => {
  return {
    status: get(obj, 'status'),
    description: get(obj, 'description'),
    executionPeriod: get(obj, 'executionPeriod'),
    authoredOn: get(obj, 'authoredOn'),
    intent: get(obj, 'intent'),
    code: get(obj, 'code'),
    codeableCode: getCodeableConcepts(get(obj, 'code')),
    reasonCode: getCodeableConcepts(get(obj, 'reasonCode')),
    businessStatus: getCodeableConcepts(get(obj, 'businessStatus')),
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

const getTitle = (codeableCode: Coding[], code?: CodeableConcept) => {
  if (codeableCode.length > 0) {
    return <FhirCodesTooltips codings={codeableCode} />;
  }
  return code?.text;
};

export const taskSideViewData = (resource: ITask, t: TFunction) => {
  const { id, status, intent, executionPeriod, priority, code, codeableCode } = parseTask(resource);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Period')]: <FhirPeriod {...executionPeriod} />,
    [t('Priority')]: priority,
    [t('Status')]: status,
    [t('Intent')]: intent,
  };
  return {
    title: getTitle(codeableCode, code),
    headerLeftData,
    bodyData,
    status: {
      title: status ?? '',
      color: 'green',
    },
  };
};

/**
 * Get details displayed on task detailed view
 *
 * @param resource - task object
 * @param t - translation function
 */
export function taskDetailsProps(resource: ITask, t: TFunction) {
  const {
    id,
    status,
    description,
    intent,
    executionPeriod,
    priority,
    businessStatus,
    authoredOn,
    reasonCode,
    code,
    codeableCode,
  } = parseTask(resource);
  const bodyData = {
    [t('Period')]: <FhirPeriod {...executionPeriod} />,
    [t('Priority')]: priority,
    [t('Status')]: status,
    [t('Business status')]: <FhirCodesTooltips codings={businessStatus} />,
    [t('Intent')]: intent,
    [t('reason')]: <FhirCodesTooltips codings={reasonCode} />,
    [t('Description')]: description,
  };
  return {
    title: getTitle(codeableCode, code),
    headerRightData: { [t('Date created')]: dateToLocaleString(authoredOn) },
    headerLeftData: { [t('Id')]: id },
    bodyData,
    status: {
      title: status,
      color: 'green',
    },
  };
}
