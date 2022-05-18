import { IDiagnosticReport } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IDiagnosticReport';
import { get } from 'lodash';
import { dateStringSorterFn } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseDiagnosticReport = (obj: IDiagnosticReport) => {
  return {
    issued: get(obj, 'issued'),
    id: get(obj, 'id'),
    conclusion: get(obj, 'conclusion'),
  };
};

export type DiagnosticReportTableData = ReturnType<typeof parseDiagnosticReport>;

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Conclusion'),
    dataIndex: 'conclusion',
  },
  {
    title: t('Date issued'),
    dataIndex: 'issued',
    sorter: dateStringSorterFn,
  },
];
