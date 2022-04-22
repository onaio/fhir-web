import React from 'react';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { get } from 'lodash';
import { FhirCodesTooltips, getCodeableConcepts, rawStringSorterFn } from '../../../helpers/utils';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export const parseOrganization = (obj: IOrganization) => {
  return {
    type: getCodeableConcepts(get(obj, 'type')),
    name: get(obj, 'name'),
    active: get(obj, 'active'),
  };
};

export type CarePlanTableData = ReturnType<typeof parseOrganization>;

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
    sorter: rawStringSorterFn,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (value: Coding[]) => {
      return <FhirCodesTooltips codings={value} />;
    },
  },
  {
    title: 'Status',
    dataIndex: 'active',
    render: (value: boolean) => (value === true ? 'Active' : 'Inactive'),
  },
];
