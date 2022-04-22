import React from 'react';
import { ICondition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICondition';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseCondition = (obj: ICondition) => {
  return {
    condition: getCodeableConcepts(get(obj, 'code')),
    severity: getCodeableConcepts(get(obj, 'severity')),
    verificationStatus: get(obj, 'verificationStatus'),
  };
};

export type ConditionTableData = ReturnType<typeof parseCondition>;

export const columns = [
  {
    title: 'Condition',
    dataIndex: 'condition',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Verification Status',
    dataIndex: 'vstatus',
  },
];
