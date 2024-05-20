import React from 'react';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { get } from 'lodash';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { getCodeableConcepts, FhirPeriod, FhirCodesTooltips } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseEncounter = (encounter: IEncounter) => {
  return {
    type: getCodeableConcepts(get(encounter, 'type')),
    reason: getCodeableConcepts(get(encounter, 'reasonCode')),
    serviceType: getCodeableConcepts(get(encounter, 'serviceType')),
    priority: getCodeableConcepts(get(encounter, 'priority')),
    status: get(encounter, 'status'),
    classCode: get(encounter, 'class'),
    period: get(encounter, 'period'),
    duration: get(encounter, 'length'),
    serviceProvider: get(encounter, 'serviceProvider'),
    id: get(encounter, 'id'),
    episodeOfCare: get(encounter, 'episodeOfCare'),
  };
};

export const parseEncounterList = (list: IEncounter[]) => {
  return list.map(parseEncounter);
};

export type EncounterTableData = ReturnType<typeof parseEncounter>;

export const columns = (t: TFunction) => [
  {
    title: t('Class'),
    dataIndex: 'classCode' as const,
    render: (value: Coding) => {
      return value.display ?? value.code;
    },
  },
  {
    title: t('Period'),
    dataIndex: 'period' as const,
    render: (value?: Period) => {
      if (value) {
        return <FhirPeriod {...value} />;
      }
      return '';
    },
  },
  {
    title: t('Service type'),
    dataIndex: 'serviceType' as const,
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
];

export const encounterPreviewExtractor = (resource: IEncounter, t: TFunction) => {
  const { reason, period, classCode, id, status, serviceType, episodeOfCare } =
    parseEncounter(resource);
  const headerLeftData = {
    [t('ID')]: id,
  };
  const bodyData = {
    [t('Reason')]: <FhirCodesTooltips codings={reason} />,
    [t('Period')]: <FhirPeriod {...period} />,
    [t('Service Type')]: <FhirCodesTooltips codings={serviceType} />,
    [t('Episode of care')]: episodeOfCare?.[0]?.display ?? episodeOfCare?.[0]?.reference,
  };
  return {
    title: classCode.display ?? classCode.code,
    headerLeftData,
    bodyData,
    status: {
      title: status ?? '',
      color: 'green',
    },
  };
};

/**
 * Get details displayed on encounter detailed view
 *
 * @param resource - encounter object
 * @param t - translation function
 */
export function encounterDetailProps(resource: IEncounter, t: TFunction) {
  const {
    reason,
    period,
    classCode,
    id,
    status,
    serviceType,
    episodeOfCare,
    type,
    serviceProvider,
    priority,
    duration,
  } = parseEncounter(resource);
  const bodyData = {
    [t('Class')]: classCode.display ?? classCode.code,
    [t('Type')]: <FhirCodesTooltips codings={type} />,
    [t('Priority')]: <FhirCodesTooltips codings={priority} />,
    [t('Reason')]: <FhirCodesTooltips codings={reason} />,
    [t('Period')]: <FhirPeriod {...period} />,
    [t('Service provider')]: serviceProvider,
    [t('Encounter Duration')]: duration && `${duration.value} ${duration.unit}`,
    [t('Service Type')]: <FhirCodesTooltips codings={serviceType} />,
    [t('Episode of care')]: episodeOfCare?.[0]?.display ?? episodeOfCare?.[0]?.reference,
  };
  return {
    title: classCode.display ?? classCode.code,
    headerLeftData: { [t('Id')]: id },
    bodyData,
    status: {
      title: status,
      color: 'green',
    },
  };
}
