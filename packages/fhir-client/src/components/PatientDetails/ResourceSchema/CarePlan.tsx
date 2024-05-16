import React from 'react';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import { get } from 'lodash';
import {
  FhirCodesTooltips,
  FhirPeriod,
  getCodeableConcepts,
  sorterFn,
} from '../../../helpers/utils';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import type { TFunction } from '@opensrp/i18n';

export const parseCareplan = (obj: ICarePlan) => {
  return {
    title: get(obj, 'title'),
    period: get(obj, 'period'),
    description: get(obj, 'description'),
    intent: get(obj, 'intent'),
    categories: getCodeableConcepts(get(obj, 'category')),
    status: get(obj, 'status'),
    id: get(obj, 'id'),
  };
};

export const parseCareplanList = (carePlans: ICarePlan[]) => {
  return carePlans.map(parseCareplan);
};

export type CarePlanTableData = ReturnType<typeof parseCareplan>;

export const columns = (t: TFunction) => [
  {
    title: t('Title'),
    dataIndex: 'title' as const,
    sorter: sorterFn('title'),
  },
  {
    title: t('Description'),
    dataIndex: 'description' as const,
  },
  {
    title: t('Period'),
    dataIndex: 'period' as const,
    render: (value: Period) => <FhirPeriod {...value} />,
  },
];

export const carePlanSideViewData = (resoure: ICarePlan, t: TFunction) => {
  const { id, categories, period, title, intent, status } = parseCareplan(resoure);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Category')]: <FhirCodesTooltips codings={categories} />,
    [t('Period')]: <FhirPeriod {...period} />,
    [t('status')]: status,
    [t('intent')]: intent,
  };
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
