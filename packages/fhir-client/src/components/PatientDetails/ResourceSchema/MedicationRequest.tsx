import React from 'react';
import { IMedicationRequest } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedicationRequest';
import { get } from 'lodash';
import { intlFormatDateStrings } from '@opensrp/react-utils';
import { FhirCodesTooltips, getCodeableConcepts, rawStringSorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseMedicationRequest = (obj: IMedicationRequest) => {
  return {
    authoredOn: get(obj, 'authoredOn'),
    id: get(obj, 'id'),
    reasonCodes: getCodeableConcepts(get(obj, 'reasonCode')),
  };
};

export type MeidationRequestTableData = ReturnType<typeof parseMedicationRequest>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Details',
    dataIndex: 'reasonCodes',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Authored on',
    dataIndex: 'authoredOn',
    sorter: rawStringSorterFn,
    render: (value: string) => intlFormatDateStrings(value),
  },
];
