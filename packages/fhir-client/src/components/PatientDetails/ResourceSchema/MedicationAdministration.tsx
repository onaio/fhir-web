import { IMedicationAdministration } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedicationAdministration';
import { get } from 'lodash';
import { intlFormatDateStrings } from '@opensrp/react-utils';
import { rawStringSorterFn } from '../../../helpers/utils';

export const parseMedicationAdministration = (obj: IMedicationAdministration) => {
  return {
    status: get(obj, 'status'),
    id: get(obj, 'id'),
    occurenceDateTime: get(obj, 'occurenceDateTime'),
  };
};

export type MedicationAdminTableData = ReturnType<typeof parseMedicationAdministration>;

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: rawStringSorterFn,
  },
  {
    title: 'Occurence Date',
    dataIndex: 'occurenceDateTime',
    render: (value: string) => intlFormatDateStrings(value),
  },
];
