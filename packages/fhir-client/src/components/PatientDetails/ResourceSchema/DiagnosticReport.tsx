import { IDiagnosticReport } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IDiagnosticReport';
import { get } from 'lodash';
import { sorterFn } from '../../../helpers/utils';

export const parseDiagnosticReport = (obj: IDiagnosticReport) => {
  return {
    issued: get(obj, 'issued'),
    id: get(obj, 'id'),
    conclusion: get(obj, 'conclusion'),
  };
};

export type DiagnosticReportTableData = ReturnType<typeof parseDiagnosticReport>;

const issuedSorter = sorterFn('issued', true);

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Conclusion',
    dataIndex: 'conclusion',
  },
  {
    title: 'Date issued',
    dataIndex: 'issued',
    sorter: issuedSorter,
  },
];
