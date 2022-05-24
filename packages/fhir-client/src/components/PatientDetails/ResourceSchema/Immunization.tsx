import React from 'react';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { get } from 'lodash';
import {
  dateStringSorterFn,
  FhirCodesTooltips,
  getCodeableConcepts,
  rawStringSorterFn,
} from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import type { TFunction } from '@opensrp/i18n';

export const parseImmunization = (obj: IImmunization) => {
  return {
    status: get(obj, 'status'),
    vaccineCode: get(obj, 'vaccineCode'),
    occurenceDateTime: get(obj, 'occurenceDateTime'),
    reasonCode: getCodeableConcepts(get(obj, 'reasonCode')),
    id: get(obj, 'id'),
  };
};

export type ImmunizationTableData = ReturnType<typeof parseImmunization>;

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    sorter: rawStringSorterFn,
  },
  {
    title: t('Administration Date'),
    dataIndex: 'occurenceDateTime',
    sorter: dateStringSorterFn,
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
  },
  {
    title: t('Vaccine Admnistered'),
    dataIndex: 'vaccineCode',
  },
  {
    title: t('Reason'),
    dataIndex: 'reasonCode',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
];
