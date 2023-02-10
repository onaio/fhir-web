import { IMedicationAdministration } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedicationAdministration';
import { get } from 'lodash';
import type { TFunction } from '@opensrp/i18n';
import { sorterFn } from '../../../helpers/utils';

export const parseMedicationAdministration = (obj: IMedicationAdministration) => {
  return {
    status: get(obj, 'status'),
    id: get(obj, 'id'),
    occurenceDateTime: get(obj, 'occurenceDateTime'),
  };
};

export type MedicationAdminTableData = ReturnType<typeof parseMedicationAdministration>;

const statusSorterFn = sorterFn('status');

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id',
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    sorter: statusSorterFn,
  },
  {
    title: t('Occurence Date'),
    dataIndex: 'occurenceDateTime',
    render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
  },
];
