import { IImmunizationRecommendation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunizationRecommendation';
import { get } from 'lodash';
import { sorterFn } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseImmunizationRecommendation = (obj: IImmunizationRecommendation) => {
  return {
    created: get(obj, 'date'),
    dosesNum: get(obj, 'recommendation.doseNumberPositiveInt'),
    nextDoseDate: get(obj, 'recommendation.0.dateCriterion.0.value'),
  };
};

export type ImmunizationRecTableData = ReturnType<typeof parseImmunizationRecommendation>;

const dateCreatedSorter = sorterFn('created', true);

export const columns = (t: TFunction) => [
  {
    title: t('Date Created'),
    dataIndex: 'created' as const,
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
    sorter: dateCreatedSorter,
  },
  {
    title: t('Next Dose Date'),
    dataIndex: 'nextDoseDate' as const,
  },
  {
    title: t('Number of doses'),
    dataIndex: 'dosesNum' as const,
  },
];
