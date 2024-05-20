import React from 'react';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import { get, last } from 'lodash';
import {
  FhirCodesTooltips,
  FhirPeriod,
  getCodeableConcepts,
  sorterFn,
} from '../../../helpers/utils';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import type { TFunction } from '@opensrp/i18n';
import { FHIRServiceClass, ResourceItemLoader } from '@opensrp/react-utils';
import { planDefinitionType } from '../../../constants';
import { IPlanDefinition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPlanDefinition';
import { Canonical } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/canonical';

export const parseCareplan = (obj: ICarePlan) => {
  return {
    title: get(obj, 'title'),
    period: get(obj, 'period'),
    description: get(obj, 'description'),
    intent: get(obj, 'intent'),
    categories: getCodeableConcepts(get(obj, 'category')),
    instantiatesCanonical: get(obj, 'instantiatesCanonical'),
    status: get(obj, 'status'),
    created: get(obj, 'created'),
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

export const carePlanSideViewData = (resource: ICarePlan, t: TFunction) => {
  const { id, categories, period, title, intent, status } = parseCareplan(resource);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Category')]: <FhirCodesTooltips codings={categories} />,
    [t('Period')]: <FhirPeriod {...period} />,
    [t('Status')]: status,
    [t('Intent')]: intent,
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

const getPlandefinitionTitle = (instantiatesCanonical?: Canonical[], fhirBaseURL?: string) => {
  const planDefinitionId = last(instantiatesCanonical?.[0]?.split('/'));
  if (fhirBaseURL && planDefinitionId) {
    const props = {
      resourceQueryParams: {
        queryKey: [planDefinitionType, planDefinitionId],
        queryFn: async () =>
          new FHIRServiceClass<IPlanDefinition>(fhirBaseURL, planDefinitionType).read(
            planDefinitionId
          ),
      },
      itemGetter: (obj: IPlanDefinition) => obj.title ?? obj.name,
    };
    return <ResourceItemLoader<IPlanDefinition> {...props} />;
  }
  return null;
};

/**
 * Get details desplayed on care plan detailed view
 *
 * @param resource - conditions object
 * @param t - translation function
 * @param fhirBaseURL - fhir base URL
 */
export function carePlanDetailsProps(resource: ICarePlan, t: TFunction, fhirBaseURL?: string) {
  const {
    id,
    categories,
    description,
    period,
    title,
    intent,
    status,
    created,
    instantiatesCanonical,
  } = parseCareplan(resource);
  const headerRightData = {
    [t('Date created')]: created,
  };

  const bodyData = {
    [t('Category')]: <FhirCodesTooltips codings={categories} />,
    [t('Period')]: <FhirPeriod {...period} />,
    [t('Status')]: status,
    [t('Intent')]: intent,
    [t('Canonical (PlanDefinition)')]: getPlandefinitionTitle(instantiatesCanonical, fhirBaseURL),
    [t('Address')]: get(resource, 'address.0.line.0') || 'N/A',
    [t('Description')]: description,
  };
  return {
    title,
    headerRightData,
    headerLeftData: { [t('Id')]: id },
    bodyData,
    status: {
      title: status,
      color: 'green',
    },
  };
}
