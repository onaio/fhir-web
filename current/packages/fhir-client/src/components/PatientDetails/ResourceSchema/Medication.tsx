import React from 'react';
import { IMedication } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedication';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import type { TFunction } from '@opensrp/i18n';

export const parseMedication = (obj: IMedication) => {
  return {
    status: get(obj, 'status'),
    code: getCodeableConcepts(get(obj, 'code')),
    manufacturer: get(obj, 'manufacturer'),
    id: get(obj, 'id'),
  };
};

export type MedicationTableData = ReturnType<typeof parseMedication>;

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Medication'),
    dataIndex: 'details',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: t('Manufacturer'),
    dataIndex: 'manufacturer',
    value: (value: Reference | undefined) => value?.display ?? value?.reference,
  },
];
