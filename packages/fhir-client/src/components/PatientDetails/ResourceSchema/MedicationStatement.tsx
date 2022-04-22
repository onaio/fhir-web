import { IMedicationStatement } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedicationStatement';
import { get } from 'lodash';

export const parseMedicationStatement = (obj: IMedicationStatement) => {
  return {
    status: get(obj, 'status'),
    id: get(obj, 'id'),
    dateAsserted: get(obj, 'dateAsserted'),
  };
};

export type MedicationStatementTableData = ReturnType<typeof parseMedicationStatement>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Date asserted',
    dataIndex: 'dateAsserted',
  },
];
